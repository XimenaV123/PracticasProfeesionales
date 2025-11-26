import express from 'express';
import {
  obtenerNotificaciones,
  marcarComoLeida,
  marcarTodasComoLeidas,
  obtenerContadorNoLeidas
} from '../controllers/notificacionController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

router.get('/', obtenerNotificaciones); // Obtener notificaciones
router.get('/contador', obtenerContadorNoLeidas); // Contador de no leídas
router.put('/:notificacionId/leida', marcarComoLeida); // Marcar como leída
router.put('/marcar-todas', marcarTodasComoLeidas); // Marcar todas como leídas

export default router;

