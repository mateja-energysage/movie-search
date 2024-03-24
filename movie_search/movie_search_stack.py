from constructs import Construct
from aws_cdk import Stack, RemovalPolicy, Duration
from aws_cdk.aws_lambda import Runtime, Function, Code, Architecture
import aws_cdk.aws_apigateway as apigateway
from aws_cdk.aws_dynamodb import (
    Attribute,
    AttributeType,
    Table,
    TableEncryption,
)


class MovieSearchStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        self.user_table = Table(
            self,
            "user_table",
            partition_key=Attribute(name="email", type=AttributeType.STRING),
            encryption=TableEncryption.AWS_MANAGED,
            removal_policy=RemovalPolicy.DESTROY,
        )

        self.movie_handler_lambda = Function(
            self,
            "MovieHandlerFunction",
            architecture=Architecture.ARM_64,
            runtime=Runtime.PYTHON_3_12,
            code=Code.from_asset("artifact.zip"),
            handler="api.main.handler",
            environment={"USER_TABLE_NAME": self.user_table.table_name},
            timeout=Duration.seconds(10),
            memory_size=256,
        )
        self.user_table.grant_read_write_data(self.movie_handler_lambda)

        self.api = apigateway.LambdaRestApi(
            self, "MovieAPIGateway", handler=self.movie_handler_lambda
        )
