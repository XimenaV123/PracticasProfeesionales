import express from 'express';
import { login, register, verifyToken } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Ruta pública: Login
router.post('/login', login);

// Ruta pública: Registro (puedes protegerla si lo deseas)
router.post('/register', register);

// Ruta protegida: Verificar token
router.get('/verify', authenticateToken, verifyToken);

export default router;

