import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import FooterInstitucional from "../components/FooterInstitucional";
import { login } from "../services/authService";


export default function Login() {
  const navigate = useNavigate();


  // Conexión al backend mediante fetch
const handleLogin = async (e) => {
  e.preventDefault();

  const expediente = e.target.expediente.value.trim();
  const contraseña = e.target.password.value.trim();

  console.log("Intentando login:", { expediente });

  try {
    const response = await login(expediente, contraseña);

    console.log("Login exitoso:", response);

    // Redirigir según el rol del usuario
    if (response.user) {
      const rol = response.user.rol || response.user.tipo_usuario;
      if (rol === "admin" || rol === "administrador") {
        navigate("/admin/dashboard");
      } else {
        navigate("/practicante/dashboard");
      }
    } else {
      alert("Error: No se recibieron datos del usuario");
    }

  } catch (err) {
    console.error("Error en login:", err);
    alert(err.message || "Error al iniciar sesión. Verifica tus credenciales.");
  }
};

    
  return (  
    <>
        <div className="login-header">
        <img src="/LogoUAQ.png" alt="Logo UAQ" className="header-logo" />
        <h1 className="header-title">Gestión de Prácticas Profesionales</h1>
        </div>

        {/* LÍNEA DORADA */}
        <div className="header-gold-line"></div>

            <div className="login-container">

            <div className="login-box">
                <h2>Iniciar Sesión</h2>

                <form onSubmit={handleLogin}>

                <input
                    type="text"
                    name="expediente"
                    placeholder="Expediente / Usuario"
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    required
                />

                <button type="submit">Entrar</button>
                </form>
            </div>
            </div>
    <FooterInstitucional />
    </>
  );
}
