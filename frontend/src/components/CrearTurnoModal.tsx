import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Calendar, Users, Save, Search } from 'lucide-react';
import { turnosService, canchasService } from '../services';
import { sociosService, type Socio } from '../services/sociosService';
import { formatTo12Hour } from '../utils';
import { useToast } from '../contexts/ToastContext';
import { convertTo24h, parseTimeString } from '../utils/timeFormat';
import TimeInput12h from './TimeInput12h';

interface CrearTurnoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTurnoCreated: () => void; // Callback para refrescar la lista
}

interface Cancha {
  id: string;
  nombre: string;
  ubicacion?: string;
}

interface CreateTurnoForm {
  socioId: string;
  fecha: string;
  horaInicio: string;
  cantidadHoras: number;
  horaFin: string;
  cancha: string;
  observaciones: string;
}

// Función para obtener la fecha actual en formato local (YYYY-MM-DD)
const getFechaActualLocal = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const CrearTurnoModal: React.FC<CrearTurnoModalProps> = ({
  isOpen,
  onClose,
  onTurnoCreated
}) => {
  const [loading, setLoading] = useState(false);
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [loadingCanchas, setLoadingCanchas] = useState(true);
  const [socios, setSocios] = useState<Socio[]>([]);
  const [loadingSocios, setLoadingSocios] = useState(true);
  const [busquedaSocio, setBusquedaSocio] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { success: showSuccess, error: showError } = useToast();
  
  const [form, setForm] = useState<CreateTurnoForm>({
    socioId: '',
    fecha: getFechaActualLocal(), // Inicializar con fecha actual local
    horaInicio: '',
    cantidadHoras: 1,
    horaFin: '',
    cancha: '',
    observaciones: ''
  });

  // Cargar datos al abrir el modal
  useEffect(() => {
    if (isOpen) {
      cargarCanchas();
      cargarSocios();
      // Resetear formulario y error
      setForm({
        socioId: '',
        fecha: getFechaActualLocal(), // Fecha actual por defecto en formato local
        horaInicio: '',
        cantidadHoras: 1,
        horaFin: '',
        cancha: '',
        observaciones: ''
      });
      setBusquedaSocio('');
      setErrorMessage(''); // Limpiar mensaje de error
    }
  }, [isOpen]);

  const cargarCanchas = async () => {
    try {
      setLoadingCanchas(true);
      const canchasData = await canchasService.obtenerCanchas();
      setCanchas(canchasData);
      
      if (canchasData.length > 0) {
        setForm(prev => ({ ...prev, cancha: canchasData[0].id }));
      }
    } catch (error) {
      console.error('Error al cargar canchas:', error);
      showError('Error al cargar canchas', 'No se pudieron cargar las canchas disponibles');
    } finally {
      setLoadingCanchas(false);
    }
  };

  const cargarSocios = async () => {
    try {
      setLoadingSocios(true);
      const response = await sociosService.obtenerSociosActivos();
      setSocios(response.data || []);
    } catch (error) {
      console.error('Error al cargar socios:', error);
      showError('Error al cargar socios', 'No se pudieron cargar los socios disponibles');
    } finally {
      setLoadingSocios(false);
    }
  };

  const buscarSocios = async (termino: string) => {
    if (!termino.trim()) {
      cargarSocios();
      return;
    }

    try {
      setLoadingSocios(true);
      const response = await sociosService.buscarSocio(termino);
      setSocios(response.data || []);
    } catch (error) {
      console.error('Error al buscar socios:', error);
      setSocios([]);
    } finally {
      setLoadingSocios(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (busquedaSocio) {
        buscarSocios(busquedaSocio);
      } else {
        cargarSocios();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [busquedaSocio]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Limpiar mensaje de error al modificar cualquier campo
    if (errorMessage) {
      setErrorMessage('');
    }
    
    setForm(prev => {
      const newForm = { 
        ...prev, 
        [name]: name === 'cantidadHoras' ? parseInt(value) || 1 : value 
      };
      
      // Calcular hora de fin automáticamente
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
    
    if (!form.fecha || !form.horaInicio || !form.cancha) {
      showError('Campos requeridos', 'Por favor completa todos los campos obligatorios (fecha, hora inicio y cancha)');
      return;
    }

    // Validar que la fecha no sea anterior al día actual
    const fechaActual = getFechaActualLocal();
    if (form.fecha < fechaActual) {
      showError('Fecha inválida', 'No puedes crear un turno con una fecha anterior al día actual. Los turnos solo se pueden crear para hoy o fechas futuras.');
      return;
    }

    setLoading(true);

    try {
      // Función auxiliar para convertir hora a formato 24h
      const convertirHoraA24h = (hora: string): string => {
        try {
          // Si ya está en formato 24h (HH:MM), devolverla tal como está
          if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(hora)) {
            return hora;
          }

          // Si está en formato 12h, parsear y convertir
          const time12h = parseTimeString(hora);
          if (time12h) {
            return convertTo24h(time12h);
          }

          // Fallback: retornar la hora original
          return hora;
        } catch (error) {
          console.error('Error convirtiendo hora a 24h:', error);
          return hora;
        }
      };

      const turnoData: any = {
        fecha: form.fecha, // Enviar fecha directamente como string YYYY-MM-DD
        hora_inicio: convertirHoraA24h(form.horaInicio),
        hora_fin: convertirHoraA24h(form.horaFin),
        cancha_id: form.cancha,
        observaciones: form.observaciones || undefined
      };

      console.log('📅 Datos a enviar al backend:', turnoData);
      console.log('📅 Fecha original del formulario:', form.fecha);
      console.log('📅 Fecha actual del sistema:', getFechaActualLocal());

      // Agregar socio si está seleccionado
      if (form.socioId) {
        turnoData.socio_id = form.socioId;
      }
      
      await turnosService.crearTurno(turnoData);
      
      const socioSeleccionado = socios.find(s => s.id === form.socioId);
      const nombreSocio = socioSeleccionado ? `${socioSeleccionado.nombre} ${socioSeleccionado.apellido}` : 'Sin socio asignado';
      
      showSuccess('¡Turno creado!', `Turno creado exitosamente para ${nombreSocio}`);
      
      // Cerrar modal después de 1 segundo y refrescar lista
      setTimeout(() => {
        onTurnoCreated();
        onClose();
      }, 1000);
      
    } catch (error: any) {
      console.error('Error al crear turno:', error);
      
      // Extraer mensaje de error específico del backend
      const errorMsg = error?.response?.data?.message || error?.message || 'Ocurrió un error inesperado. Intenta nuevamente.';
      
      // Mostrar error dentro del modal
      setErrorMessage(errorMsg);
      
      // También mostrar toast (ahora con z-index correcto)
      showError('Error al crear turno', errorMsg);
    } finally {
      setLoading(false);
    }
  };



  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Turno" size="lg">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Selección del socio */}
          <div className="bg-gradient-to-r from-blue-900/10 to-blue-800/10 border border-blue-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
              <Users className="w-5 h-5 text-blue-400" />
              Seleccionar Socio (Opcional)
            </h3>
            
            <div className="space-y-4">
              {/* Buscador de socios */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar socio por nombre, apellido o documento..."
                  value={busquedaSocio}
                  onChange={(e) => setBusquedaSocio(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Selector de socio */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Socio
                </label>
                <select
                  name="socioId"
                  value={form.socioId}
                  onChange={handleChange}
                  disabled={loadingSocios}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                >
                  <option value="">
                    {loadingSocios ? 'Cargando socios...' : 'Sin socio asignado'}
                  </option>
                  {socios.map(socio => (
                    <option key={socio.id} value={socio.id}>
                      {socio.nombre} {socio.apellido} - {socio.documento}
                      {socio.tipo_membresia?.nombre && ` (${socio.tipo_membresia.nombre})`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Información del socio seleccionado */}
              {form.socioId && (
                <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4">
                  {(() => {
                    const socioSeleccionado = socios.find(s => s.id === form.socioId);
                    if (!socioSeleccionado) return null;
                    
                    return (
                      <div className="text-sm text-gray-300 space-y-1">
                        <p><span className="font-medium">Nombre:</span> {socioSeleccionado.nombre} {socioSeleccionado.apellido}</p>
                        <p><span className="font-medium">Email:</span> {socioSeleccionado.email}</p>
                        <p><span className="font-medium">Documento:</span> {socioSeleccionado.documento}</p>
                        {socioSeleccionado.telefono && (
                          <p><span className="font-medium">Teléfono:</span> {socioSeleccionado.telefono}</p>
                        )}
                        {socioSeleccionado.tipo_membresia && (
                          <p>
                            <span className="font-medium">Membresía:</span> 
                            <span 
                              className="inline-block ml-2 px-2 py-1 rounded text-xs text-white"
                              style={{ backgroundColor: socioSeleccionado.tipo_membresia.color }}
                            >
                              {socioSeleccionado.tipo_membresia.nombre}
                            </span>
                          </p>
                        )}
                        <p>
                          <span className="font-medium">Estado:</span> 
                          <span className={`ml-2 px-2 py-1 rounded text-xs ${
                            socioSeleccionado.estado === 'activo' 
                              ? 'bg-green-600 text-white' 
                              : socioSeleccionado.estado === 'suspendido'
                              ? 'bg-yellow-600 text-white'
                              : 'bg-red-600 text-white'
                          }`}>
                            {socioSeleccionado.estado}
                          </span>
                        </p>
                      </div>
                    );
                  })()}
                </div>
              )}
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fecha *
                </label>
                <input
                  type="date"
                  name="fecha"
                  value={form.fecha}
                  min={getFechaActualLocal()}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cancha *
                </label>
                <select
                  name="cancha"
                  value={form.cancha}
                  onChange={handleChange}
                  required
                  disabled={loadingCanchas}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                >
                  <option value="" disabled>
                    {loadingCanchas ? 'Cargando canchas...' : 'Seleccionar cancha'}
                  </option>
                  {canchas.map(cancha => (
                    <option key={cancha.id} value={cancha.id}>
                      {cancha.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <TimeInput12h
                  label="Hora de Inicio *"
                  value={form.horaInicio}
                  onChange={(value) => handleChange({ target: { name: 'horaInicio', value } } as any)}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Horas a Reservar *
                </label>
                <select
                  name="cantidadHoras"
                  value={form.cantidadHoras}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6].map(horas => (
                    <option key={horas} value={horas}>
                      {horas} hora{horas > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Hora de Fin
                </label>
                <input
                  type="text"
                  name="horaFin"
                  value={formatTo12Hour(form.horaFin)}
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
                  <h3 className="text-sm font-semibold text-red-300 mb-1">Error al crear turno</h3>
                  <p className="text-sm text-red-200">{errorMessage}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorMessage('')}
                  className="flex-shrink-0 text-red-400 hover:text-red-300 transition-colors"
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
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Observaciones
            </label>
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              rows={3}
              placeholder="Añade cualquier información adicional..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical min-h-[80px]"
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 justify-end pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 hover:border-gray-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={loading || loadingCanchas || loadingSocios}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Creando...' : loadingCanchas || loadingSocios ? 'Cargando...' : 'Crear Turno'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};