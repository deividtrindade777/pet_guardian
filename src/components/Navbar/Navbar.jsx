import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h2>🐾 PetGuardian</h2>

      <div className="links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/pets">Pets</Link>
        <Link to="/vacinas">Vacinas</Link>
        <Link to="/banhotosa">Banho e Tosa</Link>
        <Link to="/perfilpet">Perfil do Pet</Link>
      </div>
    </nav>
  );
}

export default Navbar;