import SidebarPract from "../../components/SidebarPract";
import { useState, useEffect } from "react";
import HeaderInstitucional from "../../components/HeaderInstitucional";
import FooterInstitucional from "../../components/FooterInstitucional";
import { obtenerPerfil, actualizarPerfil } from "../../services/usuarioService";

export default function Perfil() {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cargando, setCargando] = useState(true);

  const [form, setForm] = useState({
    expediente: "",
    nombre: "",
    carrera: "",
    semestre: "",
    correo: "",
    telefono: "",
    curp: "",
    imss: "",
    fechaNacimiento: "",
  });

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      setCargando(true);
      const response = await obtenerPerfil();
      const usuario = response.usuario;
      
      setForm({
        expediente: usuario.expediente || "",
        nombre: usuario.nombre || "",
        carrera: usuario.carrera || "",
        semestre: usuario.semestre || "",
        correo: usuario.email || "",
        telefono: usuario.telefono || "",
        curp: usuario.curp || "",
        imss: usuario.imss || "",
        fechaNacimiento: usuario.fechaNacimiento || "",
      });
    } catch (error) {
      console.error("Error al cargar perfil:", error);
      alert("Error al cargar el perfil. Por favor, recarga la página.");
    } finally {
      setCargando(false);
    }
  };

  const guardarCambios = async () => {
    try {
      setLoading(true);
      await actualizarPerfil({
        nombre: form.nombre,
        email: form.correo,
        telefono: form.telefono,
        curp: form.curp,
        carrera: form.carrera,
        semestre: form.semestre,
        imss: form.imss,
        fechaNacimiento: form.fechaNacimiento,
      });
      
      setEditMode(false);
      alert("Perfil actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      alert(error.message || "Error al actualizar el perfil. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (cargando) {
    return (
      <>
        <HeaderInstitucional />
        <div className="layout">
          <SidebarPract />
          <div className="main-content">
            <p>Cargando perfil...</p>
          </div>
        </div>
        <FooterInstitucional />
      </>
    );
  }

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
                {form.curp && <p><strong>CURP:</strong> {form.curp}</p>}
                {form.imss && <p><strong>IMSS:</strong> {form.imss}</p>}
                {form.fechaNacimiento && <p><strong>Fecha de Nacimiento:</strong> {form.fechaNacimiento}</p>}

                <button className="edit-btn" onClick={() => setEditMode(true)}>
                    Editar Perfil
                </button>
                </>
            ) : (
                <>
                <input
                    placeholder="Nombre"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                />
                <input
                    placeholder="Correo electrónico"
                    type="email"
                    value={form.correo}
                    onChange={(e) => setForm({ ...form, correo: e.target.value })}
                />
                <input
                    placeholder="Teléfono"
                    value={form.telefono}
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                />
                <input
                    placeholder="CURP"
                    value={form.curp}
                    onChange={(e) => setForm({ ...form, curp: e.target.value })}
                />
                <input
                    placeholder="IMSS"
                    value={form.imss}
                    onChange={(e) => setForm({ ...form, imss: e.target.value })}
                />
                <input
                    placeholder="Fecha de Nacimiento (YYYY-MM-DD)"
                    type="date"
                    value={form.fechaNacimiento}
                    onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })}
                />

                <button 
                  className="save-btn" 
                  onClick={guardarCambios}
                  disabled={loading}
                >
                    {loading ? "Guardando..." : "Guardar Cambios"}
                </button>
                <button 
                  className="cancel-btn" 
                  onClick={() => {
                    setEditMode(false);
                    cargarPerfil(); // Recargar datos originales
                  }}
                  disabled={loading}
                >
                    Cancelar
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
