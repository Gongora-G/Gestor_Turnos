import React from 'react';
import { X, Calendar, Clock, MapPin, User, FileText, Award, Circle, Users } from 'lucide-react';
import { formatTo12Hour } from '../utils/dateTime';
import { calcularEstadoAutomatico, getEstadoColor, getEstadoTexto } from '../utils/turnoStates';

// Tipos locales para evitar problemas de importación
interface PersonalInfo {
  id: string;
  nombre: string;
  apellido: string;
  tipoPersonal: {
    nombre: string;
    color?: string;
  };
}

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

interface VerTurnoModalProps {
  isOpen: boolean;
  onClose: () => void;
  turno: Turno | null;
  personalData?: PersonalInfo[];
}

export const VerTurnoModal: React.FC<VerTurnoModalProps> = ({
  isOpen,
  onClose,
  turno,
  personalData = []
}) => {
  if (!isOpen || !turno) return null;

  const estadoCalculado = calcularEstadoAutomatico(turno.fecha, turno.hora_inicio, turno.hora_fin);
  const estadoColor = getEstadoColor(estadoCalculado);
  
  // Obtener personal asignado con sus datos completos
  const personalAsignado = turno.personal_asignado
    ?.map(id => personalData.find(p => p.id === id))
    .filter((p): p is PersonalInfo => p !== undefined) || [];

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

        {/* Content - Grid Compacto */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-3 mb-4">
            
            {/* Fecha */}
            <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-400">Fecha</span>
              </div>
              <p className="text-sm font-semibold text-white">
                {new Date(turno.fecha).toLocaleDateString('es-ES', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short'
                })}
              </p>
            </div>

            {/* Horario */}
            <div className="bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-gray-400">Horario</span>
              </div>
              <p className="text-sm font-semibold text-white">
                {formatTo12Hour(turno.hora_inicio)} - {formatTo12Hour(turno.hora_fin)}
              </p>
            </div>

            {/* Cancha */}
            <div className="bg-purple-500/10 p-3 rounded-lg border border-purple-500/20">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-gray-400">Cancha</span>
              </div>
              <p className="text-sm font-semibold text-white">{getCanchaDisplayName(turno)}</p>
            </div>

            {/* Usuario/Socio */}
            <div className={`p-3 rounded-lg border ${
              turno.socio_id 
                ? 'bg-yellow-500/10 border-yellow-500/20' 
                : turno.usuario_id 
                  ? 'bg-blue-500/10 border-blue-500/20'
                  : 'bg-gray-500/10 border-gray-500/20'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                {turno.socio_id ? (
                  <Award className="w-4 h-4 text-yellow-400" />
                ) : turno.usuario_id ? (
                  <User className="w-4 h-4 text-blue-400" />
                ) : (
                  <User className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-xs text-gray-400">
                  {turno.socio_id ? 'Socio' : turno.usuario_id ? 'Usuario' : 'Sin asignar'}
                </span>
              </div>
              <p className="text-sm font-semibold text-white truncate">
                {turno.socio?.nombre || turno.usuario?.nombre || 'Disponible'}
              </p>
            </div>

          </div>

          {/* Personal Asignado - Compacto */}
          {personalAsignado.length > 0 && (
            <div className="bg-purple-500/10 p-3 rounded-lg border border-purple-500/20 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-semibold text-purple-400 uppercase">
                  Personal ({personalAsignado.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {personalAsignado.map((persona) => (
                  <div 
                    key={persona.id}
                    className="flex items-center gap-2 bg-purple-500/15 border border-purple-500/25 rounded-md px-2 py-1.5"
                  >
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ 
                        background: persona.tipoPersonal.color || '#8b5cf6',
                        boxShadow: `0 0 8px ${persona.tipoPersonal.color || '#8b5cf6'}60`
                      }}
                    >
                      {persona.nombre[0]}{persona.apellido[0]}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white leading-none">
                        {persona.nombre} {persona.apellido}
                      </p>
                      <p className="text-[10px] text-purple-400 leading-none mt-0.5">
                        {persona.tipoPersonal.nombre}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Observaciones - Compacto */}
          {turno.observaciones && (
            <div className="bg-gray-500/10 p-3 rounded-lg border border-gray-600 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-400">Observaciones</span>
              </div>
              <p className="text-sm text-white italic">
                {turno.observaciones}
              </p>
            </div>
          )}

          {/* Información técnica - Compacto */}
          <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <div>
                <span className="text-gray-500">ID Turno:</span>
                <p className="font-mono text-blue-400 text-[10px]">{turno.id.slice(0, 16)}...</p>
              </div>
              <div>
                <span className="text-gray-500">ID Cancha:</span>
                <p className="font-mono text-purple-400 text-[10px]">{turno.cancha_id.slice(0, 16)}...</p>
              </div>
              <div>
                <span className="text-gray-500">Creado:</span>
                <p className="text-gray-300 text-[10px]">{new Date(turno.created_at).toLocaleString('es-ES', { 
                  day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
                })}</p>
              </div>
              <div>
                <span className="text-gray-500">Actualizado:</span>
                <p className="text-gray-300 text-[10px]">{new Date(turno.updated_at).toLocaleString('es-ES', { 
                  day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
                })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Compacto */}
        <div className="flex justify-end gap-2 p-4 border-t border-gray-700 bg-gray-800">
          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-gray-700 text-white hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium border border-gray-600"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};