import { supabase } from '../config/supabase.js';

/**
 * Obtener todas las notificaciones del usuario autenticado
 */
export const obtenerNotificaciones = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { leida } = req.query; // Filtro opcional para notificaciones leídas/no leídas

    let query = supabase
      .from('notificaciones')
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('fecha_creacion', { ascending: false });

    // Aplicar filtro si existe
    if (leida !== undefined) {
      query = query.eq('leida', leida === 'true');
    }

    const { data: notificaciones, error } = await query;

    if (error) {
      console.error('Error al obtener notificaciones:', error);
      return res.status(500).json({ 
        error: 'Error al obtener notificaciones', 
        details: error.message 
      });
    }

    res.json({
      notificaciones: notificaciones || []
    });
  } catch (error) {
    console.error('Error en obtenerNotificaciones:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
};

/**
 * Marcar notificación como leída
 */
export const marcarComoLeida = async (req, res) => {
  try {
    const { notificacionId } = req.params;
    const usuarioId = req.user.id;

    // Verificar que la notificación existe y pertenece al usuario
    const { data: notificacion, error: fetchError } = await supabase
      .from('notificaciones')
      .select('*')
      .eq('id', notificacionId)
      .eq('usuario_id', usuarioId)
      .single();

    if (fetchError || !notificacion) {
      return res.status(404).json({ 
        error: 'Notificación no encontrada' 
      });
    }

    // Marcar como leída
    const { data: notificacionActualizada, error: updateError } = await supabase
      .from('notificaciones')
      .update({
        leida: true,
        fecha_lectura: new Date().toISOString()
      })
      .eq('id', notificacionId)
      .select()
      .single();

    if (updateError) {
      console.error('Error al marcar notificación:', updateError);
      return res.status(500).json({ 
        error: 'Error al marcar notificación', 
        details: updateError.message 
      });
    }

    res.json({
      message: 'Notificación marcada como leída',
      notificacion: notificacionActualizada
    });
  } catch (error) {
    console.error('Error en marcarComoLeida:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
};

/**
 * Marcar todas las notificaciones como leídas
 */
export const marcarTodasComoLeidas = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const { error: updateError } = await supabase
      .from('notificaciones')
      .update({
        leida: true,
        fecha_lectura: new Date().toISOString()
      })
      .eq('usuario_id', usuarioId)
      .eq('leida', false);

    if (updateError) {
      console.error('Error al marcar notificaciones:', updateError);
      return res.status(500).json({ 
        error: 'Error al marcar notificaciones', 
        details: updateError.message 
      });
    }

    res.json({
      message: 'Todas las notificaciones marcadas como leídas'
    });
  } catch (error) {
    console.error('Error en marcarTodasComoLeidas:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
};

/**
 * Obtener contador de notificaciones no leídas
 */
export const obtenerContadorNoLeidas = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const { count, error } = await supabase
      .from('notificaciones')
      .select('*', { count: 'exact', head: true })
      .eq('usuario_id', usuarioId)
      .eq('leida', false);

    if (error) {
      console.error('Error al contar notificaciones:', error);
      return res.status(500).json({ 
        error: 'Error al contar notificaciones', 
        details: error.message 
      });
    }

    res.json({
      contador: count || 0
    });
  } catch (error) {
    console.error('Error en obtenerContadorNoLeidas:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
};

/**
 * Crear notificación (función auxiliar para usar desde otros controladores)
 */
export const crearNotificacion = async (usuarioId, tipo, titulo, mensaje, cartaId = null) => {
  try {
    const { data: notificacion, error } = await supabase
      .from('notificaciones')
      .insert({
        usuario_id: usuarioId,
        tipo,
        titulo,
        mensaje,
        carta_id: cartaId,
        leida: false,
        fecha_creacion: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error al crear notificación:', error);
      return null;
    }

    return notificacion;
  } catch (error) {
    console.error('Error en crearNotificacion:', error);
    return null;
  }
};

