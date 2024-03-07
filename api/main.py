from fastapi import FastAPI
from mangum import Mangum

app = FastAPI()


@app.get("/tasks")
async def get_tasks():
    # database lookup goes here
    return [{"id": "ptvWZ3", "text": "hello!"}, {"id": "cqDUr3", "text": "another!"}]


@app.get("/")
async def root():
    return {"message": "Hello World!"}


handler = Mangum(app, lifespan="off")