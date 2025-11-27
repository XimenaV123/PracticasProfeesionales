import SidebarPract from "../../components/SidebarPract";
import { useState } from "react";
import HeaderInstitucional from "../../components/HeaderInstitucional";
import FooterInstitucional from "../../components/FooterInstitucional";


export default function CartaA() {
  const [status, setStatus] = useState("Sin enviar");

  const [form, setForm] = useState({
    empresa: "",
    responsable: "",
    motivo: "",
  });

  function enviarFormulario() {
    setStatus("Enviada al administrativo ✔");
  }

  return (

    <>
    <HeaderInstitucional/>
        <div className="layout">
        <SidebarPract />

        <div className="main-content">
            <h1>Carta A - Presentación</h1>
            <p>Estado actual: <strong>{status}</strong></p>

            <div className="carta-container">

            <input
                placeholder="Nombre de la Empresa"
                value={form.empresa}
                onChange={(e) => setForm({ ...form, empresa: e.target.value })}
            />

            <input
                placeholder="Responsable"
                value={form.responsable}
                onChange={(e) => setForm({ ...form, responsable: e.target.value })}
            />

            <textarea
                placeholder="Motivo"
                value={form.motivo}
                onChange={(e) => setForm({ ...form, motivo: e.target.value })}
            />

            <button className="send-btn" onClick={enviarFormulario}>
                Enviar Carta A
            </button>

            </div>
        </div>
        </div>
        <FooterInstitucional />
    </>
  );
}
