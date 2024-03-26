import uuid
from typing import List, Any
from fastapi import APIRouter, Depends
from api.auth import verify_token
from api.models.movie_dtos import MovieDTO, MovieCreationDTO
from api.utilities.opensearch_operations import index_document

router = APIRouter()


@router.post(
    path="/movies",
    response_model=Any,
    description="Add a movie to Opensearch index.",
    dependencies=[Depends(verify_token)],
)
def add_movie(
    new_movie: MovieCreationDTO,
) -> MovieDTO:
    movie = MovieDTO(id=uuid.uuid4(), name=new_movie.name, director=new_movie.director)
    return index_document("movies", movie.model_dump(), movie.id)


@router.post(
    "/movies/bulk",
    response_model=List[MovieDTO],
    description="Add movies to Opensearch index.",
    dependencies=[Depends(verify_token)],
)
def add_movies(
    new_movies: List[MovieCreationDTO],
) -> List[MovieDTO]:
    return [
        MovieDTO(id=uuid.uuid4(), name=new_movie.name, director=new_movie.director)
        for new_movie in new_movies
    ]


@router.get(
    path="/movies",
    response_model=List[MovieDTO],
    description="Add a movie to Opensearch index.",
    dependencies=[Depends(verify_token)],
)
def get_movies() -> List[MovieDTO]:
    return [
        MovieDTO(id=uuid.uuid4(), name="Oppenheimer1", director="Chris Nolan1"),
        MovieDTO(id=uuid.uuid4(), name="Oppenheimer2", director="Chris Nolan2"),
        MovieDTO(id=uuid.uuid4(), name="Oppenheimer3", director="Chris Nolan3"),
    ]


@router.delete(
    path="/movies",
    status_code=204,
    description="Delete movies from Opensearch index.",
    dependencies=[Depends(verify_token)],
)
def delete_movies() -> None:
    pass
