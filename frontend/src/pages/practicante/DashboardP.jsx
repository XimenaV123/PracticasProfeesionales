import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SidebarPract from "../../components/SidebarPract";
import HeaderInstitucional from "../../components/HeaderInstitucional";
import FooterInstitucional from "../../components/FooterInstitucional";
import "../../styles/dashboardP.css";
import { obtenerCartas } from "../../services/cartaService";

export default function DashboardP() {
  const navigate = useNavigate();
  const [cartas, setCartas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarCartas();
  }, []);

  const cargarCartas = async () => {
    try {
      setLoading(true);
      const response = await obtenerCartas();
      setCartas(response.cartas || []);
    } catch (error) {
      console.error("Error al cargar cartas:", error);
      alert("Error al cargar las cartas. Por favor, recarga la página.");
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener el estado de una carta por tipo
  const obtenerEstadoCarta = (tipo) => {
    const carta = cartas.find(c => c.tipo === tipo);
    if (!carta) {
      return tipo === 'C' ? "Pendiente de subida" : "Sin enviar";
    }
    
    const estados = {
      'pendiente': 'Sin enviar',
      'enviando': 'Enviada al administrativo ✔',
      'en_proceso': 'En proceso',
      'recibido': 'Recibida',
      'revisada': 'Revisada',
      'aprobada': 'Aprobada ✔',
      'rechazada': 'Rechazada ✘'
    };
    
    return estados[carta.estado] || carta.estado;
  };

  // Función para verificar si una carta está disponible
  const cartaDisponible = (tipo) => {
    if (tipo === 'B' || tipo === 'D') {
      const carta = cartas.find(c => c.tipo === tipo);
      return carta && carta.archivo_url;
    }
    return true;
  };

  if (loading) {
    return (
      <>
        <HeaderInstitucional />
        <div className="layout">
          <SidebarPract />
          <div className="main-content">
            <p>Cargando...</p>
          </div>
        </div>
        <FooterInstitucional />
      </>
    );
  }

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
                📄 Carta A — {obtenerEstadoCarta('A')}
            </button>

            {/* Carta B */}
            {cartaDisponible('B') ? (
              <button
                className="card-btn"
                onClick={() => {
                  const cartaB = cartas.find(c => c.tipo === 'B');
                  if (cartaB) {
                    navigate(`/practicante/cartaB/${cartaB.id}`);
                  }
                }}
              >
                📥 Carta B — {obtenerEstadoCarta('B')}
              </button>
            ) : (
              <button className="card-btn disabled">
                📥 Carta B — No disponible
              </button>
            )}

            {/* Carta C */}
            <button
                className="card-btn"
                onClick={() => navigate("/practicante/cartaC")}
            >
                📤 Carta C — {obtenerEstadoCarta('C')}
            </button>

            {/* Carta D */}
            {cartaDisponible('D') ? (
              <button
                className="card-btn"
                onClick={() => {
                  const cartaD = cartas.find(c => c.tipo === 'D');
                  if (cartaD) {
                    navigate(`/practicante/cartaD/${cartaD.id}`);
                  }
                }}
              >
                📥 Carta D — {obtenerEstadoCarta('D')}
              </button>
            ) : (
              <button className="card-btn disabled">
                📥 Carta D — No disponible
              </button>
            )}

            </div>
        </div>
        </div>
        <FooterInstitucional />
    </>
  );
}
