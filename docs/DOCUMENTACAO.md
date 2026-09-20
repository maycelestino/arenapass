# Documentação da API - ArenaPass

## 1. Sobre o projeto

O ArenaPass é uma aplicação web para gerenciamento seguro de usuários de centros esportivos.

O sistema possui uma API REST responsável pelo cadastro, consulta, atualização e exclusão de usuários, além de autenticação utilizando JWT e controle de acesso baseado em perfis.

A aplicação possui três perfis:

- Administrador
- Operador
- Cliente

Cada perfil possui permissões diferentes dentro do sistema.

---

## 2. Tecnologias utilizadas

### Back-end

- Python
- FastAPI
- SQLAlchemy
- SQLite
- JWT
- bcrypt

### Front-end

- React
- Vite
- JavaScript
- HTML
- CSS

---

# 3. Endpoints da API

| Método | Endpoint | Finalidade | Acesso | Resposta esperada |
|---|---|---|---|---|
| POST | `/auth/login` | Autenticar usuário e gerar JWT | Público | 200 OK |
| GET | `/auth/me` | Consultar usuário autenticado | Autenticado | 200 OK |
| POST | `/users` | Cadastrar novo usuário | Administrador | 201 Created |
| GET | `/users` | Listar usuários cadastrados | Administrador / Operador | 200 OK |
| GET | `/users/{id}` | Consultar usuário específico | Conforme perfil | 200 OK |
| PUT | `/users/{id}` | Atualizar usuário | Administrador / Operador | 200 OK |
| DELETE | `/users/{id}` | Excluir usuário | Administrador | 204 No Content |

---

## 4. Cadastro de usuários

### Endpoint

```http
POST /users
```

Exemplo de requisição:

```json
{
  "nome": "Ana Souza",
  "email": "ana@arenapass.com",
  "senha": "123456",
  "perfil": "cliente"
}
```

Exemplo de resposta:

```json
{
  "id": 3,
  "nome": "Ana Souza",
  "email": "ana@arenapass.com",
  "perfil": "cliente"
}
```

A senha não é retornada pela API e não é armazenada em texto puro no banco de dados.

---

# 5. Autenticação com JWT

## Processo de login

O usuário realiza a autenticação através do endpoint:

```http
POST /auth/login
```

Enviando e-mail e senha:

```json
{
  "email": "mayara@arenapass.com",
  "senha": "123456"
}
```

A API procura o usuário cadastrado pelo e-mail e compara a senha informada com o hash armazenado no banco.

Caso as credenciais estejam corretas, um token JWT é gerado.

Exemplo de resposta:

```json
{
  "access_token": "TOKEN_JWT",
  "token_type": "bearer"
}
```

Caso o e-mail ou a senha estejam incorretos, a API retorna:

```http
401 Unauthorized
```

com a mensagem:

```json
{
  "detail": "E-mail ou senha inválidos"
}
```

---

## Informações armazenadas no JWT

O token contém informações necessárias para identificar o usuário:

- ID do usuário;
- Nome;
- Perfil de acesso;
- Data de emissão;
- Data de expiração.

Exemplo conceitual:

```json
{
  "sub": "1",
  "nome": "Mayara Celestino",
  "perfil": "administrador",
  "iat": 1789920000,
  "exp": 1789921800
}
```

A senha nunca é armazenada dentro do JWT.

---

## Expiração do token

O token possui validade de:

```text
30 minutos
```

Foi escolhido um período relativamente curto para reduzir o tempo em que um token roubado poderia ser utilizado.

Após a expiração, o usuário deverá realizar uma nova autenticação.

---

## Utilização do token

Para acessar endpoints protegidos, o token é enviado no cabeçalho HTTP:

```http
Authorization: Bearer TOKEN_JWT
```

A API verifica se:

1. O token existe;
2. O token é válido;
3. O token ainda não expirou;
4. O usuário associado ao token existe;
5. O perfil possui autorização para executar a operação.

---

# 6. Controle de acesso - RBAC

O ArenaPass utiliza controle de acesso baseado em papéis, conhecido como RBAC (Role-Based Access Control).

Existem três perfis.

## Administrador

Possui acesso completo ao gerenciamento de usuários.

Pode:

- Cadastrar usuários;
- Listar usuários;
- Consultar usuários;
- Atualizar usuários;
- Alterar perfis;
- Excluir usuários;
- Consultar seus próprios dados.

## Operador

Possui acesso intermediário.

Pode:

- Listar usuários;
- Consultar usuários;
- Atualizar nome e e-mail dos usuários;
- Consultar seus próprios dados.

Não pode:

- Criar usuários;
- Excluir usuários;
- Alterar perfis de acesso.

## Cliente

Possui acesso restrito.

Pode:

- Realizar login;
- Visualizar somente seus próprios dados.

Não pode:

- Listar todos os usuários;
- Cadastrar usuários;
- Editar outros usuários;
- Excluir usuários.

