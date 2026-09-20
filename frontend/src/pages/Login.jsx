import { useState } from "react";
import { login } from "../services/api";

function Login({ onLogin }) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        setMensagem("");
        setErro("");

        try {
            const data = await login(email, senha);

            localStorage.setItem("token", data.access_token);
            onLogin();

            setMensagem("Login realizado com sucesso!");
        } catch (error) {
            setErro(error.message);
        }
    }

    return (
        <div className="login-page">
            <div className="login-info">
                <span className="logo">ArenaPass</span>

                <h1>Acesso inteligente para quem vive o esporte.</h1>

                <p>
                    Gerencie usuários e permissões de forma simples,
                    segura e organizada.
                </p>
            </div>

            <div className="login-card">
                <h2>Entrar</h2>
                <p className="subtitle">Acesse sua conta ArenaPass</p>

                <form onSubmit={handleSubmit}>
                    <label>E-mail</label>
                    <input
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />

                    <label>Senha</label>
                    <input
                        type="password"
                        placeholder="Digite sua senha"
                        value={senha}
                        onChange={(event) => setSenha(event.target.value)}
                        required
                    />

                    <button type="submit">Entrar</button>
                </form>

                {mensagem && <p className="success">{mensagem}</p>}
                {erro && <p className="error">{erro}</p>}
            </div>
        </div>
    );
}

export default Login;