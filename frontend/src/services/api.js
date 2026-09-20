const API_URL = "http://127.0.0.1:8000";

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