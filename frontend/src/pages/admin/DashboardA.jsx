import SidebarAdmin from "../../components/SidebarAdmin";
import HeaderInstitucional from "../../components/HeaderInstitucional";  // 🔹 AGREGADO
import FooterInstitucional from "../../components/FooterInstitucional";
import "../../styles/dashboardA.css";
import { useNavigate } from "react-router-dom";

export default function DashboardA() {
  const navigate = useNavigate();

  const practicantes = [
    { nombre: "Juan Pérez", expediente: "000123", cartaA: "Pendiente", cartaC: "Sin subir" },
    { nombre: "María López", expediente: "000456", cartaA: "Enviada", cartaC: "Pendiente" },
    { nombre: "Carlos Ruiz", expediente: "000789", cartaA: "Revisada", cartaC: "Aceptada" },
  ];

  return (
    <>
      {/* 🔹 HEADER INSTITUCIONAL */}
      <HeaderInstitucional />

      <div className="layout">
        <SidebarAdmin />

        <div className="main-content">
          <h1>Panel del Administrador</h1>
          <p>Gestión de cartas y revisión de documentos de practicantes.</p>

          {/* 🔵 TARJETAS PRINCIPALES */}
          <div className="cards-admin-container">

            <button 
              className="card-btn"
              onClick={() => navigate("/admin/revisarCartaA")}
            >
              📄 Revisar Carta A
            </button>

            <button 
              className="card-btn"
              onClick={() => navigate("/admin/revisarCartaC")}
            >
              📤 Revisar Carta C
            </button>

            <button className="card-btn disabled">
              📥 Carta B — No disponible
            </button>

            <button className="card-btn disabled">
              📥 Carta D — No disponible
            </button>

          </div>

          {/* 🔵 TABLA DE PRACTICANTES */}
          <h2 style={{ marginTop: "3rem" }}>Practicantes registrados</h2>

          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Expediente</th>
                  <th>Carta A</th>
                  <th>Carta C</th>
                </tr>
              </thead>

              <tbody>
                {practicantes.map((p, index) => (
                  <tr key={index}>
                    <td>{p.nombre}</td>
                    <td>{p.expediente}</td>
                    <td>{p.cartaA}</td>
                    <td>{p.cartaC}</td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        </div>
      </div>
    <FooterInstitucional />
    </>
  );
}
