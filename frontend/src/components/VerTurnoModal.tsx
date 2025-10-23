import React from 'react';
import { X, Calendar, Clock, MapPin, User, FileText, Award, Circle } from 'lucide-react';
import { formatTo12Hour } from '../utils/dateTime';
import { calcularEstadoAutomatico, getEstadoColor, getEstadoTexto } from '../utils/turnoStates';

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

interface VerTurnoModalProps {
  isOpen: boolean;
  onClose: () => void;
  turno: Turno | null;
}

export const VerTurnoModal: React.FC<VerTurnoModalProps> = ({
  isOpen,
  onClose,
  turno
}) => {
  if (!isOpen || !turno) return null;

  const estadoCalculado = calcularEstadoAutomatico(turno.fecha, turno.hora_inicio, turno.hora_fin);
  const estadoColor = getEstadoColor(estadoCalculado);

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

  const getCanchaDisplayName = (turno: Turno) => {
    if (turno.cancha?.nombre) {
      return turno.cancha.nombre;
    }
    return `Cancha ${turno.cancha_id?.slice(0, 8) || 'Desconocida'}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white">
              {getTurnoDisplayName(turno)}
            </h2>
            <div className="flex items-center gap-2">
              <Circle className={`w-5 h-5 ${estadoColor}`} />
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${estadoColor} bg-gray-800 border border-gray-600`}>
                {getEstadoTexto(estadoCalculado).toUpperCase()}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-xl transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Información básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                Información General
              </h3>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-4 rounded-xl border border-blue-500/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">Fecha</span>
                      <p className="font-bold text-white">
                        {new Date(turno.fecha).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 p-4 rounded-xl border border-emerald-500/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500 rounded-lg">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">Horario</span>
                      <p className="font-bold text-white">
                        {formatTo12Hour(turno.hora_inicio)} - {formatTo12Hour(turno.hora_fin)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 rounded-xl border border-purple-500/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">Cancha</span>
                      <p className="font-bold text-white">{getCanchaDisplayName(turno)}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Información de participantes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                Participantes
              </h3>
              
              <div className="space-y-4">
                {turno.usuario_id && (
                  <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-4 rounded-xl border border-blue-500/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="text-sm text-gray-400">Usuario</span>
                        <p className="font-bold text-white">Usuario asignado</p>
                        <p className="text-xs text-gray-500 font-mono">ID: {turno.usuario_id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </div>
                )}

                {turno.socio_id && (
                  <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-4 rounded-xl border border-yellow-500/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-500 rounded-lg">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="text-sm text-gray-400">Socio</span>
                        <p className="font-bold text-white">Socio del club</p>
                        <p className="text-xs text-gray-500 font-mono">ID: {turno.socio_id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </div>
                )}

                {!turno.usuario_id && !turno.socio_id && (
                  <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 text-center">
                    <p className="text-gray-400 italic">Sin participantes asignados</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Observaciones */}
          {turno.observaciones && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="bg-gradient-to-r from-gray-500/10 to-slate-500/10 p-4 rounded-xl border border-gray-600">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-600 rounded-lg">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm text-gray-400">Observaciones</span>
                    <p className="mt-2 text-white bg-gray-800 p-3 rounded-lg border border-gray-700">
                      {turno.observaciones}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Información técnica */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className="text-sm font-semibold text-white mb-3">
              Información Técnica
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 bg-gray-800 p-4 rounded-xl border border-gray-700">
              <div>
                <span className="font-medium text-gray-300">ID Turno:</span>
                <p className="font-mono text-blue-400">{turno.id}</p>
              </div>
              <div>
                <span className="font-medium text-gray-300">ID Cancha:</span>
                <p className="font-mono text-purple-400">{turno.cancha_id}</p>
              </div>
              <div>
                <span className="font-medium text-gray-300">Creado:</span>
                <p className="text-gray-200">{new Date(turno.created_at).toLocaleString('es-ES')}</p>
              </div>
              <div>
                <span className="font-medium text-gray-300">Actualizado:</span>
                <p className="text-gray-200">{new Date(turno.updated_at).toLocaleString('es-ES')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-700 bg-gray-800">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 text-white hover:bg-gray-600 rounded-xl transition-colors font-semibold border border-gray-600"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};