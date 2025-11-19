import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, FileText, Users } from 'lucide-react';
import { formatTo12Hour } from '../utils/dateTime';
import { useToast } from '../contexts/ToastContext';
import { apiService } from '../services/api';
import type { PersonalUnificado } from '../services/personalUnificadoService';
import type { CanchaBackend } from '../services/canchasService';

// Tipos locales para evitar problemas de importación
interface Turno {
  id: string;
  nombre?: string;
  numero_turno_dia?: number;
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
  personal_asignado?: string[];
  estado: 'en_progreso' | 'completado';
  observaciones?: string;
  created_at: string;
  updated_at: string;
}

// CanchaBackend se importa desde services

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
    observaciones: '',
    personal_asignado: [] as string[]
  });
  
  const [personal, setPersonal] = useState<PersonalUnificado[]>([]);
  const [loadingPersonal, setLoadingPersonal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar personal disponible
  const cargarPersonal = async () => {
    try {
      setLoadingPersonal(true);
      const personalData = await apiService.get<PersonalUnificado[]>('/personal/activos');
      console.log('✅ Personal cargado en modal edición:', personalData);
      setPersonal(personalData);
    } catch (error) {
      console.error('Error al cargar personal:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'No se pudo cargar el personal disponible',
        duration: 3000
      });
    } finally {
      setLoadingPersonal(false);
    }
  };

  // Cargar datos del turno cuando se abre el modal
  useEffect(() => {
    if (isOpen && turno) {
      setFormData({
        fecha: turno.fecha,
        hora_inicio: turno.hora_inicio,
        hora_fin: turno.hora_fin,
        cancha_id: turno.cancha_id,
        observaciones: turno.observaciones || '',
        personal_asignado: turno.personal_asignado || []
      });
      setErrors({});
      cargarPersonal();
    }
  }, [isOpen, turno]);
  
  // Función para alternar selección de personal
  const togglePersonal = (personalId: string) => {
    setFormData(prev => ({
      ...prev,
      personal_asignado: prev.personal_asignado.includes(personalId)
        ? prev.personal_asignado.filter(id => id !== personalId)
        : [...prev.personal_asignado, personalId]
    }));
  };

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
        observaciones: formData.observaciones,
        personal_asignado: formData.personal_asignado
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

        {/* Form - Compacto */}
        <form onSubmit={handleSubmit} className="p-5">
          {errors.general && (
            <div className="mb-3 p-2 bg-red-900/20 border border-red-500/50 text-red-400 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mb-4">
            
            {/* Fecha */}
            <div className="col-span-2">
              <label className="flex items-center gap-1.5 text-xs font-medium text-white mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                Fecha
              </label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
                className={`w-full px-2.5 py-1.5 text-sm bg-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white ${errors.fecha ? 'border-red-500' : 'border-gray-600'}`}
              />
              {errors.fecha && <p className="text-red-400 text-xs mt-1">{errors.fecha}</p>}
            </div>

            {/* Hora de inicio */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-white mb-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Hora Inicio
              </label>
              <input
                type="time"
                value={formData.hora_inicio}
                onChange={(e) => handleHoraInicioChange(e.target.value)}
                className={`w-full px-2.5 py-1.5 text-sm bg-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white ${errors.hora_inicio ? 'border-red-500' : 'border-gray-600'}`}
              />
              {errors.hora_inicio && <p className="text-red-400 text-xs mt-1">{errors.hora_inicio}</p>}
              {formData.hora_inicio && (
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {formatTo12Hour(formData.hora_inicio)}
                </p>
              )}
            </div>

            {/* Hora de fin */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-white mb-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Hora Fin
              </label>
              <input
                type="time"
                value={formData.hora_fin}
                onChange={(e) => setFormData(prev => ({ ...prev, hora_fin: e.target.value }))}
                className={`w-full px-2.5 py-1.5 text-sm bg-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white ${errors.hora_fin ? 'border-red-500' : 'border-gray-600'}`}
              />
              {errors.hora_fin && <p className="text-red-400 text-xs mt-1">{errors.hora_fin}</p>}
              {formData.hora_fin && (
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {formatTo12Hour(formData.hora_fin)}
                </p>
              )}
            </div>

            {/* Cancha */}
            <div className="col-span-2">
              <label className="flex items-center gap-1.5 text-xs font-medium text-white mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                Cancha
              </label>
              <select
                value={formData.cancha_id}
                onChange={(e) => setFormData(prev => ({ ...prev, cancha_id: e.target.value }))}
                className={`w-full px-2.5 py-1.5 text-sm bg-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white ${errors.cancha_id ? 'border-red-500' : 'border-gray-600'}`}
              >
                <option value="" className="bg-gray-800 text-gray-400">Seleccionar Cancha</option>
                {canchas.map((cancha) => (
                  <option key={cancha.id} value={cancha.id} className="bg-gray-800 text-white">
                    {cancha.nombre}
                  </option>
                ))}
              </select>
              {errors.cancha_id && <p className="text-red-400 text-xs mt-1">{errors.cancha_id}</p>}
            </div>

            {/* Duración calculada */}
            {formData.hora_inicio && formData.hora_fin && (
              <div className="col-span-2 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-xs text-blue-300">
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

          {/* Asignar Personal - Compacto */}
          <div className="mb-4">
            <label className="flex items-center gap-1.5 text-xs font-medium text-white mb-2">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              Asignar Personal
            </label>
            
            {loadingPersonal ? (
              <div className="flex items-center justify-center p-4 bg-gray-800 rounded-lg border border-gray-700">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
                <span className="ml-2 text-gray-400 text-sm">Cargando...</span>
              </div>
            ) : personal.length === 0 ? (
              <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 text-center">
                <p className="text-gray-400 text-sm">Sin personal disponible</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto p-0.5">
                {personal.map((persona) => {
                  const isSelected = formData.personal_asignado.includes(persona.id);
                  return (
                    <div
                      key={persona.id}
                      onClick={() => togglePersonal(persona.id)}
                      className={`p-2 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-purple-500/20 border-purple-500'
                          : 'bg-gray-800 border-gray-700 hover:border-purple-500/50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white truncate">
                            {persona.nombre} {persona.apellido}
                          </p>
                          <p className="text-[10px] text-purple-400 truncate">
                            {persona.tipoPersonal.nombre}
                          </p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? 'bg-purple-500 border-purple-500'
                            : 'border-gray-600'
                        }`}>
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {formData.personal_asignado.length > 0 && (
              <p className="mt-1.5 text-xs text-purple-400">
                {formData.personal_asignado.length} seleccionado(s)
              </p>
            )}
          </div>

          {/* Observaciones - Compacto */}
          <div className="mb-4">
            <label className="flex items-center gap-1.5 text-xs font-medium text-white mb-1.5">
              <FileText className="w-3.5 h-3.5 text-gray-400" />
              Observaciones
            </label>
            <textarea
              value={formData.observaciones}
              onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
              rows={2}
              className="w-full px-2.5 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
              placeholder="Comentarios adicionales..."
            />
          </div>

          {/* Footer - Compacto */}
          <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-sm bg-gray-700 text-white hover:bg-gray-600 rounded-lg transition-colors border border-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
