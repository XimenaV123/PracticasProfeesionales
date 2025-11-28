import express from 'express';
import {
  obtenerPerfil,
  actualizarPerfil,
  obtenerEstadisticas
} from '../controllers/usuarioController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

router.get('/perfil', obtenerPerfil); // Obtener perfil
router.put('/perfil', actualizarPerfil); // Actualizar perfil
router.get('/estadisticas', obtenerEstadisticas); // Obtener estadísticas

export default router;

