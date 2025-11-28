import SidebarAdmin from "../../components/SidebarAdmin";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderInstitucional from "../../components/HeaderInstitucional";
import FooterInstitucional from "../../components/FooterInstitucional";
import { obtenerTodasLasCartas, actualizarEstadoCarta } from "../../services/cartaService";

export default function RevisarCartaC() {
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

  const usuario = carta.usuarios || {};
  const estadosTexto = {
    'pendiente': 'Pendiente de revisión',
    'enviando': 'En revisión',
    'en_proceso': 'En proceso',
    'aprobada': 'Aceptada ✔',
    'rechazada': 'Rechazada ✘'
  };

  return (
    <>
      <HeaderInstitucional />
      <div className="layout">
        <SidebarAdmin />

        <div className="main-content">
          <h1>Revisión de Carta C</h1>

          <p>Estado actual: <strong>{estadosTexto[estado] || estado}</strong></p>

          <div className="admin-review-container">
            <h3>Información de la carta:</h3>
            <ul>
              <li><strong>Practicante:</strong> {usuario.nombre || "N/A"} ({usuario.expediente || "N/A"})</li>
              <li><strong>Empresa:</strong> {carta.empresa || "N/A"}</li>
              {carta.archivo_nombre && (
                <li><strong>Archivo recibido:</strong> {carta.archivo_nombre}</li>
              )}
              {carta.archivo_url && (
                <li>
                  <strong>Ver archivo:</strong>{" "}
                  <a href={carta.archivo_url} target="_blank" rel="noopener noreferrer">
                    Abrir archivo
                  </a>
                </li>
              )}
              <li><strong>Fecha de envío:</strong> {carta.fecha_envio ? new Date(carta.fecha_envio).toLocaleDateString() : "N/A"}</li>
            </ul>

            {carta.archivo_url ? (
              <>
                <button 
                  className="approve-btn"
                  onClick={() => actualizarEstado("aprobada")}
                  disabled={procesando || estado === "aprobada"}
                >
                  {procesando ? "Procesando..." : "Aceptar"}
                </button>

                <button 
                  className="reject-btn"
                  onClick={() => actualizarEstado("rechazada")}
                  disabled={procesando || estado === "rechazada"}
                >
                  {procesando ? "Procesando..." : "Rechazar"}
                </button>
              </>
            ) : (
              <p style={{ color: "#666" }}>El practicante aún no ha subido el archivo.</p>
            )}

          </div>

        </div>
      </div>
      <FooterInstitucional />
    </>
  );
}
