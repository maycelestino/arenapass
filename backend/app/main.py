from fastapi import FastAPI

app = FastAPI(
    title="ArenaPass API",
    description="API para gerenciamento seguro de usuários.",
    version="1.0.0"
)


@app.get("/")
def home():
    return {"message": "ArenaPass API funcionando!"}