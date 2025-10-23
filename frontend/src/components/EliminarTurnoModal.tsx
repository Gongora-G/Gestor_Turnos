import React, { useState } from 'react';
import { AlertTriangle, X, User, Calendar, Clock, MapPin, FileText, Trash2, Info } from 'lucide-react';
import { formatTo12Hour } from '../utils/dateTime';
import { calcularEstadoAutomatico } from '../utils/turnoStates';

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
  precio: number;
  observaciones?: string;
  created_at: string;
  updated_at: string;
}

interface EliminarTurnoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (turnoId: string) => Promise<void>;
  turno: Turno | null;
}

export const EliminarTurnoModal: React.FC<EliminarTurnoModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  turno
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    if (!turno?.id) return;

    setLoading(true);
    setError('');
    
    try {
      await onConfirm(turno.id);
      onClose();
    } catch (error) {
      console.error('Error al eliminar turno:', error);
      setError('Error al eliminar el turno. Inténtelo nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !turno) return null;

  const getTurnoDisplayName = (turno: Turno) => {
    if (!turno.id) return 'Turno Sin ID';
    const numeroTurno = turno.id.slice(-3).toUpperCase();
    return `Turno #${numeroTurno}`;
  };

  const getCanchaDisplayName = (turno: Turno) => {
    if (turno.cancha?.nombre) {
      return turno.cancha.nombre;
    }
    return `Cancha ${turno.cancha_id?.slice(0, 8) || 'Desconocida'}`;
  };

  const estado = calcularEstadoAutomatico(turno.fecha, turno.hora_inicio, turno.hora_fin);
  const canchaDisplay = getCanchaDisplayName(turno);

  // Permitir eliminar siempre, pero con diferentes advertencias
  const puedeEliminar = true; // Siempre permitir eliminar
  
  // Diferentes tipos de advertencia según el estado
  const getTipoAdvertencia = () => {
    if (estado === 'en_progreso') {
      return {
        tipo: 'warning',
        titulo: 'Turno en progreso',
        mensaje: 'Este turno está actualmente en progreso. Eliminarlo podría afectar la operación actual.',
        icono: 'warning'
      };
    } else if (estado === 'completado') {
      return {
        tipo: 'info',
        titulo: 'Turno completado',
        mensaje: 'Este turno ya terminó. La eliminación solo afectará los registros históricos.',
        icono: 'info'
      };
    } else {
      return {
        tipo: 'normal',
        titulo: 'Eliminar turno',
        mensaje: '¿Está seguro que desea eliminar este turno? Esta acción no se puede deshacer.',
        icono: 'delete'
      };
    }
  };

  const advertencia = getTipoAdvertencia();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full border border-red-500/30">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            Eliminar Turno
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-xl transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 text-red-400 rounded-xl">
              {error}
            </div>
          )}

          <div className="mb-6">
            <p className="text-gray-300 mb-4">
              {advertencia.mensaje}
            </p>

            {/* Información del turno */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">
                  {getTurnoDisplayName(turno)}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  estado === 'en_progreso' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                  estado === 'completado' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                  'bg-gray-500/20 text-gray-400 border-gray-500/30'
                }`}>
                  {estado === 'en_progreso' ? 'EN PROGRESO' : 'COMPLETADO'}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-center gap-3 p-2 bg-gray-700 rounded-lg">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-200">{new Date(turno.fecha).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>

                <div className="flex items-center gap-3 p-2 bg-gray-700 rounded-lg">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span className="text-gray-200">
                    {formatTo12Hour(turno.hora_inicio)} - {formatTo12Hour(turno.hora_fin)}
                  </span>
                </div>

                <div className="flex items-center gap-3 p-2 bg-gray-700 rounded-lg">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-200">{canchaDisplay}</span>
                </div>

                {turno.precio && (
                  <div className="flex items-center gap-3 p-2 bg-gray-700 rounded-lg">
                    <span className="w-4 h-4 text-center text-emerald-400 font-bold">$</span>
                    <span className="text-gray-200 font-semibold">${turno.precio.toLocaleString()} COP</span>
                  </div>
                )}
              </div>

              {turno.observaciones && (
                <div className="pt-3 border-t border-gray-600">
                  <p className="text-xs text-gray-400 font-medium mb-1">Observaciones:</p>
                  <p className="text-sm text-gray-300 bg-gray-700 p-2 rounded-lg">{turno.observaciones}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-700 bg-gray-800 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 text-white hover:bg-gray-600 rounded-xl transition-colors border border-gray-600 font-semibold"
          >
            Cancelar
          </button>
          
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
          >
            <Trash2 className="w-4 h-4" />
            {loading ? 'Eliminando...' : 'Eliminar Turno'}
          </button>
        </div>
      </div>
    </div>
  );
};