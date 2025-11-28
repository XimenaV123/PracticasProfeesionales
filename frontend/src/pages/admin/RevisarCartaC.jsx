import SidebarAdmin from "../../components/SidebarAdmin";
import { useState } from "react";
import HeaderInstitucional from "../../components/HeaderInstitucional";
import FooterInstitucional from "../../components/FooterInstitucional";

export default function RevisarCartaC() {

  const [estado, setEstado] = useState("Pendiente de revisión");
  const archivo = "cartaC_practicante.pdf"; // Solo simulación

  return (

    <>
    <HeaderInstitucional/>
        <div className="layout">
        <SidebarAdmin />

        <div className="main-content">
            <h1>Revisión de Carta C</h1>

            <p>Estado actual: <strong>{estado}</strong></p>

            <div className="admin-review-container">

            <p><strong>Archivo recibido:</strong> {archivo}</p>

            <button 
                className="approve-btn"
                onClick={() => setEstado("Aceptada ✔")}
            >
                Aceptar
            </button>

            <button 
                className="reject-btn"
                onClick={() => setEstado("Rechazada ✘")}
            >
                Rechazar
            </button>

            </div>

        </div>
        </div>
    <FooterInstitucional />
    </>
  );
}
