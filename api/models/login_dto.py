import datetime
from pydantic import BaseModel


class RegistrationDTO(BaseModel):
    username: str
    password: str
    name: str
    surname: str
    date_of_birth: datetime.datetime


class UserDTO(RegistrationDTO):
    id: str
    username: str
    password: str
    name: str
    surname: str
    date_of_birth: datetime.datetime


class Token(BaseModel):
    access_token: str
    token_type: str
