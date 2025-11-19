import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GlobalNavigation, GlobalFooter } from '../components';
import { Calendar, Users, Save, ArrowLeft, AlertCircle } from 'lucide-react';
import { turnosService, canchasService } from '../services';
import TimeInput12h from '../components/TimeInput12h';

interface CreateTurnoForm {
  usuarioId: string;
  socioId: string;
  fecha: string;
  horaInicio: string;
  cantidadHoras: number;
  horaFin: string;
  cancha: string; // Cambiar a string para UUIDs
  observaciones: string;
  caddieId?: string;
  boleadorId?: string;
}

interface Cancha {
  id: string;
  nombre: string;
  ubicacion?: string;
}

export const CrearTurnoPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [loadingCanchas, setLoadingCanchas] = useState(true);

  const [form, setForm] = useState<CreateTurnoForm>({
    usuarioId: '',
    socioId: '',
    fecha: new Date().toISOString().split('T')[0], // Inicializar con fecha actual
    horaInicio: '',
    cantidadHoras: 1,
    horaFin: '',
    cancha: '',
    observaciones: '',
    caddieId: undefined,
    boleadorId: undefined
  });

  // Estilos para los selects profesionales
  const selectStyles = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '10px',
    border: '2px solid #3b82f6',
    backgroundColor: '#111827',
    color: '#f9fafb',
    fontSize: '14px',
    fontWeight: '500',
    outline: 'none',
    transition: 'all 0.3s ease',
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23f9fafb' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 12px center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '16px',
    paddingRight: '40px',
    boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.3)'
  };

  // Cargar canchas al montar el componente
  useEffect(() => {
    const cargarCanchas = async () => {
      try {
        setLoadingCanchas(true);
        const canchasData = await canchasService.obtenerCanchas();
        setCanchas(canchasData);
        
        // Si hay canchas, seleccionar la primera por defecto
        if (canchasData.length > 0) {
          setForm(prev => ({ ...prev, cancha: canchasData[0].id }));
        }
      } catch (error) {
        console.error('Error al cargar canchas:', error);
        setError('Error al cargar las canchas disponibles');
      } finally {
        setLoadingCanchas(false);
      }
    };

    cargarCanchas();
  }, []);

  const inputStyles = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '10px',
    border: '2px solid #3b82f6',
    background: '#111827',
    fontSize: '14px',
    fontWeight: '500',
    color: '#f9fafb',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.3)'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!form.fecha || !form.horaInicio || !form.cancha) {
      setError('Por favor completa todos los campos obligatorios (fecha, hora inicio y cancha)');
      return;
    }

    setLoading(true);

    try {
      // Mapear los datos del formulario al formato esperado por el backend
      const turnoData: any = {
        fecha: `${form.fecha}T00:00:00.000Z`, // Formato ISO completo
        hora_inicio: form.horaInicio,
        hora_fin: form.horaFin,
        cancha_id: form.cancha,
        precio: "50000.00", // Formato decimal string
        observaciones: form.observaciones || undefined
      };

      // Solo agregar usuario_id y socio_id si tienen valores válidos (UUID format)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      
      if (form.usuarioId && form.usuarioId.trim() && uuidRegex.test(form.usuarioId.trim())) {
        turnoData.usuario_id = form.usuarioId.trim();
      }
      
      if (form.socioId && form.socioId.trim() && uuidRegex.test(form.socioId.trim())) {
        turnoData.socio_id = form.socioId.trim();
      }

      // Agregar caddie y boleador si están seleccionados
      if (form.caddieId && uuidRegex.test(form.caddieId)) {
        turnoData.caddie_id = form.caddieId;
      }

      if (form.boleadorId && uuidRegex.test(form.boleadorId)) {
        turnoData.boleador_id = form.boleadorId;
      }
      
      console.log('📤 Enviando datos al backend:', turnoData);
      
      // Llamar al servicio real
      const nuevoTurno = await turnosService.crearTurno(turnoData);
      
      console.log('✅ Turno creado exitosamente:', nuevoTurno);
      
      // Redirigir a la lista de turnos con mensaje de éxito
      navigate('/turnos?success=created');
    } catch (err) {
      console.error('❌ Error al crear turno:', err);
      setError('Error al crear el turno. Inténtalo nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setForm(prev => {
      const newForm = { 
        ...prev, 
        [name]: name === 'cantidadHoras' ? parseInt(value) || 1 : value 
      };
      
      // Calcular hora de fin automáticamente cuando cambie hora de inicio o cantidad de horas
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



  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f0f23',
      color: '#fff',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <GlobalNavigation />
      
      {/* Main Content */}
      <div style={{
        background: '#1e1e2e',
        borderBottom: '1px solid #22223b',
        padding: '24px 32px'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link
              to="/turnos"
              style={{
                padding: '8px',
                borderRadius: '8px',
                background: '#374151',
                color: '#9ca3af',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#4b5563';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#374151';
                e.currentTarget.style.color = '#9ca3af';
              }}
            >
              <ArrowLeft style={{ width: '20px', height: '20px' }} />
            </Link>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
                Crear Nuevo Turno
              </h1>
              <p style={{ color: '#9ca3af', fontSize: '16px' }}>
                Programa un nuevo turno en el sistema
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
        {error && (
          <div style={{
            background: '#991b1b',
            border: '1px solid #dc2626',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <AlertCircle style={{ width: '20px', height: '20px', color: '#fca5a5' }} />
            <span style={{ color: '#fca5a5', fontSize: '14px' }}>{error}</span>
          </div>
        )}

        <div style={{
          background: '#1e1e2e',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid #22223b'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '40px' }}>
              {/* Información del socio */}
              <div>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Users style={{ width: '20px', height: '20px', color: '#2563eb' }} />
                  Información del Socio
                </h3>
                
                <div style={{ display: 'grid', gap: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ 
                        display: 'block', 
                        fontSize: '14px', 
                        fontWeight: '500', 
                        marginBottom: '8px',
                        color: '#d1d5db'
                      }}>
                        Usuario ID (opcional)
                      </label>
                      <input
                        type="text"
                        name="usuarioId"
                        value={form.usuarioId}
                        onChange={handleChange}
                        placeholder="Ingresa UUID del usuario (opcional)"
                        style={inputStyles}
                        onFocus={(e) => {
                          e.target.style.background = 'linear-gradient(#111827, #111827) padding-box, linear-gradient(135deg, #8b5cf6, #3b82f6) border-box';
                          e.target.style.transform = 'scale(1.02)';
                        }}
                        onBlur={(e) => {
                          e.target.style.background = 'linear-gradient(#111827, #111827) padding-box, linear-gradient(135deg, #3b82f6, #8b5cf6) border-box';
                          e.target.style.transform = 'scale(1)';
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ 
                        display: 'block', 
                        fontSize: '14px', 
                        fontWeight: '500', 
                        marginBottom: '8px',
                        color: '#d1d5db'
                      }}>
                        Socio ID (opcional)
                      </label>
                      <input
                        type="text"
                        name="socioId"
                        value={form.socioId}
                        onChange={handleChange}
                        placeholder="Ingresa UUID del socio (opcional)"
                        style={inputStyles}
                        onFocus={(e) => {
                          e.target.style.background = 'linear-gradient(#111827, #111827) padding-box, linear-gradient(135deg, #8b5cf6, #3b82f6) border-box';
                          e.target.style.transform = 'scale(1.02)';
                        }}
                        onBlur={(e) => {
                          e.target.style.background = 'linear-gradient(#111827, #111827) padding-box, linear-gradient(135deg, #3b82f6, #8b5cf6) border-box';
                          e.target.style.transform = 'scale(1)';
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal de apoyo - Versión simplificada */}
              <div>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Users style={{ width: '20px', height: '20px', color: '#10b981' }} />
                  Personal de Apoyo (Opcional)
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: '500', 
                      marginBottom: '8px',
                      color: '#d1d5db'
                    }}>
                      Caddie ID (opcional)
                    </label>
                    <input
                      type="text"
                      name="caddieId"
                      value={form.caddieId || ''}
                      onChange={(e) => setForm(prev => ({ ...prev, caddieId: e.target.value }))}
                      placeholder="UUID del caddie (opcional)"
                      style={inputStyles}
                    />
                  </div>
                  
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: '500', 
                      marginBottom: '8px',
                      color: '#d1d5db'
                    }}>
                      Boleador ID (opcional)
                    </label>
                    <input
                      type="text"
                      name="boleadorId"
                      value={form.boleadorId || ''}
                      onChange={(e) => setForm(prev => ({ ...prev, boleadorId: e.target.value }))}
                      placeholder="UUID del boleador (opcional)"
                      style={inputStyles}
                    />
                  </div>
                </div>
              </div>

              {/* Programación */}
              <div>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Calendar style={{ width: '20px', height: '20px', color: '#f59e0b' }} />
                  Programación
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '8px' }}>
                  <div style={{ marginBottom: '4px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: '500', 
                      marginBottom: '8px',
                      color: '#d1d5db'
                    }}>
                      Fecha *
                    </label>
                    <input
                      type="date"
                      name="fecha"
                      value={form.fecha}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      style={inputStyles}
                      onFocus={(e) => {
                        e.target.style.background = 'linear-gradient(#111827, #111827) padding-box, linear-gradient(135deg, #8b5cf6, #3b82f6) border-box';
                        e.target.style.transform = 'scale(1.02)';
                      }}
                      onBlur={(e) => {
                        e.target.style.background = 'linear-gradient(#111827, #111827) padding-box, linear-gradient(135deg, #3b82f6, #8b5cf6) border-box';
                        e.target.style.transform = 'scale(1)';
                      }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: '500', 
                      marginBottom: '8px',
                      color: '#d1d5db'
                    }}>
                      Cancha *
                    </label>
                    <select
                      name="cancha"
                      value={form.cancha}
                      onChange={handleChange}
                      required
                      style={selectStyles}
                      onFocus={(e) => {
                        e.target.style.background = 'linear-gradient(#111827, #111827) padding-box, linear-gradient(135deg, #8b5cf6, #3b82f6) border-box';
                        e.target.style.transform = 'scale(1.02)';
                      }}
                      onBlur={(e) => {
                        e.target.style.background = 'linear-gradient(#111827, #111827) padding-box, linear-gradient(135deg, #3b82f6, #8b5cf6) border-box';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      <option value="" disabled>
                        {loadingCanchas ? 'Cargando canchas...' : 'Seleccionar cancha'}
                      </option>
                      {canchas.map(cancha => (
                        <option key={cancha.id} value={cancha.id}>
                          {cancha.nombre} - {cancha.ubicacion}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <TimeInput12h
                      label="Hora de Inicio *"
                      value={form.horaInicio}
                      onChange={(value) => handleChange({ target: { name: 'horaInicio', value } } as any)}
                      required
                      className="w-full"
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: '500', 
                      marginBottom: '8px',
                      color: '#d1d5db'
                    }}>
                      Horas a Reservar *
                    </label>
                    <select
                      name="cantidadHoras"
                      value={form.cantidadHoras}
                      onChange={handleChange}
                      required
                      style={selectStyles}
                      onFocus={(e) => {
                        e.target.style.background = 'linear-gradient(#111827, #111827) padding-box, linear-gradient(135deg, #8b5cf6, #3b82f6) border-box';
                        e.target.style.transform = 'scale(1.02)';
                      }}
                      onBlur={(e) => {
                        e.target.style.background = 'linear-gradient(#111827, #111827) padding-box, linear-gradient(135deg, #3b82f6, #8b5cf6) border-box';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      <option value={1}>1 hora</option>
                      <option value={2}>2 horas</option>
                      <option value={3}>3 horas</option>
                      <option value={4}>4 horas</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: '500', 
                      marginBottom: '8px',
                      color: '#d1d5db'
                    }}>
                      Hora de Fin
                    </label>
                    <input
                      type="time"
                      name="horaFin"
                      value={form.horaFin}
                      readOnly
                      style={{
                        ...inputStyles,
                        background: 'linear-gradient(#111827, #111827) padding-box, linear-gradient(135deg, #6b7280, #4b5563) border-box',
                        color: '#9ca3af'
                      }}
                    />
                    {form.horaFin && (
                      <div style={{
                        fontSize: '12px',
                        color: '#9ca3af',
                        marginTop: '4px'
                      }}>
                        {/* Mostrar formato 12h cuando esté disponible la función */}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Observaciones */}
              <div style={{ marginTop: '32px', marginBottom: '8px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  marginBottom: '8px',
                  color: '#d1d5db'
                }}>
                  Observaciones
                </label>
                <textarea
                  name="observaciones"
                  value={form.observaciones}
                  onChange={handleChange}
                  placeholder="Añade cualquier información adicional sobre el turno..."
                  rows={4}
                  style={{
                    ...inputStyles,
                    padding: '16px',
                    resize: 'vertical' as const,
                    minHeight: '100px'
                  }}
                  onFocus={(e) => {
                    e.target.style.background = 'linear-gradient(#111827, #111827) padding-box, linear-gradient(135deg, #8b5cf6, #3b82f6) border-box';
                    e.target.style.transform = 'scale(1.02)';
                  }}
                  onBlur={(e) => {
                    e.target.style.background = 'linear-gradient(#111827, #111827) padding-box, linear-gradient(135deg, #3b82f6, #8b5cf6) border-box';
                    e.target.style.transform = 'scale(1)';
                  }}
                />
              </div>

              {/* Botones */}
              <div style={{ 
                display: 'flex', 
                gap: '16px', 
                justifyContent: 'flex-end',
                paddingTop: '24px',
                borderTop: '1px solid #374151'
              }}>
                <Link
                  to="/turnos"
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    background: '#374151',
                    color: '#d1d5db',
                    textDecoration: 'none',
                    fontWeight: '500',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#4b5563';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#374151';
                  }}
                >
                  Cancelar
                </Link>
                
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    background: loading ? '#6b7280' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    color: '#fff',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: loading ? 'none' : '0 4px 6px -1px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creando...
                    </>
                  ) : (
                    <>
                      <Save style={{ width: '16px', height: '16px' }} />
                      Crear Turno
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <GlobalFooter />
    </div>
  );
};
