from aws_cdk.aws_opensearchservice import (
    Domain,
    EngineVersion,
    AdvancedSecurityOptions,
    CapacityConfig,
    EncryptionAtRestOptions,
)
from constructs import Construct
from aws_cdk import (
    Stack,
    RemovalPolicy,
    Duration,
    aws_iam,
    Size,
    aws_sqs as sqs,
    aws_lambda_event_sources,
    aws_cloudfront as cloudfront,
    aws_cloudfront_origins as origins,
    CfnOutput,
)
from aws_cdk.aws_lambda import Runtime, Function, Code, Architecture
import aws_cdk.aws_apigateway as apigateway
from aws_cdk.aws_dynamodb import (
    Attribute,
    AttributeType,
    Table,
    TableEncryption,
)
import aws_cdk.aws_s3 as s3
from aws_cdk import aws_s3_deployment as s3deploy


class MovieSearchStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)
        path = "movie_search/resources/build"

        self.movie_bucket = s3.Bucket(
            self,
            "MovieBucket",
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            removal_policy=RemovalPolicy.DESTROY,
            auto_delete_objects=True,
        )
        s3deploy.BucketDeployment(
            self,
            "UploadMovies",
            sources=[s3deploy.Source.asset("./archive.zip")],
            destination_bucket=self.movie_bucket,
            memory_limit=2048,
            ephemeral_storage_size=Size.mebibytes(2048),
            retain_on_delete=False,
        )

        self.user_table = Table(
            self,
            "user_table",
            partition_key=Attribute(name="username", type=AttributeType.STRING),
            encryption=TableEncryption.AWS_MANAGED,
            removal_policy=RemovalPolicy.DESTROY,
        )
        self.movie_domain = Domain(
            self,
            "movie-domain",
            version=EngineVersion.OPENSEARCH_2_9,
            capacity=CapacityConfig(
                data_node_instance_type="t3.small.search",
            ),
            access_policies=[
                aws_iam.PolicyStatement(
                    actions=["es:*"],
                    effect=aws_iam.Effect.ALLOW,
                    principals=[aws_iam.AccountPrincipal(self.account)],
                    resources=["*"],
                ),
            ],
        )

        self.queue = sqs.Queue(
            self, "BulkUploadQueue", visibility_timeout=Duration.seconds(600)
        )

        self.movie_handler_lambda = Function(
            self,
            "MovieHandlerFunction",
            architecture=Architecture.ARM_64,
            runtime=Runtime.PYTHON_3_12,
            code=Code.from_asset("artifact.zip"),
            handler="api.main.handler",
            environment={
                "USER_TABLE_NAME": self.user_table.table_name,
                "OPENSEARCH_ENDPOINT": self.movie_domain.domain_endpoint,
                "S3_BUCKET_NAME": self.movie_bucket.bucket_name,
                "QUEUE_URL": self.queue.queue_url,
            },
            timeout=Duration.seconds(120),
            memory_size=512,
        )
        self.queue.grant_send_messages(self.movie_handler_lambda)

        self.bulk_upload_lambda = Function(
            self,
            "BulkUploadFunction",
            architecture=Architecture.ARM_64,
            runtime=Runtime.PYTHON_3_12,
            code=Code.from_asset("artifact.zip"),
            handler="api.handlers.bulk_upload_handler",
            environment={
                "OPENSEARCH_ENDPOINT": self.movie_domain.domain_endpoint,
                "S3_BUCKET_NAME": self.movie_bucket.bucket_name,
            },
            timeout=Duration.seconds(600),
            memory_size=2048,
        )

        self.event_source = aws_lambda_event_sources.SqsEventSource(self.queue)
        self.bulk_upload_lambda.add_event_source(self.event_source)

        self.user_table.grant_read_write_data(self.movie_handler_lambda)
        self.movie_domain.grant_read_write(self.movie_handler_lambda)
        self.movie_bucket.grant_read_write(self.movie_handler_lambda)

        self.movie_domain.grant_read_write(self.bulk_upload_lambda)
        self.movie_bucket.grant_read_write(self.bulk_upload_lambda)

        self.api = apigateway.LambdaRestApi(
            self,
            "MovieAPIGateway",
            handler=self.movie_handler_lambda,
            default_cors_preflight_options=apigateway.CorsOptions(
                allow_origins=apigateway.Cors.ALL_ORIGINS,
                allow_methods=apigateway.Cors.ALL_METHODS,
            ),
        )

        ### FRONTEND PART OF CDK ###
        self.hosting_bucket = s3.Bucket(
            self,
            "FrontendBucket",
            auto_delete_objects=True,
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            removal_policy=RemovalPolicy.DESTROY,
        )

        self.cloudfront_oai = cloudfront.OriginAccessIdentity(self, "CloudFrontOAI")

        # Add a bucket policy to allow CloudFront OAI to access S3 objects
        self.hosting_bucket.add_to_resource_policy(
            aws_iam.PolicyStatement(
                actions=["s3:GetObject"],
                resources=[self.hosting_bucket.arn_for_objects("*")],
                principals=[
                    aws_iam.CanonicalUserPrincipal(
                        self.cloudfront_oai.cloud_front_origin_access_identity_s3_canonical_user_id
                    )
                ],
            )
        )

        self.distribution = cloudfront.Distribution(
            self,
            "CloudfrontDistribution",
            default_behavior=cloudfront.BehaviorOptions(
                origin=origins.S3Origin(
                    self.hosting_bucket, origin_access_identity=self.cloudfront_oai
                ),
                viewer_protocol_policy=cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                allowed_methods=cloudfront.AllowedMethods.ALLOW_ALL,
                cache_policy=cloudfront.CachePolicy.CACHING_DISABLED,
            ),
            default_root_object="index.html",
            error_responses=[
                cloudfront.ErrorResponse(
                    http_status=403,
                    response_http_status=200,
                    response_page_path="/index.html",
                ),
                cloudfront.ErrorResponse(
                    http_status=404,
                    response_http_status=200,
                    response_page_path="/index.html",
                ),
                cloudfront.ErrorResponse(
                    http_status=405,
                    response_http_status=200,
                    response_page_path="/index.html",
                ),
            ],
        )

        s3deploy.BucketDeployment(
            self,
            "BucketDeployment",
            sources=[s3deploy.Source.asset(path)],
            destination_bucket=self.hosting_bucket,
            distribution=self.distribution,
            distribution_paths=["/*"],
        )

        CfnOutput(
            self,
            "CloudFrontURL",
            value=self.distribution.domain_name,
            description="The distribution URL",
            export_name="CloudfrontURL",
        )

        CfnOutput(
            self,
            "BucketName",
            value=self.hosting_bucket.bucket_name,
            description="The name of the S3 bucket",
            export_name="BucketName",
        )
