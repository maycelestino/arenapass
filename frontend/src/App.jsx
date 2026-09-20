import { useState } from "react";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function App() {
    const [autenticado, setAutenticado] = useState(
        Boolean(localStorage.getItem("token"))
    );

    function handleLogin() {
        setAutenticado(true);
    }

    function handleLogout() {
        localStorage.removeItem("token");
        setAutenticado(false);
    }

    return autenticado ? (
        <Dashboard onLogout={handleLogout} />
    ) : (
        <Login onLogin={handleLogin} />
    );
}

export default App;