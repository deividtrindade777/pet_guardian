import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        🐾 PetGuardian
      </div>

      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/pets">Pets</Link>
        <Link to="/vacinas">Vacinas</Link>
        <Link to="/consultas">Consultas</Link>
        <Link to="/medicamentos">Medicamentos</Link>
        <Link to="/banhotosa">Banho/Tosa</Link>
        <Link to="/perfilpet">Perfil</Link>
      </div>
    </nav>
  );
}

export default Navbar;