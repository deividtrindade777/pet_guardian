import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <>
      <aside className="sidebar">
        <h2>🐾 PetGuardian</h2>

        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/pets">Pets</Link>
          <Link to="/vacinas">Vacinas</Link>
          <Link to="/consultas">Consultas</Link>
          <Link to="/medicamentos">Medicamentos</Link>
          <Link to="/banhotosa">Banho e Tosa</Link>
          <Link to="/perfilpet">Perfil do Pet</Link>
        </nav>
      </aside>
    </>
  );
}

export default Navbar;