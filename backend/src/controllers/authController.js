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

/**
 * Solicitar recuperación de contraseña
 */
export const solicitarRecuperacion = async (req, res) => {
  try {
    const { expediente, email } = req.body;

    if (!expediente || !email) {
      return res.status(400).json({ 
        error: 'Expediente y email son requeridos' 
      });
    }

    // Verificar que el usuario existe y el email coincide
    const { data: user, error: userError } = await supabase
      .from('usuarios')
      .select('id, expediente, email, nombre')
      .eq('expediente', expediente)
      .eq('email', email)
      .single();

    if (userError || !user) {
      // Por seguridad, no revelamos si el usuario existe o no
      return res.json({
        message: 'Si el expediente y email son correctos, recibirás un enlace de recuperación'
      });
    }

    // Generar token de recuperación (válido por 1 hora)
    const resetToken = jwt.sign(
      { 
        userId: user.id, 
        tipo: 'password_reset' 
      },
      process.env.JWT_SECRET || 'tu-secret-key-cambiar-en-produccion',
      { expiresIn: '1h' }
    );

    // Guardar token en la base de datos
    const { error: updateError } = await supabase
      .from('usuarios')
      .update({ 
        reset_token: resetToken,
        reset_token_expires: new Date(Date.now() + 3600000).toISOString() // 1 hora
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error al guardar token de recuperación:', updateError);
      return res.status(500).json({ 
        error: 'Error al procesar la solicitud' 
      });
    }

    // En producción, aquí enviarías un email con el token
    // Por ahora, retornamos el token (solo para desarrollo)
    // En producción, eliminar esta línea y enviar email
    if (process.env.NODE_ENV === 'development') {
      return res.json({
        message: 'Token de recuperación generado (solo desarrollo)',
        resetToken: resetToken // Eliminar en producción
      });
    }

    res.json({
      message: 'Si el expediente y email son correctos, recibirás un enlace de recuperación'
    });
  } catch (error) {
    console.error('Error en solicitarRecuperacion:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
};

/**
 * Restablecer contraseña con token
 */
export const restablecerContraseña = async (req, res) => {
  try {
    const { token, nuevaContraseña } = req.body;

    if (!token || !nuevaContraseña) {
      return res.status(400).json({ 
        error: 'Token y nueva contraseña son requeridos' 
      });
    }

    if (nuevaContraseña.length < 6) {
      return res.status(400).json({ 
        error: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    // Verificar token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu-secret-key-cambiar-en-produccion');
      
      if (decoded.tipo !== 'password_reset') {
        return res.status(400).json({ 
          error: 'Token inválido' 
        });
      }
    } catch (error) {
      return res.status(400).json({ 
        error: 'Token inválido o expirado' 
      });
    }

    // Verificar que el token existe en la base de datos y no ha expirado
    const { data: user, error: userError } = await supabase
      .from('usuarios')
      .select('id, reset_token, reset_token_expires')
      .eq('id', decoded.userId)
      .single();

    if (userError || !user) {
      return res.status(400).json({ 
        error: 'Token inválido' 
      });
    }

    if (user.reset_token !== token) {
      return res.status(400).json({ 
        error: 'Token inválido' 
      });
    }

    if (new Date(user.reset_token_expires) < new Date()) {
      return res.status(400).json({ 
        error: 'Token expirado' 
      });
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);

    // Actualizar contraseña y limpiar token
    const { error: updateError } = await supabase
      .from('usuarios')
      .update({
        contraseña: hashedPassword,
        reset_token: null,
        reset_token_expires: null
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error al actualizar contraseña:', updateError);
      return res.status(500).json({ 
        error: 'Error al restablecer la contraseña' 
      });
    }

    res.json({
      message: 'Contraseña restablecida exitosamente'
    });
  } catch (error) {
    console.error('Error en restablecerContraseña:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
};

