import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [aberto, setAberto] = useState(false);

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
        </div>
      )}
    </>
  );
}

export default Navbar;