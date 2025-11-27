import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import FooterInstitucional from "../components/FooterInstitucional";
import { supabase } from "../supabaseClient";


export default function Login() {
  const navigate = useNavigate();


  // Conexión a SUPABASE
const handleLogin = async (e) => {
  e.preventDefault();

  const expediente = e.target.expediente.value.trim();
  const password = e.target.password.value.trim();

  console.log("Intentando login:", { expediente, password });

  try {
    const { data, error, status } = await supabase
      .from("Usuarios")
      .select("*")
      .eq("expediente", expediente)
      .eq("password", password)
      .maybeSingle(); // <- no arroja error si no hay fila

    console.log("Supabase response:", { status, data, error });

    if (error) {
      // muestra detalle al usuario y en consola
      alert("Error al consultar credenciales. Revisa consola.");
      console.error("Supabase error detail:", error);
      return;
    }

    if (!data) {
      alert("Credenciales incorrectas (usuario/contraseña no encontrados)");
      return;
    }

    // OK: usuario encontrado
    if (data.tipo_usuario === "admin") navigate("/admin/dashboard");
    else navigate("/practicante/dashboard");

  } catch (err) {
    console.error("Excepción en handleLogin:", err);
    alert("Ocurrió un error inesperado. Revisa la consola.");
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
