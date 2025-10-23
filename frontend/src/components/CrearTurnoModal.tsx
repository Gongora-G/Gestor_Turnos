import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Calendar, Users, Save } from 'lucide-react';
import { turnosService, canchasService } from '../services';
import { formatTo12Hour } from '../utils';
import { useToast } from '../contexts/ToastContext';

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
  usuarioId: string;
  caddieId: string;
  fecha: string;
  horaInicio: string;
  cantidadHoras: number;
  horaFin: string;
  cancha: string;
  observaciones: string;
}

export const CrearTurnoModal: React.FC<CrearTurnoModalProps> = ({
  isOpen,
  onClose,
  onTurnoCreated
}) => {
  const [loading, setLoading] = useState(false);
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [loadingCanchas, setLoadingCanchas] = useState(true);
  const { addToast } = useToast();
  
  const [form, setForm] = useState<CreateTurnoForm>({
    usuarioId: '',
    caddieId: '',
    fecha: '',
    horaInicio: '',
    cantidadHoras: 1,
    horaFin: '',
    cancha: '',
    observaciones: ''
  });

  // Cargar canchas al abrir el modal
  useEffect(() => {
    if (isOpen) {
      cargarCanchas();
      // Resetear formulario
      setForm({
        usuarioId: '',
        caddieId: '',
        fecha: '',
        horaInicio: '',
        cantidadHoras: 1,
        horaFin: '',
        cancha: '',
        observaciones: ''
      });
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
      addToast({
        type: 'error',
        title: 'Error al cargar canchas',
        message: 'No se pudieron cargar las canchas disponibles'
      });
    } finally {
      setLoadingCanchas(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
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
      addToast({
        type: 'error',
        title: 'Campos requeridos',
        message: 'Por favor completa todos los campos obligatorios (fecha, hora inicio y cancha)'
      });
      return;
    }

    setLoading(true);

    try {
      const turnoData: any = {
        fecha: `${form.fecha}T00:00:00.000Z`,
        hora_inicio: form.horaInicio,
        hora_fin: form.horaFin,
        cancha_id: form.cancha,
        observaciones: form.observaciones || undefined
      };

      // Validar UUIDs si están presentes
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      
      if (form.usuarioId && form.usuarioId.trim() && uuidRegex.test(form.usuarioId.trim())) {
        turnoData.usuario_id = form.usuarioId.trim();
      }
      
      if (form.caddieId && form.caddieId.trim() && uuidRegex.test(form.caddieId.trim())) {
        turnoData.socio_id = form.caddieId.trim();
      }
      
      await turnosService.crearTurno(turnoData);
      
      addToast({
        type: 'success',
        title: '¡Turno creado!',
        message: 'El turno se ha creado exitosamente'
      });
      
      // Cerrar modal después de 1 segundo y refrescar lista
      setTimeout(() => {
        onTurnoCreated();
        onClose();
      }, 1000);
      
    } catch (error: any) {
      console.error('Error al crear turno:', error);
      addToast({
        type: 'error',
        title: 'Error al crear turno',
        message: error.message || 'Ocurrió un error inesperado. Intenta nuevamente.'
      });
    } finally {
      setLoading(false);
    }
  };



  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Turno" size="lg">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Información del socio */}
          <div className="bg-gradient-to-r from-blue-900/10 to-blue-800/10 border border-blue-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
              <Users className="w-5 h-5 text-blue-400" />
              Información del Usuario (Opcional)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Usuario ID (opcional)
                </label>
                <input
                  type="text"
                  name="usuarioId"
                  value={form.usuarioId}
                  onChange={handleChange}
                  placeholder="UUID del usuario"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Socio/Caddie ID (opcional)
                </label>
                <input
                  type="text"
                  name="caddieId"
                  value={form.caddieId}
                  onChange={handleChange}
                  placeholder="UUID del socio/caddie"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Hora de Inicio *
                </label>
                <input
                  type="time"
                  name="horaInicio"
                  value={form.horaInicio}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              disabled={loading || loadingCanchas}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Creando...' : 'Crear Turno'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};