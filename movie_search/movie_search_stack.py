from constructs import Construct
from aws_cdk import (
    Stack,
)
from aws_cdk.aws_lambda import (
Runtime,
Function,
Code,
Architecture
)
import aws_cdk.aws_apigateway as apigateway


class MovieSearchStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        movie_handler_lambda = Function(
            self, 'MovieHandlerFunction',
            architecture=Architecture.ARM_64,
            runtime=Runtime.PYTHON_3_12,
            code=Code.from_asset("artifact.zip"),
            handler='api.main.handler',
        )

        api = apigateway.LambdaRestApi(self, "MovieAPIGateway", handler=movie_handler_lambda)
