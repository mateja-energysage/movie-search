import logging
import math
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

from api.models.movie_dtos import MovieDTO, SearchBodyDTO, SearchResultDTO

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


def set_result_window() -> None:
    try:
        client.indices.put_settings(index="movies", body={'index' :
                             {'max_result_window':50000}})
    except OpenSearchException as e:
        logging.error(e, exc_info=True)
        raise HTTPException(status_code=500, detail="Opensearch error has occurred")


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


def generate_search_query(
    page: int, sort_by: str, params: SearchBodyDTO
) -> dict[Any, Any]:
    query = {
        "track_total_hits": True,
        "query": {
            "bool": {
                "must": [],
                "filter": [],
            }
        },
        "from": (page - 1) * 100,
        "size": 100,
        "sort": [{sort_by: {"order": "desc"}}],
    }

    if params.q:
        query["query"]["bool"]["must"].append(
            {
                "bool": {
                    "should": [
                        {"match_phrase_prefix": {field: params.q}}
                        for field in [
                            "name",
                            "overview",
                            "production_companies",
                        ]
                    ]
                }
            }
        )

    range_params = {
        "runtime": {"lte": params.runtime_lte, "gte": params.runtime_gte},
        "vote_average": {
            "lte": params.vote_average_lte,
            "gte": params.vote_average_gte,
        },
        "vote_count": {"lte": params.vote_count_lte, "gte": params.vote_count_gte},
        "revenue": {"lte": params.revenue_lte, "gte": params.revenue_gte},
        "budget": {"lte": params.budget_lte, "gte": params.budget_gte},
    }

    if params.is_adult:
        query["query"]["bool"]["filter"].append({"term": {"adult": params.is_adult}})

    # TODO: Check this one
    if params.genres:
        query["query"]["bool"]["filter"].append(
            {"terms": {"genres.keyword": params.genres}}
        )

    for field, params in range_params.items():
        if params["lte"] is not None:
            query["query"]["bool"]["filter"].append(
                {"range": {field: {"lte": params["lte"]}}}
            )
        if params["gte"] is not None:
            query["query"]["bool"]["filter"].append(
                {"range": {field: {"gte": params["gte"]}}}
            )

    return query


def get_movies_from_os(
    page: int, sort_by: str, params: SearchBodyDTO
) -> SearchResultDTO:
    search_query = generate_search_query(page=page, sort_by=sort_by, params=params)
    try:
        response = client.search(body=search_query, index="movies")
    except OpenSearchException as e:
        logging.error(e, exc_info=True)
        raise HTTPException(status_code=500, detail="Opensearch error has occurred")
    return SearchResultDTO(
        results=[MovieDTO(**elem["_source"]) for elem in response["hits"]["hits"]],
        total_count=response["hits"]["total"]["value"],
        total_pages=math.ceil(response["hits"]["total"]["value"] / 100),
    )
