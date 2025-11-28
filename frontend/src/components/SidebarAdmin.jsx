import { Link, useNavigate } from "react-router-dom";

export default function SidebarAdmin() {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="profile">
        <img src="/profile.png" alt="Admin" className="profile-pic" />
        <h3>Administrador</h3>
        <p>Usuario: admin01</p>
      </div>

      <ul className="menu">
        <li><Link to="/admin/dashboard">📊 Dashboard</Link></li>
        <li><Link to="/admin/revisarCartaA">📄 Revisar Carta A</Link></li>
        <li><Link to="/admin/revisarCartaC">📤 Revisar Carta C</Link></li>

        <li><a style={{ opacity: 0.4 }}>📥 Carta B (no implementada)</a></li>
        <li><a style={{ opacity: 0.4 }}>📥 Carta D (no implementada)</a></li>
      </ul>

      <div className="logout-container">
        <button onClick={() => navigate("/")}>Cerrar Sesión</button>
      </div>
    </div>
  );
}
