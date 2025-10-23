import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, User, FileText } from 'lucide-react';
import { formatTo24Hour, formatTo12Hour } from '../utils/dateTime';
import { useToast } from '../contexts/ToastContext';

// Tipos locales para evitar problemas de importación
interface Turno {
  id: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  cancha_id: string;
  cancha?: {
    id: string;
    nombre: string;
    ubicacion?: string;
  };
  usuario_id: string;
  usuario?: {
    id: string;
    nombre: string;
    email: string;
  };
  socio_id?: string;
  socio?: {
    id: string;
    nombre: string;
    tipo_membresia: string;
  };
  estado: 'en_progreso' | 'completado';
  observaciones?: string;
  created_at: string;
  updated_at: string;
}

interface CanchaBackend {
  id: string;
  nombre: string;
  ubicacion?: string;
  tipo?: string;
  precio_por_hora: number;
  disponible: boolean;
  created_at: string;
  updated_at: string;
}

interface EditarTurnoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (turnoData: Partial<Turno>) => Promise<void>;
  turno: Turno | null;
  canchas: CanchaBackend[];
}

export const EditarTurnoModal: React.FC<EditarTurnoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  turno,
  canchas
}) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    fecha: '',
    hora_inicio: '',
    hora_fin: '',
    cancha_id: '',
    observaciones: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar datos del turno cuando se abre el modal
  useEffect(() => {
    if (isOpen && turno) {
      setFormData({
        fecha: turno.fecha,
        hora_inicio: turno.hora_inicio,
        hora_fin: turno.hora_fin,
        cancha_id: turno.cancha_id,
        observaciones: turno.observaciones || ''
      });
      setErrors({});
    }
  }, [isOpen, turno]);

  if (!isOpen || !turno) return null;

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fecha) {
      newErrors.fecha = 'La fecha es requerida';
    }

    if (!formData.hora_inicio) {
      newErrors.hora_inicio = 'La hora de inicio es requerida';
    }

    if (!formData.hora_fin) {
      newErrors.hora_fin = 'La hora de fin es requerida';
    }

    if (!formData.cancha_id) {
      newErrors.cancha_id = 'Debe seleccionar una cancha';
    }

    // Validar que hora_fin sea mayor que hora_inicio
    if (formData.hora_inicio && formData.hora_fin) {
      const inicio = new Date(`2000-01-01T${formData.hora_inicio}`);
      const fin = new Date(`2000-01-01T${formData.hora_fin}`);
      
      if (fin <= inicio) {
        newErrors.hora_fin = 'La hora de fin debe ser posterior a la hora de inicio';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSave({
        fecha: formData.fecha,
        hora_inicio: formData.hora_inicio,
        hora_fin: formData.hora_fin,
        cancha_id: formData.cancha_id,
        observaciones: formData.observaciones
      });
      
      // Mostrar notificación de éxito
      addToast({
        type: 'success',
        title: 'Turno actualizado',
        message: 'El turno se ha actualizado correctamente',
        duration: 4000
      });
      
      onClose();
    } catch (error) {
      console.error('Error al actualizar turno:', error);
      
      // Mostrar notificación de error
      addToast({
        type: 'error',
        title: 'Error al actualizar',
        message: 'No se pudo actualizar el turno. Inténtelo nuevamente.',
        duration: 5000
      });
      
      setErrors({ general: 'Error al actualizar el turno. Inténtelo nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  // Auto-calcular hora_fin cuando cambia hora_inicio
  const handleHoraInicioChange = (hora: string) => {
    setFormData(prev => {
      const nuevaHoraInicio = hora;
      let nuevaHoraFin = prev.hora_fin;

      if (hora) {
        // Calcular hora_fin como hora_inicio + 2 horas
        const [horas, minutos] = hora.split(':').map(Number);
        const fechaInicio = new Date();
        fechaInicio.setHours(horas, minutos, 0, 0);
        
        const fechaFin = new Date(fechaInicio.getTime() + 2 * 60 * 60 * 1000); // +2 horas
        nuevaHoraFin = `${fechaFin.getHours().toString().padStart(2, '0')}:${fechaFin.getMinutes().toString().padStart(2, '0')}`;
      }

      return {
        ...prev,
        hora_inicio: nuevaHoraInicio,
        hora_fin: nuevaHoraFin
      };
    });
  };

  const getTurnoDisplayName = (turno: Turno) => {
    // Usar el nombre del turno si existe, sino generar uno basado en el número del día
    if (turno.nombre) {
      return turno.nombre;
    }
    // Fallback para turnos sin nombre
    if (turno.numero_turno_dia) {
      const numeroSecuencial = turno.numero_turno_dia.toString().padStart(3, '0');
      return `Turno - ${numeroSecuencial}`;
    }
    // Último recurso usando ID
    if (!turno.id) return 'Turno Sin ID';
    const numeroTurno = turno.id.slice(-3).toUpperCase();
    return `Turno #${numeroTurno}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">
            Editar {getTurnoDisplayName(turno)}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-xl transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {errors.general && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 text-red-400 rounded-xl">
              {errors.general}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Columna izquierda */}
            <div className="space-y-4">
              {/* Fecha */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  Fecha
                </label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white ${errors.fecha ? 'border-red-500' : 'border-gray-600'}`}
                />
                {errors.fecha && <p className="text-red-400 text-sm mt-1">{errors.fecha}</p>}
              </div>

              {/* Hora de inicio */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  Hora de Inicio
                </label>
                <input
                  type="time"
                  value={formData.hora_inicio}
                  onChange={(e) => handleHoraInicioChange(e.target.value)}
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white ${errors.hora_inicio ? 'border-red-500' : 'border-gray-600'}`}
                />
                {errors.hora_inicio && <p className="text-red-400 text-sm mt-1">{errors.hora_inicio}</p>}
                {formData.hora_inicio && (
                  <p className="text-xs text-gray-400 mt-1">
                    Formato 12h: {formatTo12Hour(formData.hora_inicio)}
                  </p>
                )}
              </div>

              {/* Hora de fin */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  Hora de Fin
                </label>
                <input
                  type="time"
                  value={formData.hora_fin}
                  onChange={(e) => setFormData(prev => ({ ...prev, hora_fin: e.target.value }))}
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white ${errors.hora_fin ? 'border-red-500' : 'border-gray-600'}`}
                />
                {errors.hora_fin && <p className="text-red-400 text-sm mt-1">{errors.hora_fin}</p>}
                {formData.hora_fin && (
                  <p className="text-xs text-gray-400 mt-1">
                    Formato 12h: {formatTo12Hour(formData.hora_fin)}
                  </p>
                )}
              </div>
            </div>

            {/* Columna derecha */}
            <div className="space-y-4">
              {/* Cancha */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  Cancha
                </label>
                <select
                  value={formData.cancha_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, cancha_id: e.target.value }))}
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white ${errors.cancha_id ? 'border-red-500' : 'border-gray-600'}`}
                >
                  <option value="" className="bg-gray-800 text-gray-400">Seleccionar Cancha</option>
                  {canchas.map((cancha) => (
                    <option key={cancha.id} value={cancha.id} className="bg-gray-800 text-white">
                      {cancha.nombre}
                    </option>
                  ))}
                </select>
                {errors.cancha_id && <p className="text-red-400 text-sm mt-1">{errors.cancha_id}</p>}
              </div>

              {/* Duración calculada */}
              {formData.hora_inicio && formData.hora_fin && (
                <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30">
                  <p className="text-sm text-blue-300">
                    <strong>Duración:</strong> {
                      (() => {
                        const inicio = new Date(`2000-01-01T${formData.hora_inicio}`);
                        const fin = new Date(`2000-01-01T${formData.hora_fin}`);
                        const diffMs = fin.getTime() - inicio.getTime();
                        const diffHours = diffMs / (1000 * 60 * 60);
                        return `${diffHours.toFixed(1)} horas`;
                      })()
                    }
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Observaciones */}
          <div className="mt-6">
            <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
              <FileText className="w-4 h-4 text-gray-400" />
              Observaciones (Opcional)
            </label>
            <textarea
              value={formData.observaciones}
              onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
              placeholder="Comentarios adicionales sobre el turno..."
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 text-white hover:bg-gray-600 rounded-xl transition-colors border border-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
