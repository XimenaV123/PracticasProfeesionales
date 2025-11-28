import SidebarPract from "../../components/SidebarPract";
import { useState } from "react";
import HeaderInstitucional from "../../components/HeaderInstitucional";
import FooterInstitucional from "../../components/FooterInstitucional";

export default function CartaC() {
  const [archivo, setArchivo] = useState(null);
  const [estado, setEstado] = useState("Pendiente de subida");

  function enviarArchivo() {
    if (!archivo) return;
    setEstado("En revisión por el administrativo ✔");
  }

  return (
    <>
    <HeaderInstitucional/>
        <div className="layout">
        <SidebarPract />

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
