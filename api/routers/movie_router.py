import os
from typing import List, Any, Dict

import boto3
from fastapi import APIRouter, Depends
from api.auth import verify_token
from api.models.movie_dtos import (
    MovieDTO,
    SearchBodyDTO,
    NewMovieDTO,
    SearchResultDTO,
    ExtendedStatType,
)
from api.utilities.opensearch_operations import (
    index_document,
    delete_index,
    get_movies_from_os,
    get_movie_by_id_os,
    set_result_window,
    get_movies_extended_stats_opensearch,
)

router = APIRouter()


@router.post(
    path="/movies",
    response_model=Any,
    description="Add a movie to Opensearch index.",
    dependencies=[Depends(verify_token)],
)
def add_movie(
    new_movie: NewMovieDTO,
) -> Any:
    return index_document(MovieDTO(**new_movie.model_dump()).model_dump())


@router.post(
    "/movies/bulk",
    response_model=dict[str, str],
    description="Add movies to Opensearch index.",
    dependencies=[Depends(verify_token)],
)
def add_movies(chunks: int | None = 10) -> dict[str, str]:
    sqs = boto3.client("sqs")

    sqs.send_message(QueueUrl=os.environ.get("QUEUE_URL"), MessageBody=str(chunks))

    return {"status": "success"}


@router.post(
    path="/movies/search",
    response_model=SearchResultDTO,
    description="Get a list of movies matching params.",
    dependencies=[Depends(verify_token)],
)
def get_movies(
    search_body: SearchBodyDTO,
    page: int | None = 1,
    sort_by: str | None = "vote_average",
) -> SearchResultDTO:
    return get_movies_from_os(page=page, sort_by=sort_by, params=search_body)


@router.get(
    path="/movies/extended-stats",
    response_model=Any,
    description="Get extended stats about runtime, budget or revenue of movies.",
    dependencies=[Depends(verify_token)],
)
def get_movies_extended_stats(extended_stat_type: ExtendedStatType) -> Any:
    return get_movies_extended_stats_opensearch(extended_stat_type=extended_stat_type)


@router.get(
    path="/movies/{id}",
    response_model=MovieDTO,
    description="Add a movie to Opensearch index.",
    dependencies=[Depends(verify_token)],
)
def get_movie_by_id(id: str) -> MovieDTO:
    return get_movie_by_id_os(id=id)


@router.delete(
    path="/movies",
    status_code=204,
    description="Delete movies from Opensearch index.",
    dependencies=[Depends(verify_token)],
)
def delete_movies() -> None:
    delete_index()
