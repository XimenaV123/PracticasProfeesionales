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

       <div className="main-content">
        <h1>DOCUMENTOS PARA PRÁCTICAS PROFESIONALES</h1>

        <div className="documents">
          <div>
            <p>CARTA A</p>
            <button className="active">Carta de Presentación</button>
          </div>
          <div>
            <p>CARTA B</p>
            <button disabled>Carta de Aceptación</button>
          </div>
          <div>
            <p>CARTA C</p>
            <button disabled>Carta de Cumplimiento</button>
          </div>
          <div>
            <p>CARTA D</p>
            <button disabled>Carta de Liberación</button>
          </div>
        </div>
      </div>
    </div>
  );
}