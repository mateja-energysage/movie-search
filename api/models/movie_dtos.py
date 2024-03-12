from uuid import UUID
from pydantic import BaseModel


class MovieCreationDTO(BaseModel):
    name: str
    director: str


class MovieDTO(BaseModel):
    id: UUID
    name: str
    director: str
