import SidebarPract from "../../components/SidebarPract";
import { useState } from "react";
import HeaderInstitucional from "../../components/HeaderInstitucional";  // 🔹 AGREGADO
import FooterInstitucional from "../../components/FooterInstitucional";

export default function Perfil() {
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    expediente: "000123",
    nombre: "Juan Pérez",
    carrera: "Ingeniería en Sistemas Computacionales",
    semestre: "6to",
    correo: "correo@example.com",
    telefono: "1234567890",
  });

  return (

    <>
    <HeaderInstitucional/>
        <div className="layout">
        <SidebarPract />

        <div className="main-content">
            <h1>Mi Perfil</h1>

            <div className="profile-container">

            {!editMode ? (
                <>
                <p><strong>Expediente:</strong> {form.expediente}</p>
                <p><strong>Nombre:</strong> {form.nombre}</p>
                <p><strong>Carrera:</strong> {form.carrera}</p>
                <p><strong>Semestre:</strong> {form.semestre}</p>
                <p><strong>Correo:</strong> {form.correo}</p>
                <p><strong>Teléfono:</strong> {form.telefono}</p>

                <button className="edit-btn" onClick={() => setEditMode(true)}>
                    Editar Perfil
                </button>
                </>
            ) : (
                <>
                <input
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                />
                <input
                    value={form.correo}
                    onChange={(e) => setForm({ ...form, correo: e.target.value })}
                />
                <input
                    value={form.telefono}
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                />

                <button className="save-btn" onClick={() => setEditMode(false)}>
                    Guardar Cambios
                </button>
                </>
            )}

            </div>
        </div>
        </div>
        <FooterInstitucional />
    </>
  );
}
