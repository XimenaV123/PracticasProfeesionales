import express from 'express';
import {
  crearCarta,
  editarCarta,
  enviarCarta,
  obtenerCartas,
  obtenerCartaPorId,
  verEstadoCarta,
  actualizarEstadoCarta,
  obtenerTodasLasCartas,
  subirCartaC,
  descargarCartaB,
  descargarCartaD
} from '../controllers/cartaController.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import multer from 'multer';

// Configuración de multer para subida de archivos
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB máximo
  fileFilter: (req, file, cb) => {
    // Aceptar solo PDFs e imágenes
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(file.originalname.toLowerCase().split('.').pop());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF, JPG, JPEG o PNG'));
    }
  }
});

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas para estudiantes
router.post('/', crearCarta); // Crear carta
router.put('/:cartaId', editarCarta); // Editar carta
router.get('/', obtenerCartas); // Obtener mis cartas
router.get('/:cartaId', obtenerCartaPorId); // Obtener carta específica
router.get('/:cartaId/estado', verEstadoCarta); // Ver estado de carta
router.post('/:cartaId/enviar', enviarCarta); // Enviar carta
router.post('/:cartaId/subir-carta-c', upload.single('archivo'), subirCartaC); // Subir carta C firmada
router.get('/:cartaId/descargar-b', descargarCartaB); // Descargar carta B
router.get('/:cartaId/descargar-d', descargarCartaD); // Descargar carta D

// Rutas para administradores/coordinadores
router.get('/admin/todas', isAdmin, obtenerTodasLasCartas); // Obtener todas las cartas
router.put('/admin/:cartaId/estado', isAdmin, actualizarEstadoCarta); // Actualizar estado de carta

export default router;

