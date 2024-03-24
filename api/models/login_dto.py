import datetime
from pydantic import BaseModel


class LoginDTO(BaseModel):
    email: str
    password: str


class RegistrationDTO(BaseModel):
    username: str
    password: str
    name: str
    surname: str
    date_of_birth: datetime.datetime


class UserDTO(RegistrationDTO):
    id: str


class Token(BaseModel):
    access_token: str
    token_type: str
