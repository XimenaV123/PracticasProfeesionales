import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';

/**
 * Middleware para verificar el token JWT
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Token de acceso requerido' 
      });
    }

    // Verificar token con JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu-secret-key-cambiar-en-produccion');
    
    // Verificar que el usuario existe en Supabase
    const { data: user, error } = await supabase
      .from('usuarios')
      .select('id, expediente, nombre, email, rol')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      return res.status(401).json({ 
        error: 'Usuario no encontrado o token inválido' 
      });
    }

    // Agregar información del usuario al request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        error: 'Token inválido' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ 
        error: 'Token expirado' 
      });
    }
    return res.status(500).json({ 
      error: 'Error al verificar token' 
    });
  }
};

/**
 * Middleware para verificar si el usuario tiene permisos de administrador
 */
export const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Usuario no autenticado' 
      });
    }

    if (req.user.rol !== 'admin' && req.user.rol !== 'coordinador') {
      return res.status(403).json({ 
        error: 'No tienes permisos para realizar esta acción' 
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ 
      error: 'Error al verificar permisos' 
    });
  }
};

