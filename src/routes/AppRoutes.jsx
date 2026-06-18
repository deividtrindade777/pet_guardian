import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import Pets from "../pages/Pets/Pets";
import Vacinas from "../pages/Vacinas/Vacinas";
import Consultas from "../pages/Consultas/Consultas";
import Medicamentos from "../pages/Medicamentos/Medicamentos";
import BanhoTosa from "../pages/BanhoTosa/BanhoTosa";
import PerfilPet from "../pages/PerfilPet/PerfilPet";
import Notificacoes from "../pages/Notificacoes/Notificacoes";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pets" element={<Pets />} />
        <Route path="/vacinas" element={<Vacinas />} />
        <Route path="/consultas" element={<Consultas />} />
        <Route path="/medicamentos" element={<Medicamentos />}/>
        <Route path="/banhotosa" element={<BanhoTosa />} />
        <Route path="/perfilpet" element={<PerfilPet />}/>
        <Route path="/notificacoes" element={<Notificacoes />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;