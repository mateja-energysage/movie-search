from fastapi import FastAPI, APIRouter
from mangum import Mangum
from api.routers.movie_router import router as movie_router
from api.routers.login_router import router as login_router

# TODO: Configure logging to level info

app = FastAPI()
router = APIRouter(prefix="/api/v1")
router.include_router(movie_router)
router.include_router(login_router)


app.include_router(router)
handler = Mangum(app, lifespan="off")
