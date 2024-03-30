from typing import List, Any
from fastapi import APIRouter, Depends
from api.auth import verify_token
from api.models.movie_dtos import MovieDTO
from api.utilities.opensearch_operations import index_document
from api.utilities.s3_operations import process_csv_file

router = APIRouter()


@router.post(
    path="/movies",
    response_model=Any,
    description="Add a movie to Opensearch index.",
    dependencies=[Depends(verify_token)],
)
def add_movie(
    new_movie: MovieDTO,
) -> MovieDTO:
    return index_document("movies", new_movie.model_dump(), new_movie.id)


@router.post(
    "/movies/bulk",
    response_model=Any,
    description="Add movies to Opensearch index.",
    dependencies=[Depends(verify_token)],
)
def add_movies(chunks: int | None = 1) -> List[MovieDTO]:
    process_csv_file(chunks)
    return {"status": "success"}


@router.get(
    path="/movies",
    response_model=List[MovieDTO],
    description="Add a movie to Opensearch index.",
    dependencies=[Depends(verify_token)],
)
def get_movies() -> List[MovieDTO]:
    return [
        MovieDTO(id=1, name="Oppenheimer1", runtime=20),
        MovieDTO(id=2, name="Oppenheimer2", runtime=20),
        MovieDTO(id=3, name="Oppenheimer3", runtime=20),
    ]


@router.delete(
    path="/movies",
    status_code=204,
    description="Delete movies from Opensearch index.",
    dependencies=[Depends(verify_token)],
)
def delete_movies() -> None:
    pass
