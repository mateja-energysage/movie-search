import uuid
from typing import List, Dict, Any

from fastapi import APIRouter

from api.models.login_dto import LoginDTO, RegistrationDTO
from api.models.movie_dtos import MovieDTO, MovieCreationDTO

router = APIRouter()


@router.post(
    path="/login",
    response_model=Dict[Any, Any],
    description="Route for login.",
)
def add_movie(
    login_dto: LoginDTO,
) -> Dict[Any, Any]:
    return {"state": "Successful login!"}


@router.post(
    path="/registration",
    response_model=Dict[Any, Any],
    description="Route for registration.",
)
def add_movie(
    registration_dto: RegistrationDTO,
) -> Dict[Any, Any]:
    return {"state": "Successful registration!"}



