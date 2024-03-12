import datetime
from pydantic import BaseModel


class LoginDTO(BaseModel):
    username: str
    password: str


class RegistrationDTO(BaseModel):
    username: str
    password: str
    name: str
    surname: str
    date_of_birth: datetime.datetime