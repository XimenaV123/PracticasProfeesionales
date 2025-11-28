import SidebarPract from "../../components/SidebarPract";
import { useState, useEffect } from "react";
import HeaderInstitucional from "../../components/HeaderInstitucional";
import FooterInstitucional from "../../components/FooterInstitucional";
import { crearCarta, enviarCarta, obtenerCartas, editarCarta } from "../../services/cartaService";

export default function CartaA() {
  const [status, setStatus] = useState("Sin enviar");
  const [cartaId, setCartaId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    empresa: "",
    responsable: "",
    motivo: "",
  });

  useEffect(() => {
    cargarCartaA();
  }, []);

  const cargarCartaA = async () => {
    try {
      const response = await obtenerCartas('A');
      const cartas = response.cartas || [];
      
      if (cartas.length > 0) {
        const carta = cartas[0];
        setCartaId(carta.id);
        setStatus(carta.estado === 'pendiente' ? 'Sin enviar' : 
                 carta.estado === 'enviando' ? 'Enviada al administrativo ✔' :
                 carta.estado === 'aprobada' ? 'Aprobada ✔' :
                 carta.estado === 'rechazada' ? 'Rechazada ✘' : carta.estado);
        
        // Cargar datos de la carta si existen
        if (carta.datos_adicionales) {
          setForm({
            empresa: carta.empresa || "",
            responsable: carta.datos_adicionales.responsable || "",
            motivo: carta.datos_adicionales.motivo || "",
          });
        } else if (carta.empresa) {
          setForm({
            empresa: carta.empresa,
            responsable: "",
            motivo: "",
          });
        }
      }
    } catch (error) {
      console.error("Error al cargar carta A:", error);
    }
  };

  const enviarFormulario = async () => {
    if (!form.empresa.trim()) {
      alert("Por favor, ingresa el nombre de la empresa");
      return;
    }

    try {
      setLoading(true);

      // Si ya existe una carta, editarla y enviarla
      if (cartaId) {
        await editarCarta(cartaId, form.empresa, {
          responsable: form.responsable,
          motivo: form.motivo
        });
        await enviarCarta(cartaId);
      } else {
        // Crear nueva carta y enviarla
        const response = await crearCarta('A', form.empresa, {
          responsable: form.responsable,
          motivo: form.motivo
        });
        setCartaId(response.carta.id);
        await enviarCarta(response.carta.id);
      }

      setStatus("Enviada al administrativo ✔");
      alert("Carta A enviada exitosamente");
    } catch (error) {
      console.error("Error al enviar carta:", error);
      alert(error.message || "Error al enviar la carta. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

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

            <button 
              className="send-btn" 
              onClick={enviarFormulario}
              disabled={loading || status.includes("Enviada") || status.includes("Aprobada")}
            >
                {loading ? "Enviando..." : "Enviar Carta A"}
            </button>

            </div>
        </div>
        </div>
        <FooterInstitucional />
    </>
  );
}
