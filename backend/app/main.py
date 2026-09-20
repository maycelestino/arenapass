from fastapi import FastAPI

from app.database import Base, engine
from app.routes import users

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ArenaPass API",
    description="API para gerenciamento seguro de usuários.",
    version="1.0.0"
)

app.include_router(users.router)


@app.get("/")
def home():
    return {"message": "ArenaPass API funcionando!"}