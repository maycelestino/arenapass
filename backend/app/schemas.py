from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    nome: str
    email: EmailStr
    senha: str = Field(min_length=6)
    perfil: Literal["administrador", "operador", "cliente"]


class UserUpdate(BaseModel):
    nome: str
    email: EmailStr
    perfil: Literal["administrador", "operador", "cliente"]


class UserResponse(BaseModel):
    id: int
    nome: str
    email: str
    perfil: str

    model_config = ConfigDict(from_attributes=True)