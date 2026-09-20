from getpass import getpass

import bcrypt

from app.database import Base, SessionLocal, engine
from app.models import User

Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    print("\n--- Criar administrador ArenaPass ---")

    nome = input("Nome: ")
    email = input("E-mail: ")
    senha = getpass("Senha: ")

    if len(senha) < 6:
        print("A senha deve possuir pelo menos 6 caracteres.")
    elif db.query(User).filter(User.email == email).first():
        print("Este e-mail já está cadastrado.")
    else:
        senha_hash = bcrypt.hashpw(
            senha.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        admin = User(
            nome=nome,
            email=email,
            senha_hash=senha_hash,
            perfil="administrador"
        )

        db.add(admin)
        db.commit()

        print("Administrador criado com sucesso!")

finally:
    db.close()