import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import "./Navbar.css";

function Navbar() {
  const [aberto, setAberto] = useState(false);
  const navigate = useNavigate();

  async function sair() {
    const confirmar = window.confirm(
      "Deseja sair da conta?"
    );

    if (!confirmar) return;

    try {
      await signOut(auth);

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Erro ao sair da conta.");
    }
  }

  return (
    <>
      <header className="topbar">
        <button
          className="menu-btn"
          onClick={() => setAberto(!aberto)}
        >
          ☰
        </button>

        <h2>🐾 PetGuardian</h2>
      </header>

      {aberto && (
        <div className="drawer">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/pets">Pets</Link>
          <Link to="/vacinas">Vacinas</Link>
          <Link to="/consultas">Consultas</Link>
          <Link to="/medicamentos">Medicamentos</Link>
          <Link to="/banhotosa">Banho e Tosa</Link>
          <Link to="/perfilpet">Perfil do Pet</Link>
          <Link to="/notificacoes">🔔 Notificações</Link>
          <button
            onClick={sair}
            style={{
              marginTop: "10px",
              background: "#d32f2f",
              color: "white",
              border: "none",
              padding: "10px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Sair
          </button>
        </div>
      )}
    </>
  );
}

export default Navbar;