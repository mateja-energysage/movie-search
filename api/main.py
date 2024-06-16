from fastapi import FastAPI, APIRouter
from mangum import Mangum
from starlette.middleware.cors import CORSMiddleware

from api.routers.movie_router import router as movie_router
from api.routers.login_router import router as login_router

# TODO: Configure logging to level info

app = FastAPI()
router = APIRouter(prefix="/api/v1")
router.include_router(movie_router)
router.include_router(login_router)


app.include_router(router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
handler = Mangum(app, lifespan="off")
