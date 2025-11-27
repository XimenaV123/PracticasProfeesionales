import { useNavigate } from "react-router-dom";
import SidebarPract from "../../components/SidebarPract";
import HeaderInstitucional from "../../components/HeaderInstitucional";
import FooterInstitucional from "../../components/FooterInstitucional";
import "../../styles/dashboardP.css";

export default function DashboardP() {
  const navigate = useNavigate();


  return (

    <>
        {/* 🔹 HEADER INSTITUCIONAL */}
        <HeaderInstitucional />

        <div className="layout">
        <SidebarPract />

        <div className="main-content">
            <h1>Panel del Practicante</h1>
            <p>Consulta y gestiona tus cartas de prácticas profesionales.</p>

            <div className="cards-container">

            {/* Carta A */}
            <button
                className="card-btn"
                onClick={() => navigate("/practicante/cartaA")}
            >
                📄 Carta A — Sin enviar
            </button>

            {/* Carta B (no disponible) */}
            <button className="card-btn disabled">
                📥 Carta B — No disponible
            </button>

            {/* Carta C */}
            <button
                className="card-btn"
                onClick={() => navigate("/practicante/cartaC")}
            >
                📤 Carta C — Pendiente de subida
            </button>

            {/* Carta D (no disponible) */}
            <button className="card-btn disabled">
                📥 Carta D — No disponible
            </button>

            </div>
        </div>
        </div>
        <FooterInstitucional />
    </>
  );
}
