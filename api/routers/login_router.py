import datetime
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from api.auth import (
    create_access_token,
    fake_users_db,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    authenticate_user,
)
from api.models.login_dto import RegistrationDTO, UserDTO, Token

router = APIRouter()


@router.post("/login")
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> Token:
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
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
    return {"state": "Successful registration!"}
