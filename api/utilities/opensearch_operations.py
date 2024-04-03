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

from api.models.movie_dtos import MovieDTO, SearchBodyDTO

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
    timeout=30,
)


def index_document(document_body):
    try:
        response = client.index(
            index="movies",
            body=document_body,
            id=document_body["id"],
            refresh=True,
        )
    except OpenSearchException as e:
        logging.exception(e, exc_info=True)
        raise HTTPException(status_code=500, detail="OpenSearch error has occurred")
    return response


def populate_index(data: List[MovieDTO]) -> None:
    indexed_data = []
    for elem in data:
        indexed_data.append({"index": {"_id": elem.id}})
        indexed_data.append(elem.model_dump())

    response = client.bulk(body=indexed_data, index="movies")
    logging.info(f"Number of populated indexes: {len(response['items'])}")


def delete_index() -> None:
    try:
        client.indices.delete(index="movies")
    except OpenSearchException as e:
        logging.error(e, exc_info=True)
        raise HTTPException(status_code=500, detail="Opensearch error has occurred")


def get_movie_by_id_os(id: Any) -> MovieDTO:
    try:
        response = client.get(
            id=str(id),
            index="movies",
        )
    except OpenSearchException as e:
        logging.error(e, exc_info=True)
        raise HTTPException(status_code=500, detail="Opensearch error has occurred")
    return MovieDTO(**response["_source"])


def generate_search_query(page: int, params: SearchBodyDTO | None) -> dict[Any, Any]:
    search_query = {"from": (page - 1) * 100, "size": 100}
    return search_query


def get_movies_from_os(page: int, params: SearchBodyDTO | None) -> List[MovieDTO]:
    search_query = generate_search_query(page, params)
    try:
        response = client.search(body=search_query, index="movies")
    except OpenSearchException as e:
        logging.error(e, exc_info=True)
        raise HTTPException(status_code=500, detail="Opensearch error has occurred")
    return [MovieDTO(**elem["_source"]) for elem in response["hits"]["hits"]]
