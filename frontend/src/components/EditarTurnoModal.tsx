import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Calendar, Users, Search } from 'lucide-react';
import { sociosService, type Socio } from '../services/sociosService';
import { formatTo12Hour } from '../utils';
import { useToast } from '../contexts/ToastContext';
import { convertTo24h, parseTimeString } from '../utils/timeFormat';
import TimeInput12h from './TimeInput12h';

// Tipos locales
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
  socio_id?: string;
  socio?: {
    id: string;
    nombre: string;
    apellido: string;
    tipo_membresia: string;
  };
  estado: 'en_progreso' | 'completado';
  observaciones?: string;
  jornada_config?: {
    id: number;
    nombre: string;
    hora_inicio: string;
    hora_fin: string;
    color: string;
  };
}

interface CanchaBackend {
  id: string;
  nombre: string;
  ubicacion?: string;
}

interface EditarTurnoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (turnoData: Partial<Turno>) => Promise<void>;
  turno: Turno | null;
  canchas: CanchaBackend[];
}

const getFechaActualLocal = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const EditarTurnoModal: React.FC<EditarTurnoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  turno,
  canchas
}) => {
  const { success: showSuccess, error: showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [socios, setSocios] = useState<Socio[]>([]);
  const [loadingSocios, setLoadingSocios] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const [formData, setFormData] = useState({
    socio_id: '',
    fecha: '',
    horaInicio: '',
    cantidadHoras: 1,
    horaFin: '',
    cancha_id: '',
    observaciones: ''
  });

  const calcularDuracionHoras = (horaInicio: string, horaFin: string): number => {
    if (!horaInicio || !horaFin) return 1;
    const [hIni, mIni] = horaInicio.split(':').map(Number);
    const [hFin, mFin] = horaFin.split(':').map(Number);
    const inicio = new Date(2000, 0, 1, hIni, mIni);
    const fin = new Date(2000, 0, 1, hFin, mFin);
    const diffMs = fin.getTime() - inicio.getTime();
    return Math.round(diffMs / (1000 * 60 * 60)) || 1;
  };

  useEffect(() => {
    if (isOpen && turno) {
      setFormData({
        socio_id: turno.socio_id || '',
        fecha: turno.fecha,
        horaInicio: turno.hora_inicio,
        cantidadHoras: calcularDuracionHoras(turno.hora_inicio, turno.hora_fin),
        horaFin: turno.hora_fin,
        cancha_id: turno.cancha_id,
        observaciones: turno.observaciones || ''
      });
      setErrorMessage('');
      cargarSocios();
    }
  }, [isOpen, turno]);

  const cargarSocios = async () => {
    try {
      setLoadingSocios(true);
      const response = await sociosService.obtenerSociosActivos();
      const sociosData = response.data || [];
      setSocios(Array.isArray(sociosData) ? sociosData : []);
    } catch (error) {
      console.error('Error al cargar socios:', error);
      setSocios([]); // Asegurar que siempre sea un array
    } finally {
      setLoadingSocios(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (errorMessage) setErrorMessage('');
    
    setFormData(prev => {
      const newForm = { 
        ...prev, 
        [name]: name === 'cantidadHoras' ? parseInt(value) || 1 : value 
      };
      
      if (name === 'horaInicio' || name === 'cantidadHoras') {
        const horaInicio = name === 'horaInicio' ? value : newForm.horaInicio;
        const cantidadHoras = name === 'cantidadHoras' ? parseInt(value) || 1 : newForm.cantidadHoras;
        
        if (horaInicio && cantidadHoras) {
          const [hours, minutes] = horaInicio.split(':').map(Number);
          const fechaInicio = new Date();
          fechaInicio.setHours(hours, minutes, 0, 0);
          
          const fechaFin = new Date(fechaInicio.getTime() + (cantidadHoras * 60 * 60 * 1000));
          const horaFin = fechaFin.toTimeString().slice(0, 5);
          
          newForm.horaFin = horaFin;
        }
      }
      
      return newForm;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fecha || !formData.horaInicio || !formData.cancha_id) {
      setErrorMessage('Por favor completa todos los campos obligatorios (fecha, hora inicio y cancha)');
      return;
    }

    setLoading(true);

    try {
      const convertirHoraA24h = (hora: string): string => {
        try {
          if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(hora)) return hora;
          const time12h = parseTimeString(hora);
          if (time12h) return convertTo24h(time12h);
          return hora;
        } catch (error) {
          console.error('Error convirtiendo hora:', error);
          return hora;
        }
      };

      const turnoData: any = {
        fecha: formData.fecha,
        hora_inicio: convertirHoraA24h(formData.horaInicio),
        hora_fin: convertirHoraA24h(formData.horaFin),
        cancha_id: formData.cancha_id,
        observaciones: formData.observaciones || undefined
      };

      // Solo incluir socio_id si hay un valor (puede ser null para quitar el socio)
      if (formData.socio_id) {
        turnoData.socio_id = formData.socio_id;
      } else {
        turnoData.socio_id = null;
      }
      
      await onSave(turnoData);
      
      showSuccess('¡Turno actualizado!', 'El turno se ha actualizado correctamente');
      
      setTimeout(() => {
        onClose();
      }, 1000);
      
    } catch (error: any) {
      console.error('Error al actualizar turno:', error);
      
      const errorMsg = error?.response?.data?.message || error?.message || 'Error al actualizar el turno. Inténtalo nuevamente.';
      setErrorMessage(errorMsg);
      showError('Error al actualizar turno', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!turno) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Editar ${turno.nombre || `Turno - ${String(turno.numero_turno_dia).padStart(3, '0')}`}`} size="lg">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Selección del socio */}
          <div className="bg-gradient-to-r from-blue-900/10 to-blue-800/10 border border-blue-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
              <Users className="w-5 h-5 text-blue-400" />
              Seleccionar Socio (Opcional)
            </h3>
            
            <div className="space-y-4">
              {/* Selector de socio */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Socio
                </label>
                <select
                  name="socio_id"
                  value={formData.socio_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sin socio asignado</option>
                  {loadingSocios ? (
                    <option disabled>Cargando socios...</option>
                  ) : (
                    Array.isArray(socios) && socios.map((socio) => (
                      <option key={socio.id} value={socio.id}>
                        {socio.nombre} {socio.apellido} - {socio.tipo_membresia?.nombre || 'Sin membresía'}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Mostrar info del socio seleccionado */}
              {formData.socio_id && (() => {
                const socioSeleccionado = socios.find(s => s.id === formData.socio_id) || turno.socio;
                return socioSeleccionado ? (
                  <div className="p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg">
                    <p className="text-sm text-blue-300 mb-2">Información del socio:</p>
                    <div className="space-y-1">
                      <p className="text-white font-medium">
                        {socioSeleccionado.nombre} {socioSeleccionado.apellido}
                      </p>
                      {socioSeleccionado.documento && (
                        <p className="text-gray-400 text-sm">Doc: {socioSeleccionado.documento}</p>
                      )}
                      {socioSeleccionado.tipo_membresia && (
                        <span
                          className="inline-block px-2 py-1 rounded text-xs font-semibold mt-1"
                          style={{ 
                            backgroundColor: socioSeleccionado.tipo_membresia.color || '#3b82f6',
                            color: '#fff'
                          }}
                        >
                          {socioSeleccionado.tipo_membresia.nombre}
                        </span>
                      )}
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          </div>

          {/* Programación */}
          <div className="bg-gradient-to-r from-green-900/10 to-green-800/10 border border-green-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
              <Calendar className="w-5 h-5 text-green-400" />
              Programación
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Fecha *</label>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  min={getFechaActualLocal()}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cancha *</label>
                <select
                  name="cancha_id"
                  value={formData.cancha_id}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Seleccionar cancha</option>
                  {canchas.map(cancha => (
                    <option key={cancha.id} value={cancha.id}>{cancha.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <TimeInput12h
                  label="Hora de Inicio *"
                  value={formData.horaInicio}
                  onChange={(value) => handleChange({ target: { name: 'horaInicio', value } } as any)}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Horas a Reservar *</label>
                <select
                  name="cantidadHoras"
                  value={formData.cantidadHoras}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {[1, 2, 3, 4, 5, 6].map(horas => (
                    <option key={horas} value={horas}>{horas} hora{horas > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Hora de Fin</label>
                <input
                  type="text"
                  name="horaFin"
                  value={formatTo12Hour(formData.horaFin)}
                  readOnly
                  placeholder="Se calcula automáticamente"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Mensaje de Error */}
          {errorMessage && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-300 mb-1">Error al actualizar turno</h3>
                  <p className="text-sm text-red-200">{errorMessage}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorMessage('')}
                  className="flex-shrink-0 text-red-400 hover:text-red-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Observaciones */}
          <div className="bg-gradient-to-r from-purple-900/10 to-purple-800/10 border border-purple-500/20 rounded-lg p-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Observaciones</label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              rows={3}
              placeholder="Añade cualquier información adicional..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-vertical min-h-[80px]"
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 justify-end pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-all disabled:opacity-50"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 font-semibold flex items-center gap-2"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
