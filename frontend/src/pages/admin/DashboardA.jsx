import SidebarAdmin from "../../components/SidebarAdmin";
import HeaderInstitucional from "../../components/HeaderInstitucional";
import FooterInstitucional from "../../components/FooterInstitucional";
import "../../styles/dashboardA.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { obtenerTodasLasCartas } from "../../services/cartaService";

export default function DashboardA() {
  const navigate = useNavigate();
  const [practicantes, setPracticantes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarCartas();
  }, []);

  const cargarCartas = async () => {
    try {
      setLoading(true);
      const response = await obtenerTodasLasCartas();
      const cartas = response.cartas || [];
      
      // Agrupar cartas por usuario
      const practicantesMap = new Map();
      
      cartas.forEach(carta => {
        const usuario = carta.usuarios || {};
        const usuarioId = usuario.id || carta.usuario_id;
        const nombre = usuario.nombre || "Sin nombre";
        const expediente = usuario.expediente || "N/A";
        
        if (!practicantesMap.has(usuarioId)) {
          practicantesMap.set(usuarioId, {
            id: usuarioId,
            nombre,
            expediente,
            cartaA: null,
            cartaC: null,
          });
        }
        
        const practicante = practicantesMap.get(usuarioId);
        if (carta.tipo === 'A') {
          practicante.cartaA = carta;
        } else if (carta.tipo === 'C') {
          practicante.cartaC = carta;
        }
      });
      
      // Convertir a array y formatear para la tabla
      const practicantesArray = Array.from(practicantesMap.values()).map(p => ({
        nombre: p.nombre,
        expediente: p.expediente,
        cartaA: p.cartaA ? obtenerEstadoTexto(p.cartaA.estado) : "Sin enviar",
        cartaC: p.cartaC ? obtenerEstadoTexto(p.cartaC.estado) : "Sin subir",
        cartaAId: p.cartaA?.id,
        cartaCId: p.cartaC?.id,
      }));
      
      setPracticantes(practicantesArray);
    } catch (error) {
      console.error("Error al cargar cartas:", error);
      alert("Error al cargar las cartas. Por favor, recarga la página.");
    } finally {
      setLoading(false);
    }
  };

  const obtenerEstadoTexto = (estado) => {
    const estados = {
      'pendiente': 'Pendiente',
      'enviando': 'Enviada',
      'en_proceso': 'En proceso',
      'recibido': 'Recibida',
      'revisada': 'Revisada',
      'aprobada': 'Aprobada',
      'rechazada': 'Rechazada'
    };
    return estados[estado] || estado;
  };

  return (
    <>
      {/* 🔹 HEADER INSTITUCIONAL */}
      <HeaderInstitucional />

      <div className="layout">
        <SidebarAdmin />

        <div className="main-content">
          <h1>Panel del Administrador</h1>
          <p>Gestión de cartas y revisión de documentos de practicantes.</p>

          {/* 🔵 TARJETAS PRINCIPALES */}
          <div className="cards-admin-container">

            <button 
              className="card-btn"
              onClick={() => navigate("/admin/revisarCartaA")}
            >
              📄 Revisar Carta A
            </button>

            <button 
              className="card-btn"
              onClick={() => navigate("/admin/revisarCartaC")}
            >
              📤 Revisar Carta C
            </button>

            <button className="card-btn disabled">
              📥 Carta B — No disponible
            </button>

            <button className="card-btn disabled">
              📥 Carta D — No disponible
            </button>

          </div>

          {/* 🔵 TABLA DE PRACTICANTES */}
          <h2 style={{ marginTop: "3rem" }}>Practicantes registrados</h2>

          {loading ? (
            <p>Cargando practicantes...</p>
          ) : (
            <div className="admin-table">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Expediente</th>
                    <th>Carta A</th>
                    <th>Carta C</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {practicantes.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        No hay practicantes registrados
                      </td>
                    </tr>
                  ) : (
                    practicantes.map((p, index) => (
                      <tr key={index}>
                        <td>{p.nombre}</td>
                        <td>{p.expediente}</td>
                        <td>{p.cartaA}</td>
                        <td>{p.cartaC}</td>
                        <td>
                          {p.cartaAId && (
                            <button 
                              onClick={() => navigate(`/admin/revisarCartaA/${p.cartaAId}`)}
                              style={{ marginRight: "0.5rem", padding: "0.25rem 0.5rem" }}
                            >
                              Ver A
                            </button>
                          )}
                          {p.cartaCId && (
                            <button 
                              onClick={() => navigate(`/admin/revisarCartaC/${p.cartaCId}`)}
                              style={{ padding: "0.25rem 0.5rem" }}
                            >
                              Ver C
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

              </table>
            </div>
          )}

        </div>
      </div>
    <FooterInstitucional />
    </>
  );
}
