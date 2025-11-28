import SidebarPract from "../../components/SidebarPract";
import { useState, useEffect } from "react";
import HeaderInstitucional from "../../components/HeaderInstitucional";
import FooterInstitucional from "../../components/FooterInstitucional";
import { obtenerCartas, subirCartaC } from "../../services/cartaService";

export default function CartaC() {
  const [archivo, setArchivo] = useState(null);
  const [archivoNombre, setArchivoNombre] = useState(null);
  const [estado, setEstado] = useState("Pendiente de subida");
  const [cartaId, setCartaId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarCartaC();
  }, []);

  const cargarCartaC = async () => {
    try {
      const response = await obtenerCartas('C');
      const cartas = response.cartas || [];
      
      if (cartas.length > 0) {
        const carta = cartas[0];
        setCartaId(carta.id);
        
        const estados = {
          'pendiente': 'Pendiente de subida',
          'enviando': 'En revisión por el administrativo ✔',
          'en_proceso': 'En proceso',
          'aprobada': 'Aceptada ✔',
          'rechazada': 'Rechazada ✘'
        };
        
        setEstado(estados[carta.estado] || carta.estado);
        
        if (carta.archivo_nombre) {
          setArchivoNombre(carta.archivo_nombre);
        }
      }
    } catch (error) {
      console.error("Error al cargar carta C:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert("Solo se permiten archivos PDF, JPG, JPEG o PNG");
        return;
      }
      
      // Validar tamaño (10MB máximo)
      if (file.size > 10 * 1024 * 1024) {
        alert("El archivo no debe exceder 10MB");
        return;
      }
      
      setArchivo(file);
      setArchivoNombre(file.name);
    }
  };

  const enviarArchivo = async () => {
    if (!archivo) {
      alert("Por favor, selecciona un archivo");
      return;
    }

    if (!cartaId) {
      alert("Error: No se encontró la carta C. Por favor, recarga la página.");
      return;
    }

    try {
      setLoading(true);
      await subirCartaC(cartaId, archivo);
      setEstado("En revisión por el administrativo ✔");
      alert("Archivo subido exitosamente");
    } catch (error) {
      console.error("Error al subir archivo:", error);
      alert(error.message || "Error al subir el archivo. Por favor, intenta de nuevo.");
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
            <h1>Revisión de Carta C</h1>

            <p>Estado actual: <strong>{estado}</strong></p>

            <div className="admin-review-container">

                {archivoNombre && (
                  <p><strong>Archivo recibido:</strong> {archivoNombre}</p>
                )}

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  disabled={loading || estado.includes("Enviada") || estado.includes("Aceptada")}
                  style={{ marginBottom: "1rem" }}
                />

                <button 
                  className="send-btn"
                  onClick={enviarArchivo}
                  disabled={loading || !archivo || estado.includes("Enviada") || estado.includes("Aceptada")}
                >
                  {loading ? "Subiendo..." : "Subir Carta C"}
                </button>

            </div>
            </div>

        </div>
        <FooterInstitucional />
    </>
  );
}
