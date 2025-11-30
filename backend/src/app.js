import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import cartaRoutes from "./routes/cartaRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import notificacionRoutes from "./routes/notificacionRoutes.js";

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // URL del frontend
  credentials: true, // Permitir cookies si las usas
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rutas
app.get("/", (req, res) => {
  res.json({ 
    message: "API de Prácticas Profesionales",
    version: "1.0.0"
  });
});

// Rutas de autenticación
app.use("/api/auth", authRoutes);

// Rutas de cartas
app.use("/api/cartas", cartaRoutes);

// Rutas de usuarios
app.use("/api/usuarios", usuarioRoutes);

// Rutas de notificaciones
app.use("/api/notificaciones", notificacionRoutes);

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ 
    error: "Ruta no encontrada" 
  });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: "Error interno del servidor" 
  });
});

export default app;