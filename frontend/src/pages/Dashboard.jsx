import { useEffect, useState } from "react";
import {
    createUser,
    deleteUser,
    getCurrentUser,
    getUsers,
    updateUser
} from "../services/api.js";

function Dashboard({ onLogout }) {
    const [usuario, setUsuario] = useState(null);
    const [usuarios, setUsuarios] = useState([]);
    const [erro, setErro] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const [usuarioEditando, setUsuarioEditando] = useState(null);

    const [form, setForm] = useState({
        nome: "",
        email: "",
        senha: "",
        perfil: "cliente"
    });

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

    function abrirCadastro() {
        setUsuarioEditando(null);

        setForm({
            nome: "",
            email: "",
            senha: "",
            perfil: "cliente"
        });

        setModalAberto(true);
    }

    function abrirEdicao(item) {
        setUsuarioEditando(item);

        setForm({
            nome: item.nome,
            email: item.email,
            senha: "",
            perfil: item.perfil
        });

        setModalAberto(true);
    }

    function fecharModal() {
        setModalAberto(false);
        setUsuarioEditando(null);
        setErro("");
    }

    function alterarCampo(event) {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    }

    async function salvarUsuario(event) {
        event.preventDefault();

        setErro("");
        setMensagem("");

        try {
            if (usuarioEditando) {
                await updateUser(usuarioEditando.id, {
                    nome: form.nome,
                    email: form.email,
                    perfil: form.perfil
                });

                setMensagem("Usuário atualizado com sucesso!");
            } else {
                await createUser(form);
                setMensagem("Usuário cadastrado com sucesso!");
            }

            fecharModal();
            carregarDados();
        } catch (error) {
            setErro(error.message);
        }
    }

    async function excluirUsuario(item) {
        const confirmar = window.confirm(
            `Deseja realmente excluir ${item.nome}?`
        );

        if (!confirmar) return;

        setErro("");
        setMensagem("");

        try {
            await deleteUser(item.id);
            setMensagem("Usuário excluído com sucesso!");
            carregarDados();
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

                {mensagem && <p className="success">{mensagem}</p>}
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
                                <button
                                    className="new-user"
                                    onClick={abrirCadastro}
                                >
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
                                                <button
                                                    className="edit"
                                                    onClick={() => abrirEdicao(item)}
                                                >
                                                    Editar
                                                </button>

                                                {usuario.perfil === "administrador" && (
                                                    <button
                                                        className="delete"
                                                        onClick={() => excluirUsuario(item)}
                                                    >
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

                {modalAberto && (
                    <div className="modal-background">
                        <div className="modal">
                            <h2>
                                {usuarioEditando
                                    ? "Editar usuário"
                                    : "Novo usuário"}
                            </h2>

                            <form onSubmit={salvarUsuario}>
                                <label>Nome</label>
                                <input
                                    name="nome"
                                    value={form.nome}
                                    onChange={alterarCampo}
                                    required
                                />

                                <label>E-mail</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={alterarCampo}
                                    required
                                />

                                {!usuarioEditando && (
                                    <>
                                        <label>Senha</label>
                                        <input
                                            type="password"
                                            name="senha"
                                            value={form.senha}
                                            onChange={alterarCampo}
                                            minLength="6"
                                            required
                                        />
                                    </>
                                )}

                                <label>Perfil</label>

                                <select
                                    name="perfil"
                                    value={form.perfil}
                                    onChange={alterarCampo}
                                    disabled={
                                        usuario.perfil === "operador"
                                    }
                                >
                                    <option value="administrador">
                                        Administrador
                                    </option>

                                    <option value="operador">
                                        Operador
                                    </option>

                                    <option value="cliente">
                                        Cliente
                                    </option>
                                </select>

                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        className="cancel"
                                        onClick={fecharModal}
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="submit"
                                        className="save"
                                    >
                                        Salvar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Dashboard;