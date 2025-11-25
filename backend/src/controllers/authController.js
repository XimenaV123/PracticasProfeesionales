import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';

/**
 * Login con expediente y contraseña
 */
export const login = async (req, res) => {
  try {
    const { expediente, contraseña } = req.body;

    // Validar que se proporcionen los datos
    if (!expediente || !contraseña) {
      return res.status(400).json({ 
        error: 'Expediente y contraseña son requeridos' 
      });
    }

    // Buscar usuario por expediente
    const { data: user, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('expediente', expediente)
      .single();

    if (userError || !user) {
      return res.status(401).json({ 
        error: 'Expediente o contraseña incorrectos' 
      });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(contraseña, user.contraseña);
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Expediente o contraseña incorrectos' 
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        expediente: user.expediente,
        rol: user.rol 
      },
      process.env.JWT_SECRET || 'tu-secret-key-cambiar-en-produccion',
      { expiresIn: '24h' }
    );

    // Retornar datos del usuario (sin contraseña) y token
    const { contraseña: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login exitoso',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
};

/**
 * Verificar token y obtener información del usuario actual
 */
export const verifyToken = async (req, res) => {
  try {
    // El middleware authenticateToken ya verificó el token
    // y agregó req.user
    res.json({
      user: req.user
    });
  } catch (error) {
    console.error('Error al verificar token:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
};

/**
 * Registrar nuevo usuario (solo para administradores o registro inicial)
 */
export const register = async (req, res) => {
  try {
    const {
      expediente,
      contraseña,
      nombre,
      curp,
      carrera,
      semestre,
      imss,
      telefono,
      email,
      fechaNacimiento,
      rol = 'estudiante'
    } = req.body;

    // Validar campos requeridos
    if (!expediente || !contraseña || !nombre || !email) {
      return res.status(400).json({ 
        error: 'Expediente, contraseña, nombre y email son requeridos' 
      });
    }

    // Verificar que el expediente no exista
    const { data: existingUser } = await supabase
      .from('usuarios')
      .select('id')
      .eq('expediente', expediente)
      .single();

    if (existingUser) {
      return res.status(400).json({ 
        error: 'El expediente ya está registrado' 
      });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Crear usuario en Supabase
    const { data: newUser, error: insertError } = await supabase
      .from('usuarios')
      .insert({
        expediente,
        contraseña: hashedPassword,
        nombre,
        curp,
        carrera,
        semestre,
        imss,
        telefono,
        email,
        fechaNacimiento,
        rol
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error al crear usuario:', insertError);
      return res.status(500).json({ 
        error: 'Error al crear usuario', 
        details: insertError.message 
      });
    }

    // Generar token
    const token = jwt.sign(
      { 
        userId: newUser.id, 
        expediente: newUser.expediente,
        rol: newUser.rol 
      },
      process.env.JWT_SECRET || 'tu-secret-key-cambiar-en-produccion',
      { expiresIn: '24h' }
    );

    const { contraseña: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
};

