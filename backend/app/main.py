from fastapi import FastAPI

from app.database import Base, engine
from app import models

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ArenaPass API",
    description="API para gerenciamento seguro de usuários.",
    version="1.0.0"
)


@app.get("/")
def home():
    return {"message": "ArenaPass API funcionando!"}