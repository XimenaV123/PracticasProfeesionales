import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav style={{
      background: "#1c1f3b",
      padding: "1rem 2rem",
      color: "white",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <h2>PractiGest</h2>

      <button
        onClick={() => navigate("/")}
        style={{
          background: "#ff4b4b",
          border: "none",
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          color: "white"
        }}
      >
        Cerrar Sesión
      </button>
    </nav>
  );
}
