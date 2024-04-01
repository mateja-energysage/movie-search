from pydantic import BaseModel


class MovieDTO(BaseModel):
    id: int
    name: str
    runtime: int


class SearchBodyDTO(BaseModel):
    name: str
    runtime: int
