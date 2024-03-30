import logging
import os
from typing import Any, List

import boto3
from fastapi import HTTPException
from opensearchpy import (
    AWSV4SignerAuth,
    OpenSearch,
    RequestsHttpConnection,
    OpenSearchException,
)

from api.models.movie_dtos import MovieDTO

CHUNK_SIZE = 10000
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


def split_data_into_chunks(lst: List[MovieDTO]) -> list[list[MovieDTO]]:
    return [lst[i : i + CHUNK_SIZE] for i in range(0, len(lst), CHUNK_SIZE)]


def populate_index(data: List[MovieDTO]) -> None:
    indexed_data = []
    for elem in data:
        indexed_data.append({"index": {"_id": elem.id}})
        indexed_data.append(elem.model_dump())

    response = client.bulk(body=indexed_data, index="movies1")
    logging.info(f"Number of populated indexes: {len(response['items'])}")