from pydantic import BaseModel


class MovieDTO(BaseModel):
    id: int
    name: str
    runtime: int
