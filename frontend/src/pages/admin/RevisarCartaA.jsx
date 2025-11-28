import SidebarAdmin from "../../components/SidebarAdmin";
import { useState } from "react";
import HeaderInstitucional from "../../components/HeaderInstitucional";
import FooterInstitucional from "../../components/FooterInstitucional";



export default function RevisarCartaA() {

  const [estado, setEstado] = useState("Enviada por practicante");

  return (

    <>
        <HeaderInstitucional />
            <div className="layout">
            <SidebarAdmin />

                <div className="main-content">
                <h1>Revisión de Carta A</h1>

                <p>Estado actual: <strong>{estado}</strong></p>

                <div className="admin-review-container">

                    <h3>Datos proporcionados por el practicante:</h3>

                    <ul>
                    <li><strong>Empresa:</strong> Ejemplo S.A. de C.V.</li>
                    <li><strong>Responsable:</strong> Ing. Pedro González</li>
                    <li><strong>Motivo:</strong> Solicitud de presentación…</li>
                    </ul>

                    <button 
                    className="approve-btn"
                    onClick={() => setEstado("Aprobada ✔")}
                    >
                    Aprobar
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