---

## Respostas de autorização

Quando o usuário não está autenticado, a API retorna:

```http
401 Unauthorized
```

Quando o usuário está autenticado, mas não possui permissão:

```http
403 Forbidden
```

Essa diferença permite separar autenticação de autorização.

---

# 7. Armazenamento seguro de senhas

As senhas não são armazenadas diretamente no banco de dados.

Antes de serem salvas, passam por um processo de hash utilizando bcrypt.

Assim, uma senha como:

```text
123456
```

não aparece no banco dessa forma.

O banco armazena apenas o hash correspondente.

Durante o login, o bcrypt verifica se a senha informada corresponde ao hash armazenado.

---

# 8. OAuth 2.0

O OAuth 2.0 poderia ser utilizado caso uma aplicação parceira precisasse acessar recursos do ArenaPass em nome de um usuário.

Por exemplo, uma academia parceira poderia possuir seu próprio aplicativo e desejar acessar informações autorizadas do ArenaPass.

## Concessão de acesso

Um possível fluxo seria o Authorization Code com PKCE.

O funcionamento seria:

1. A aplicação parceira solicita acesso;
2. O usuário é direcionado para uma tela de autorização;
3. O usuário escolhe se deseja permitir o acesso;
4. O servidor gera um código de autorização;
5. O código é trocado por um access token;
6. A aplicação utiliza o token para acessar os recursos permitidos.

O usuário não precisa fornecer sua senha diretamente para a aplicação parceira.

---

## Utilização do token

Depois da autorização, a aplicação parceira enviaria o access token nas requisições:

```http
Authorization: Bearer ACCESS_TOKEN
```

Também poderiam existir permissões específicas, como:

```text
profile:read
users:read
```

Dessa forma, uma aplicação receberia somente as permissões necessárias.

---

## Benefícios do OAuth 2.0

Entre os principais benefícios estão:

- Não compartilhar a senha do usuário com aplicações parceiras;
- Permitir acesso limitado a determinados recursos;
- Possibilitar revogação de acesso;
- Delegar permissões;
- Reduzir exposição de credenciais;
- Utilizar tokens temporários.

O OAuth 2.0 não foi implementado neste projeto, sendo apresentado apenas como possibilidade de integração futura.

---

# 9. Análise de segurança

| Risco | Possível consequência | Medida de mitigação |
|---|---|---|
| Roubo de token JWT | Acesso indevido à conta | HTTPS e tokens com expiração curta |
| Senhas em texto puro | Exposição das credenciais | Hash das senhas utilizando bcrypt |
| Acesso indevido aos endpoints | Usuário executando ações sem permissão | Controle de acesso RBAC no back-end |
| Tentativas de descobrir usuários cadastrados | Enumeração de contas | Mensagem genérica para e-mail ou senha inválidos |
| Token armazenado no navegador | Exposição em caso de XSS | Evitar scripts não confiáveis e, em produção, considerar cookies HttpOnly |
| Dados de entrada inválidos | Erros ou comportamento inesperado | Validação utilizando Pydantic |

---

# 10. Front-end

A aplicação possui uma interface desenvolvida em React.

A interface permite:

- Realizar login;
- Visualizar informações do usuário autenticado;
- Listar usuários;
- Cadastrar usuários;
- Editar usuários;
- Excluir usuários;
- Exibir funcionalidades conforme o perfil de acesso.

A interface adapta as ações disponíveis de acordo com o perfil.

### Administrador

Visualiza:

- Novo usuário;
- Editar;
- Excluir.

### Operador

Visualiza:

- Lista de usuários;
- Editar.

### Cliente

Visualiza apenas:

- Seus próprios dados.

As permissões também são verificadas pelo back-end. Portanto, esconder um botão no front-end não é considerado uma medida de segurança suficiente.

---

# 11. Códigos HTTP utilizados

| Código | Significado | Utilização |
|---|---|---|
| 200 | OK | Consultas, login e atualizações realizadas |
| 201 | Created | Usuário criado |
| 204 | No Content | Usuário excluído |
| 401 | Unauthorized | Usuário não autenticado ou token inválido |
| 403 | Forbidden | Usuário autenticado sem permissão |
| 404 | Not Found | Usuário não encontrado |
| 409 | Conflict | E-mail já cadastrado |
| 422 | Unprocessable Entity | Dados enviados inválidos |

---

# 12. Considerações finais

O ArenaPass foi desenvolvido para demonstrar na prática os principais conceitos estudados na disciplina relacionados a APIs REST e segurança de aplicações web.

Durante o desenvolvimento foram aplicados conceitos de:

- API REST;
- Métodos HTTP;
- Códigos de resposta;
- Autenticação;
- JWT;
- Hash de senhas;
- Autorização;
- RBAC;
- Proteção de endpoints;
- Validação de dados;
- Integração entre front-end e back-end;
- Segurança de aplicações web.