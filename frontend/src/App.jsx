import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import DashboardP from "./pages/practicante/DashboardP";
import CartaA from "./pages/practicante/CartaA";
import CartaC from "./pages/practicante/CartaC";
import Perfil from "./pages/practicante/Perfil";
import DashboardA from "./pages/admin/DashboardA";
import RevisarCartaA from "./pages/admin/RevisarCartaA";
import RevisarCartaC from "./pages/admin/RevisarCartaC";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta por defecto: redirigir a login */}
        <Route path="/" element={<Login />} />
        
        {/* Rutas de practicante */}
        <Route path="/practicante/dashboard" element={<DashboardP />} />
        <Route path="/practicante/cartaA" element={<CartaA />} />
        <Route path="/practicante/cartaC" element={<CartaC />} />
        <Route path="/practicante/perfil" element={<Perfil />} />
        
        {/* Rutas de administrador */}
        <Route path="/admin/dashboard" element={<DashboardA />} />
        <Route path="/admin/revisarCartaA/:cartaId" element={<RevisarCartaA />} />
        <Route path="/admin/revisarCartaC/:cartaId" element={<RevisarCartaC />} />
        
        {/* Ruta catch-all: redirigir a login si no se encuentra */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;