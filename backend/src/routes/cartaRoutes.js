import express from 'express';
import {
  crearCarta,
  enviarCarta,
  obtenerCartas,
  obtenerCartaPorId,
  verEstadoCarta,
  actualizarEstadoCarta,
  obtenerTodasLasCartas
} from '../controllers/cartaController.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas para estudiantes
router.post('/', crearCarta); // Crear carta
router.get('/', obtenerCartas); // Obtener mis cartas
router.get('/:cartaId', obtenerCartaPorId); // Obtener carta específica
router.get('/:cartaId/estado', verEstadoCarta); // Ver estado de carta
router.post('/:cartaId/enviar', enviarCarta); // Enviar carta

// Rutas para administradores/coordinadores
router.get('/admin/todas', isAdmin, obtenerTodasLasCartas); // Obtener todas las cartas
router.put('/admin/:cartaId/estado', isAdmin, actualizarEstadoCarta); // Actualizar estado de carta

export default router;

