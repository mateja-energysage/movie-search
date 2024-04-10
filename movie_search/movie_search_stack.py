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
            partition_key=Attribute(name="email", type=AttributeType.STRING),
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
            self, "MovieAPIGateway", handler=self.movie_handler_lambda
        )
