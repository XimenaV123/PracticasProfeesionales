import SidebarAdmin from "../../components/SidebarAdmin";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderInstitucional from "../../components/HeaderInstitucional";
import FooterInstitucional from "../../components/FooterInstitucional";
import { obtenerCartaPorId, actualizarEstadoCarta } from "../../services/cartaService";

export default function RevisarCartaA() {
  const { cartaId } = useParams();
  const navigate = useNavigate();
  const [carta, setCarta] = useState(null);
  const [estado, setEstado] = useState("");
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    if (cartaId) {
      cargarCarta();
    }
  }, [cartaId]);

  const cargarCarta = async () => {
    try {
      setLoading(true);
      // Como admin, necesitamos obtener todas las cartas y filtrar
      // O mejor, el backend debería permitir a los admins obtener cualquier carta
      // Por ahora, usaremos obtenerTodasLasCartas y filtrar
      const { obtenerTodasLasCartas } = await import("../../services/cartaService");
      const response = await obtenerTodasLasCartas();
      const cartas = response.cartas || [];
      const cartaEncontrada = cartas.find(c => c.id === parseInt(cartaId));
      
      if (cartaEncontrada) {
        setCarta(cartaEncontrada);
        setEstado(cartaEncontrada.estado);
      } else {
        alert("Carta no encontrada");
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.error("Error al cargar carta:", error);
      alert("Error al cargar la carta. Por favor, intenta de nuevo.");
      navigate("/admin/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstado = async (nuevoEstado) => {
    if (!cartaId) return;

    try {
      setProcesando(true);
      await actualizarEstadoCarta(cartaId, nuevoEstado);
      setEstado(nuevoEstado);
      alert(`Carta ${nuevoEstado === 'aprobada' ? 'aprobada' : 'rechazada'} exitosamente`);
      // Opcional: redirigir al dashboard después de actualizar
      // navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert(error.message || "Error al actualizar el estado de la carta.");
    } finally {
      setProcesando(false);
    }
  };

  if (loading) {
    return (
      <>
        <HeaderInstitucional />
        <div className="layout">
          <SidebarAdmin />
          <div className="main-content">
            <p>Cargando carta...</p>
          </div>
        </div>
        <FooterInstitucional />
      </>
    );
  }

  if (!carta) {
    return (
      <>
        <HeaderInstitucional />
        <div className="layout">
          <SidebarAdmin />
          <div className="main-content">
            <p>Carta no encontrada</p>
          </div>
        </div>
        <FooterInstitucional />
      </>
    );
  }

  const datosAdicionales = carta.datos_adicionales || {};
  const usuario = carta.usuarios || {};

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
              <li><strong>Practicante:</strong> {usuario.nombre || "N/A"} ({usuario.expediente || "N/A"})</li>
              <li><strong>Empresa:</strong> {carta.empresa || "N/A"}</li>
              {datosAdicionales.responsable && (
                <li><strong>Responsable:</strong> {datosAdicionales.responsable}</li>
              )}
              {datosAdicionales.motivo && (
                <li><strong>Motivo:</strong> {datosAdicionales.motivo}</li>
              )}
              <li><strong>Fecha de creación:</strong> {new Date(carta.fecha_creacion).toLocaleDateString()}</li>
            </ul>

            <button 
              className="approve-btn"
              onClick={() => actualizarEstado("aprobada")}
              disabled={procesando || estado === "aprobada"}
            >
              {procesando ? "Procesando..." : "Aprobar"}
            </button>

            <button 
              className="reject-btn"
              onClick={() => actualizarEstado("rechazada")}
              disabled={procesando || estado === "rechazada"}
            >
              {procesando ? "Procesando..." : "Rechazar"}
            </button>

          </div>
        </div>

      </div>
      <FooterInstitucional />
    </>
  );
}
