import express from 'express';
import { 
  login, 
  register, 
  verifyToken, 
  solicitarRecuperacion, 
  restablecerContraseña 
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Ruta pública: Login
router.post('/login', login);

// Ruta pública: Registro (puedes protegerla si lo deseas)
router.post('/register', register);

// Ruta pública: Solicitar recuperación de contraseña
router.post('/recuperar', solicitarRecuperacion);

// Ruta pública: Restablecer contraseña
router.post('/restablecer', restablecerContraseña);

// Ruta protegida: Verificar token
router.get('/verify', authenticateToken, verifyToken);

export default router;

