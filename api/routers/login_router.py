import datetime
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from api.auth import (
    create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    authenticate_user,
    get_password_hash,
)
from api.models.login_dto import RegistrationDTO, Token
from api.utilities.dynamo_operations import put_item_into_table

router = APIRouter()


@router.post("/login")
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> Token:
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


@router.post(
    path="/registration",
    response_model=Dict[Any, Any],
    description="Route for registration.",
)
def registration(
    registration_dto: RegistrationDTO,
) -> Dict[Any, Any]:
    registration_dto.password = get_password_hash(registration_dto.password)
    put_item_into_table(registration_dto.model_dump())
    return registration_dto.model_dump()
