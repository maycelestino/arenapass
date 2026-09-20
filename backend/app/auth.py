import os
from datetime import datetime, timedelta, timezone

import jwt
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
TOKEN_EXPIRE_MINUTES = 30


def create_access_token(user_id: int, nome: str, perfil: str):
    agora = datetime.now(timezone.utc)

    payload = {
        "sub": str(user_id),
        "nome": nome,
        "perfil": perfil,
        "iat": agora,
        "exp": agora + timedelta(minutes=TOKEN_EXPIRE_MINUTES)
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)