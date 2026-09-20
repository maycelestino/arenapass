from fastapi import FastAPI

from app.database import Base, engine
from app.routes import auth, users
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ArenaPass API",
    description="API para gerenciamento seguro de usuários.",
    version="1.0.0"
)

app.include_router(auth.router)
app.include_router(users.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def home():
    return {"message": "ArenaPass API funcionando!"}