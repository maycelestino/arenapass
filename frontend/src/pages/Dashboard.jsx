import { useEffect, useState } from "react";
import { getCurrentUser, getUsers } from "../services/api.js";

function Dashboard({ onLogout }) {
    const [usuario, setUsuario] = useState(null);
    const [usuarios, setUsuarios] = useState([]);
    const [erro, setErro] = useState("");

    useEffect(() => {
        carregarDados();
    }, []);

    async function carregarDados() {
        try {
            const usuarioLogado = await getCurrentUser();
            setUsuario(usuarioLogado);

            if (
                usuarioLogado.perfil === "administrador" ||
                usuarioLogado.perfil === "operador"
            ) {
                const lista = await getUsers();
                setUsuarios(lista);
            }
        } catch (error) {
            setErro(error.message);
        }
    }

    if (!usuario) {
        return <p className="loading">Carregando...</p>;
    }

    return (
        <div className="dashboard">
            <aside className="sidebar">
                <h2>ArenaPass</h2>

                <nav>
                    <span>Dashboard</span>

                    {usuario.perfil !== "cliente" && (
                        <span>Usuários</span>
                    )}

                    <span>Meu perfil</span>
                </nav>

                <button className="logout" onClick={onLogout}>
                    Sair
                </button>
            </aside>

            <main className="content">
                <header className="dashboard-header">
                    <div>
                        <h1>Olá, {usuario.nome}!</h1>
                        <p>Bem-vindo ao painel ArenaPass.</p>
                    </div>

                    <span className="perfil">
                        {usuario.perfil}
                    </span>
                </header>

                {erro && <p className="error">{erro}</p>}

                {usuario.perfil === "cliente" ? (
                    <section className="profile-card">
                        <h2>Meu perfil</h2>

                        <p><strong>Nome:</strong> {usuario.nome}</p>
                        <p><strong>E-mail:</strong> {usuario.email}</p>
                        <p><strong>Perfil:</strong> {usuario.perfil}</p>
                    </section>
                ) : (
                    <section>
                        <div className="section-title">
                            <div>
                                <h2>Usuários</h2>
                                <p>Usuários cadastrados no ArenaPass.</p>
                            </div>

                            {usuario.perfil === "administrador" && (
                                <button className="new-user">
                                    + Novo usuário
                                </button>
                            )}
                        </div>

                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>E-mail</th>
                                        <th>Perfil</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {usuarios.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.nome}</td>
                                            <td>{item.email}</td>
                                            <td>
                                                <span className="role">
                                                    {item.perfil}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="edit">
                                                    Editar
                                                </button>

                                                {usuario.perfil === "administrador" && (
                                                    <button className="delete">
                                                        Excluir
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}

export default Dashboard;