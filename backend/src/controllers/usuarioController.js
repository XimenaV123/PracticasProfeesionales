import { supabase } from '../config/supabase.js';

/**
 * Obtener perfil del usuario autenticado
 */
export const obtenerPerfil = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('id, expediente, nombre, curp, carrera, semestre, imss, telefono, email, fechaNacimiento, rol')
      .eq('id', usuarioId)
      .single();

    if (error || !usuario) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }

    res.json({
      usuario
    });
  } catch (error) {
    console.error('Error en obtenerPerfil:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
};

/**
 * Actualizar perfil del usuario autenticado
 */
export const actualizarPerfil = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const {
      nombre,
      curp,
      carrera,
      semestre,
      imss,
      telefono,
      email,
      fechaNacimiento
    } = req.body;

    // Preparar datos a actualizar (solo los campos proporcionados)
    const updateData = {};
    if (nombre !== undefined) updateData.nombre = nombre;
    if (curp !== undefined) updateData.curp = curp;
    if (carrera !== undefined) updateData.carrera = carrera;
    if (semestre !== undefined) updateData.semestre = semestre;
    if (imss !== undefined) updateData.imss = imss;
    if (telefono !== undefined) updateData.telefono = telefono;
    if (email !== undefined) updateData.email = email;
    if (fechaNacimiento !== undefined) updateData.fechaNacimiento = fechaNacimiento;

    // Verificar que hay datos para actualizar
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ 
        error: 'No se proporcionaron datos para actualizar' 
      });
    }

    // Actualizar usuario
    const { data: usuarioActualizado, error: updateError } = await supabase
      .from('usuarios')
      .update(updateData)
      .eq('id', usuarioId)
      .select('id, expediente, nombre, curp, carrera, semestre, imss, telefono, email, fechaNacimiento, rol')
      .single();

    if (updateError) {
      console.error('Error al actualizar perfil:', updateError);
      return res.status(500).json({ 
        error: 'Error al actualizar el perfil', 
        details: updateError.message 
      });
    }

    res.json({
      message: 'Perfil actualizado exitosamente',
      usuario: usuarioActualizado
    });
  } catch (error) {
    console.error('Error en actualizarPerfil:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
};

/**
 * Obtener estadísticas del usuario (número de cartas por estado)
 */
export const obtenerEstadisticas = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    // Obtener todas las cartas del usuario
    const { data: cartas, error } = await supabase
      .from('cartas')
      .select('estado, tipo')
      .eq('usuario_id', usuarioId);

    if (error) {
      console.error('Error al obtener estadísticas:', error);
      return res.status(500).json({ 
        error: 'Error al obtener estadísticas', 
        details: error.message 
      });
    }

    // Calcular estadísticas
    const estadisticas = {
      total: cartas?.length || 0,
      porEstado: {
        pendiente: 0,
        enviada: 0,
        revisada: 0,
        aprobada: 0,
        rechazada: 0
      },
      porTipo: {
        A: 0,
        B: 0,
        C: 0,
        D: 0
      }
    };

    cartas?.forEach(carta => {
      if (estadisticas.porEstado[carta.estado] !== undefined) {
        estadisticas.porEstado[carta.estado]++;
      }
      if (estadisticas.porTipo[carta.tipo] !== undefined) {
        estadisticas.porTipo[carta.tipo]++;
      }
    });

    res.json({
      estadisticas
    });
  } catch (error) {
    console.error('Error en obtenerEstadisticas:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
};

