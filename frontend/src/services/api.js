const API_URL = "http://127.0.0.1:8000";

function getToken() {
    return localStorage.getItem("token");
}

export async function login(email, senha) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, senha })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || "Erro ao realizar login");
    }

    return data;
}

export async function getCurrentUser() {
    const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || "Erro ao buscar usuário");
    }

    return data;
}

export async function getUsers() {
    const response = await fetch(`${API_URL}/users`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || "Erro ao buscar usuários");
    }

    return data;
}

export async function createUser(usuario) {
    const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(usuario)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || "Erro ao cadastrar usuário");
    }

    return data;
}

export async function updateUser(id, usuario) {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(usuario)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || "Erro ao atualizar usuário");
    }

    return data;
}

export async function deleteUser(id) {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Erro ao excluir usuário");
    }
}