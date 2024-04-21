import datetime
import uuid
from enum import Enum

from pydantic import BaseModel


class NewMovieDTO(BaseModel):
    name: str
    runtime: int
    vote_average: float
    vote_count: int
    revenue: int
    budget: int
    release_date: datetime.datetime | None
    adult: bool
    overview: str | None
    genres: list[str] | None
    production_companies: list[str] | None


class MovieDTO(BaseModel):
    id: str = str(uuid.uuid4())
    name: str
    runtime: int
    vote_average: float
    vote_count: int
    revenue: int
    budget: int
    release_date: datetime.datetime | None
    adult: bool
    overview: str | None
    genres: list[str] | None
    production_companies: list[str] | None


class SearchBodyDTO(BaseModel):
    # This will search through name, overview and production companies
    q: str | None
    runtime_lte: int | None
    runtime_gte: int | None
    vote_average_lte: float | None
    vote_average_gte: float | None
    vote_count_lte: int | None
    vote_count_gte: int | None
    revenue_lte: int | None
    revenue_gte: int | None
    budget_lte: int | None
    budget_gte: int | None
    is_adult: bool | None
    genres: list[str] | None


class SearchResultDTO(BaseModel):
    results: list[MovieDTO]
    total_count: int
    total_pages: int


class ExtendedStatType(str, Enum):
    runtime = "runtime"
    budget = "budget"
    revenue = "revenue"
