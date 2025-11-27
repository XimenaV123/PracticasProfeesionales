import { Link, useNavigate } from "react-router-dom";

export default function SidebarPract() {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="profile">
        {/* Imagen desde public/ */}
        <img src="/profile.png" alt="Perfil" className="profile-pic" />
        <h3>Practicante</h3>
        <p>Expediente: 000123</p>
        <p>ISC - 6to Semestre</p>
      </div>

      <ul className="menu">
        <li><Link to="/practicante/dashboard">🏠 Dashboard</Link></li>
        <li><Link to="/practicante/perfil">👤 Mi Perfil</Link></li>
        <li><Link to="/practicante/cartaA">📄 Carta A</Link></li>
        <li><Link to="/practicante/cartaC">📤 Carta C</Link></li>

        <li><a style={{ opacity: 0.4 }}>📥 Carta B (bloqueada)</a></li>
        <li><a style={{ opacity: 0.4 }}>📥 Carta D (bloqueada)</a></li>
      </ul>

      <div className="logout-container">
        <button onClick={() => navigate("/")}>Cerrar Sesión</button>
      </div>
    </div>
  );
}
