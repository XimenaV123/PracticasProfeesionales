import React from "react";
import "./styles/Home.css";

/* Exportar datos de la BD */
export default function Home() {
  const user = {
    expediente: "12345",
    nombre: "Ximena Valdez",
    curp: "VAPX950101MXN",
    carrera: "Software",
    semestre: 5,
    imss: "1324567878",
    telefono: "4426783912",
    email: "ximena@example.com",
    fechaNacimiento: "2001-01-01",
  };

  return (
    <div className="container">
      {/* Panel Izquierdo */}
      <aside className="sidebar">
        <div className="profile">
          <img src="/profile.png" alt="Foto de perfil" className="profile-img" />
          <div className="info">
            <p><strong>EXPEDIENTE:</strong> {user.expediente}</p>
            <p><strong>NOMBRE:</strong> {user.nombre}</p>
            <p><strong>CURP:</strong> {user.curp}</p>
            <p><strong>CARRERA:</strong> {user.carrera}</p>
            <p><strong>SEMESTRE:</strong> {user.semestre}</p>
            <p><strong>IMSS:</strong> {user.imss}</p>
            <p><strong>TELÉFONO:</strong> {user.telefono}</p>
            <p><strong>EMAIL:</strong> {user.email}</p>
            <p><strong>FECHA NAC.:</strong> {user.fechaNacimiento}</p>
          </div>
        </div>

        <button className="logout">Cerrar sesión</button>
      </aside>

      {/* Panel Derecho */}
      <main className="main-content">
        <h2>DOCUMENTOS PARA PRÁCTICAS PROFESIONALES</h2>

        <div className="document-list">
          <div className="document">
            <span>CARTA A</span>
            <button className="primary">Carta de Presentación</button>
          </div>

          <div className="document">
            <span>CARTA B</span>
            <button>Carta de Aceptación</button>
          </div>

          <div className="document">
            <span>CARTA C</span>
            <button>Carta de Cumplimiento</button>
          </div>

          <div className="document">
            <span>CARTA D</span>
            <button>Carta de Liberación</button>
          </div>
        </div>
      </main>
    </div>
  );
}