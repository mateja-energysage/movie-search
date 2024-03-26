import logging
import os

import boto3
from fastapi import HTTPException
from opensearchpy import (
    AWSV4SignerAuth,
    OpenSearch,
    RequestsHttpConnection,
    OpenSearchException,
)

CHUNK_SIZE = 500
service = "es"
credentials = boto3.Session().get_credentials()
auth = AWSV4SignerAuth(credentials, "us-east-1", service)
client = OpenSearch(
    hosts=[{"host": os.environ.get("OPENSEARCH_ENDPOINT", "localhost"), "port": 443}],
    http_auth=auth,
    use_ssl=True,
    verify_certs=True,
    connection_class=RequestsHttpConnection,
    pool_maxsize=20,
)


def index_document(index_name, document_body, document_id):
    try:
        response = client.index(
            index=index_name,
            body=document_body,
            id=document_id,
            refresh=True,
        )
    except OpenSearchException as e:
        logging.exception(e, exc_info=True)
        raise HTTPException(status_code=500, detail="OpenSearch error has occurred")
    return response
