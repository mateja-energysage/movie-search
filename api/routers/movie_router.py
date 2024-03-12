import uuid
from typing import List

from fastapi import APIRouter
from fastapi.openapi.models import Response

from api.models.movie_dtos import MovieDTO, MovieCreationDTO

router = APIRouter()


@router.post(
    path="/movies",
    response_model=MovieDTO,
    description="Add a movie to Opensearch index.",
)
def add_movie(
    new_movie: MovieCreationDTO,
) -> MovieDTO:
    return MovieDTO(id=uuid.uuid4(), name=new_movie.name, director=new_movie.director)


@router.post(
    "/movies/bulk",
    response_model=List[MovieDTO],
    description="Add movies to Opensearch index.",
)
def add_movies(
        new_movies: List[MovieCreationDTO],
) -> List[MovieDTO]:
    return [MovieDTO(id=uuid.uuid4(), name=new_movie.name, director=new_movie.director) for new_movie in new_movies]


@router.get(
    path="/movies",
    response_model=List[MovieDTO],
    description="Add a movie to Opensearch index.",
)
def get_movies() -> List[MovieDTO]:
    return [MovieDTO(id=uuid.uuid4(), name="Oppenheimer1", director="Chris Nolan1"),
            MovieDTO(id=uuid.uuid4(), name="Oppenheimer2", director="Chris Nolan2"),
            MovieDTO(id=uuid.uuid4(), name="Oppenheimer3", director="Chris Nolan3")]


@router.delete(
    path="/movies",
    status_code=204,
    description="Delete movies from Opensearch index.",
)
def delete_movies() -> None:
    pass
