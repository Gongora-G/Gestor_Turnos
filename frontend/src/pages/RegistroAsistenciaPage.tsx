import React, { useState, useEffect } from 'react';
import { ClipboardCheck, ClipboardList, CheckCircle } from 'lucide-react';
import { GlobalNavigation, GlobalFooter } from '../components';
import GestionTareas from '../components/GestionTareas';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { asistenciaService, type RegistroAsistencia, type PersonalDisponible } from '../services/asistenciaService';
import JornadasService from '../services/jornadasService';
import tareasService, { type Tarea, type TareaAsignada } from '../services/tareasService';
import type { JornadaConfig } from '../types/jornadas-config';

export const RegistroAsistenciaPage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  // Estado para las pestañas
  const [pestañaActiva, setPestañaActiva] = useState<'registro' | 'tareas'>('registro');

  // Estados
  const [jornadaActual, setJornadaActual] = useState<JornadaConfig | null>(null);
  const [jornadas, setJornadas] = useState<JornadaConfig[]>([]);
  const [jornadaSeleccionada, setJornadaSeleccionada] = useState<number | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  
  const [personalDisponible, setPersonalDisponible] = useState<PersonalDisponible[]>([]);
  const [asistencias, setAsistencias] = useState<RegistroAsistencia[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal de registro
  const [showModal, setShowModal] = useState(false);
  const [personalSeleccionado, setPersonalSeleccionado] = useState<PersonalDisponible | null>(null);
  const [tareasCompletadas, setTareasCompletadas] = useState(false);
  const [tareasPendientes, setTareasPendientes] = useState('');
  const [turnosAyer, setTurnosAyer] = useState(0);
  const [observaciones, setObservaciones] = useState('');
  const [tareasDisponibles, setTareasDisponibles] = useState<Tarea[]>([]);
  const [tareasSeleccionadas, setTareasSeleccionadas] = useState<number[]>([]);
  const [tareasAsignadas, setTareasAsignadas] = useState<Record<string, TareaAsignada[]>>({});
  
  // Modal de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [asistenciaAEliminar, setAsistenciaAEliminar] = useState<RegistroAsistencia | null>(null);
  
  // Modal de confirmación de inasistencia
  const [showInasistenciaModal, setShowInasistenciaModal] = useState(false);
  const [personalInasistencia, setPersonalInasistencia] = useState<PersonalDisponible | null>(null);

  // Cargar jornadas configuradas al montar
  useEffect(() => {
    cargarJornadas();
  }, []);

  // Cargar personal y asistencias cuando cambia la jornada o fecha
  useEffect(() => {
    if (jornadaSeleccionada) {
      cargarPersonalDisponible();
      cargarAsistencias();
    }
  }, [jornadaSeleccionada, fechaSeleccionada]);

  const cargarJornadas = async () => {
    try {
      const data = await JornadasService.getJornadas();
      setJornadas(data);
      
      // Seleccionar automáticamente la jornada actual basada en la hora
      const horaActual = new Date().getHours();
      const jornadaAuto = data.find(j => {
        const horaInicio = parseInt(j.horario.horaInicio.split(':')[0]);
        const horaFin = parseInt(j.horario.horaFin.split(':')[0]);
        
        // Manejar jornadas que cruzan medianoche (ej: 22:00 - 06:00)
        if (horaFin < horaInicio) {
          return horaActual >= horaInicio || horaActual < horaFin;
        }
        
        // Manejar jornada que termina a medianoche (00:00)
        if (horaFin === 0) {
          return horaActual >= horaInicio;
        }
        
        return horaActual >= horaInicio && horaActual < horaFin;
      });

      if (jornadaAuto) {
        console.log('✅ Jornada auto-detectada:', jornadaAuto);
        setJornadaActual(jornadaAuto);
        setJornadaSeleccionada(Number(jornadaAuto.id));
      } else if (data.length > 0) {
        console.log('⚠️ No se detectó jornada activa, seleccionando la primera');
        setJornadaSeleccionada(Number(data[0].id));
      }
    } catch (error) {
      addToast({ type: 'error', title: 'Error', message: 'Error al cargar jornadas' });
    }
  };

  const cargarPersonalDisponible = async () => {
    if (!jornadaSeleccionada) return;
    
    try {
      setLoading(true);
      const data = await asistenciaService.obtenerPersonalDisponible(jornadaSeleccionada!);
      setPersonalDisponible(data);
    } catch (error) {
      addToast({ type: 'error', title: 'Error', message: 'Error al cargar personal disponible' });
    } finally {
      setLoading(false);
    }
  };

  const cargarAsistencias = async () => {
    if (!jornadaSeleccionada) return;
    
    try {
      setLoading(true);
      const data = await asistenciaService.obtenerAsistencias(fechaSeleccionada, Number(jornadaSeleccionada));
      setAsistencias(data);
      
      // Cargar tareas asignadas para cada registro
      const tareasPromises = data.map(async (asistencia) => {
        try {
          const tareas = await tareasService.obtenerTareasDeRegistro(asistencia.id);
          return { registroId: asistencia.id, tareas };
        } catch (error) {
          console.error(`Error al cargar tareas del registro ${asistencia.id}:`, error);
          return { registroId: asistencia.id, tareas: [] };
        }
      });
      
      const tareasResults = await Promise.all(tareasPromises);
      const tareasMap: Record<string, TareaAsignada[]> = {};
      tareasResults.forEach(({ registroId, tareas }) => {
        tareasMap[registroId] = tareas;
      });
      setTareasAsignadas(tareasMap);
    } catch (error) {
      addToast({ type: 'error', title: 'Error', message: 'Error al cargar asistencias' });
    } finally {
      setLoading(false);
    }
  };

  const toggleCompletadaTarea = async (tareaAsignadaId: string, registroId: string, completada: boolean) => {
    try {
      await tareasService.completarTarea(tareaAsignadaId, { completada });
      
      // Actualizar estado local
      setTareasAsignadas(prev => ({
        ...prev,
        [registroId]: prev[registroId].map(t => 
          t.id === tareaAsignadaId ? { ...t, completada } : t
        )
      }));
      
      addToast({
        type: 'success',
        title: completada ? 'Tarea completada' : 'Tarea marcada como pendiente',
        message: completada ? '✅ Tarea marcada como completada' : '⏳ Tarea marcada como pendiente'
      });
    } catch (error) {
      addToast({ 
        type: 'error', 
        title: 'Error', 
        message: 'No se pudo actualizar el estado de la tarea' 
      });
    }
  };

  const abrirModalRegistro = async (personal: PersonalDisponible) => {
    if (!jornadaSeleccionada) {
      addToast({ type: 'error', title: 'Error', message: 'Por favor selecciona una jornada primero' });
      return;
    }
    
    setPersonalSeleccionado(personal);
    setTareasCompletadas(false);
    setTareasPendientes('');
    setTurnosAyer(0);
    setObservaciones('');
    setTareasSeleccionadas([]);
    
    // Cargar tareas activas
    try {
      const tareas = await tareasService.obtenerTareasActivas();
      setTareasDisponibles(tareas);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
      setTareasDisponibles([]);
    }
    
    setShowModal(true);
  };

  const registrarLlegada = async () => {
    if (!personalSeleccionado || !jornadaSeleccionada || !user) return;

    // Validar que turnosAyer sea un número válido
    const turnosAyerValido = isNaN(turnosAyer) ? 0 : Math.max(0, Math.floor(turnosAyer));

    // Preparar datos - solo incluir campos opcionales si tienen valor
    const datos: any = {
      personalId: personalSeleccionado.id,
      jornadaConfigId: jornadaSeleccionada,
      fecha: fechaSeleccionada, // Enviar solo YYYY-MM-DD sin conversión horaria
      tareasCompletadas,
      turnosRealizadosAyer: turnosAyerValido,
      clubId: user.clubId,
      registradoPor: user.id,
    };

    // Solo agregar campos opcionales si tienen valor
    if (tareasPendientes && tareasPendientes.trim()) {
      datos.tareasPendientes = tareasPendientes.trim();
    }
    if (observaciones && observaciones.trim()) {
      datos.observaciones = observaciones.trim();
    }

    try {
      setLoading(true);
      
      console.log('📤 PAYLOAD COMPLETO A ENVIAR:', JSON.stringify(datos, null, 2));
      
      const resultado = await asistenciaService.registrarLlegada(datos);

      // Asignar tareas si hay alguna seleccionada
      if (tareasSeleccionadas.length > 0) {
        try {
          await tareasService.asignarTareas(resultado.id, tareasSeleccionadas);
          console.log(`✅ ${tareasSeleccionadas.length} tarea(s) asignada(s) al registro ${resultado.id}`);
        } catch (error) {
          console.error('Error al asignar tareas:', error);
          addToast({
            type: 'warning',
            title: 'Advertencia',
            message: 'Registro exitoso pero hubo un error al asignar algunas tareas'
          });
        }
      }

      addToast({
        type: 'success',
        title: 'Llegada registrada',
        message: `${resultado.personal.nombre} ${resultado.personal.apellido} a las ${new Date(resultado.horaLlegada).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`
      });
      setShowModal(false);
      setPersonalSeleccionado(null);
      
      // Recargar datos
      await cargarPersonalDisponible();
      await cargarAsistencias();
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Error al registrar',
        message: error.response?.data?.message || 'No se pudo registrar la llegada'
      });
    } finally {
      setLoading(false);
    }
  };

  const registrarInasistencia = async (personal: PersonalDisponible) => {
    if (!jornadaSeleccionada || !user) {
      addToast({ type: 'error', title: 'Error', message: 'Por favor selecciona una jornada primero' });
      return;
    }

    // Abrir modal de confirmación
    setPersonalInasistencia(personal);
    setShowInasistenciaModal(true);
  };

  const confirmarInasistencia = async () => {
    if (!personalInasistencia || !jornadaSeleccionada || !user) return;

    const datos = {
      personalId: personalInasistencia.id,
      jornadaConfigId: jornadaSeleccionada!,
      fecha: fechaSeleccionada,
      presente: false, // Marcamos como ausente
      tareasCompletadas: false,
      turnosRealizadosAyer: 0,
      clubId: user.clubId!,
      registradoPor: user.id,
      observaciones: 'Inasistencia registrada'
    };

    try {
      setLoading(true);
      await asistenciaService.registrarLlegada(datos);

      addToast({
        type: 'warning',
        title: 'Inasistencia registrada',
        message: `${personalInasistencia.nombre} ${personalInasistencia.apellido} marcado como ausente`
      });
      
      setShowInasistenciaModal(false);
      setPersonalInasistencia(null);
      
      // Recargar datos
      await cargarPersonalDisponible();
      await cargarAsistencias();
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Error al registrar',
        message: error.response?.data?.message || 'No se pudo registrar la inasistencia'
      });
    } finally {
      setLoading(false);
    }
  };

  const abrirModalEliminar = (asistencia: RegistroAsistencia) => {
    setAsistenciaAEliminar(asistencia);
    setShowDeleteModal(true);
  };

  const confirmarEliminacion = async () => {
    if (!asistenciaAEliminar) return;

    try {
      setLoading(true);
      await asistenciaService.eliminarAsistencia(asistenciaAEliminar.id);
      addToast({
        type: 'success',
        title: 'Registro eliminado',
        message: `${asistenciaAEliminar.personal.nombre} ${asistenciaAEliminar.personal.apellido}`
      });
      setShowDeleteModal(false);
      setAsistenciaAEliminar(null);
      
      // Recargar datos
      await cargarPersonalDisponible();
      await cargarAsistencias();
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Error al eliminar',
        message: error.response?.data?.message || 'No se pudo eliminar el registro'
      });
    } finally {
      setLoading(false);
    }
  };

  const calcularOrden = async () => {
    if (!jornadaSeleccionada) return;

    try {
      setLoading(true);
      await asistenciaService.calcularOrden(fechaSeleccionada, Number(jornadaSeleccionada));
      addToast({
        type: 'success',
        title: 'Orden calculado',
        message: 'El orden de turnos se asignó correctamente'
      });
      await cargarAsistencias();
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Error al calcular orden',
        message: error.response?.data?.message || 'No se pudo calcular el orden automático'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatHora = (fecha: string) => {
    return new Date(fecha).toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <GlobalNavigation />
      
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <ClipboardCheck className="w-8 h-8 text-blue-400" />
                  Registro de Asistencia
                </h1>
                <p className="mt-2 text-gray-300">
                  Registra la llegada del personal y gestiona las tareas del día
                </p>
              </div>
            </div>

            {/* Pestañas de navegación */}
            <div className="mt-6 flex space-x-1 bg-gray-900 rounded-lg p-1">
              <button
                onClick={() => setPestañaActiva('registro')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  pestañaActiva === 'registro'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <ClipboardCheck className="w-5 h-5" />
                <span>Registro de Asistencia</span>
              </button>
              <button
                onClick={() => setPestañaActiva('tareas')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  pestañaActiva === 'tareas'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <ClipboardList className="w-5 h-5" />
                <span>Gestión de Tareas</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Contenido según pestaña activa */}
        {pestañaActiva === 'tareas' ? (
          <GestionTareas />
        ) : (
          <div>

      {/* Controles */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: '1.5rem',
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Selector de Jornada */}
        <div style={{ flex: '1', minWidth: '200px' }}>
          <label style={{ 
            display: 'block', 
            color: '#9ca3af', 
            fontSize: '0.875rem',
            marginBottom: '0.5rem'
          }}>
            Jornada
          </label>
          <select
            value={jornadaSeleccionada?.toString() || ''}
            onChange={(e) => setJornadaSeleccionada(e.target.value ? Number(e.target.value) : null)}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#374151',
              border: '1px solid #4b5563',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '1rem'
            }}
          >
            <option value="">Seleccionar jornada</option>
            {jornadas.map(j => (
              <option key={j.id} value={j.id}>
                {j.nombre} ({j.horario.horaInicio} - {j.horario.horaFin})
                {jornadaActual?.id === j.id ? ' 🔴 ACTIVA' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Selector de Fecha */}
        <div style={{ flex: '1', minWidth: '200px' }}>
          <label style={{ 
            display: 'block', 
            color: '#9ca3af', 
            fontSize: '0.875rem',
            marginBottom: '0.5rem'
          }}>
            Fecha
          </label>
          <input
            type="date"
            value={fechaSeleccionada}
            onChange={(e) => setFechaSeleccionada(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#374151',
              border: '1px solid #4b5563',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '1rem'
            }}
          />
        </div>

        {/* Botón Calcular Orden */}
        <button
          onClick={calcularOrden}
          disabled={loading || asistencias.length === 0}
          style={{
            padding: '0.75rem 1.5rem',
            background: asistencias.length === 0 ? '#374151' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: asistencias.length === 0 ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '1rem',
            marginTop: '1.5rem',
            opacity: asistencias.length === 0 ? 0.5 : 1
          }}
        >
          🔢 Calcular Orden
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Panel Izquierdo: Personal Disponible */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: '#fff',
              margin: 0
            }}>
              👥 Personal Disponible
            </h2>
            <div style={{
              fontSize: '0.875rem',
              color: '#9ca3af',
              background: '#374151',
              padding: '0.5rem 1rem',
              borderRadius: '6px'
            }}>
              {personalDisponible.filter(p => !p.ya_registro_hoy).length} pendientes
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {loading && personalDisponible.length === 0 ? (
              <div style={{ 
                color: '#9ca3af', 
                textAlign: 'center', 
                padding: '3rem',
                background: '#1f2937',
                borderRadius: '12px',
                border: '2px dashed #374151'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
                Cargando personal...
              </div>
            ) : personalDisponible.length === 0 ? (
              <div style={{ 
                color: '#9ca3af', 
                textAlign: 'center', 
                padding: '3rem',
                background: '#1f2937',
                borderRadius: '12px',
                border: '2px dashed #374151'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👤</div>
                No hay personal disponible
              </div>
            ) : (
              personalDisponible.map(personal => {
                const esAusente = personal.ya_registro_hoy && personal.estado_asistencia === 'ausente';
                const esPresente = personal.ya_registro_hoy && personal.estado_asistencia === 'presente';
                // const sinRegistrar = !personal.ya_registro_hoy; // Variable para uso futuro
                
                return (
                <div
                  key={personal.id}
                  style={{
                    padding: '1.25rem',
                    background: esPresente
                      ? 'linear-gradient(135deg, #065f46 0%, #047857 100%)'
                      : esAusente
                      ? 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)'
                      : 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                    borderRadius: '12px',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: esPresente ? '#10b981' : esAusente ? '#dc2626' : '#374151',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.3s',
                    position: 'relative',
                    overflow: 'hidden',
                    opacity: esAusente ? 0.85 : 1
                  }}
                >
                  {/* Badge de estado */}
                  {esPresente && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: '#10b981',
                      color: '#fff',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)'
                    }}>
                      ✓ Presente
                    </div>
                  )}
                  {esAusente && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: '#dc2626',
                      color: '#fff',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      boxShadow: '0 2px 4px rgba(220, 38, 38, 0.3)'
                    }}>
                      ❌ Ausente
                    </div>
                  )}
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      color: '#fff', 
                      fontWeight: '700',
                      fontSize: '1.125rem',
                      marginBottom: '0.25rem'
                    }}>
                      {personal.nombre} {personal.apellido}
                    </div>
                    <div style={{ 
                      color: personal.ya_registro_hoy ? '#d1fae5' : '#9ca3af', 
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span>🎾 {personal.tipo_personal}</span>
                    </div>
                  </div>
                  
                  {!personal.ya_registro_hoy ? (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => abrirModalRegistro(personal)}
                        style={{
                          padding: '0.75rem 1.25rem',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '700',
                          fontSize: '0.875rem',
                          boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 12px rgba(16, 185, 129, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 6px rgba(16, 185, 129, 0.3)';
                        }}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Asistencia
                      </button>
                      <button
                        onClick={() => registrarInasistencia(personal)}
                        style={{
                          padding: '0.75rem 1.25rem',
                          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '700',
                          fontSize: '0.875rem',
                          boxShadow: '0 4px 6px rgba(239, 68, 68, 0.3)',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 12px rgba(239, 68, 68, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 6px rgba(239, 68, 68, 0.3)';
                        }}
                      >
                        ❌ Inasistencia
                      </button>
                    </div>
                  ) : (
                    <div style={{
                      padding: '0.75rem 1.5rem',
                      background: personal.estado_asistencia === 'presente' 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(239, 68, 68, 0.2)',
                      color: personal.estado_asistencia === 'presente' ? '#d1fae5' : '#fca5a5',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      {personal.estado_asistencia === 'presente' ? '✓ Registrado' : '❌ Ausente'}
                    </div>
                  )}
                </div>
              );
              })
            )}
          </div>
        </div>

        {/* Panel Derecho: Asistencias Registradas */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: '#fff',
              margin: 0
            }}>
              📊 Registros del Día
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{
                fontSize: '0.875rem',
                color: '#fff',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontWeight: '600'
              }}>
                ✅ {asistencias.filter(a => a.presente).length} Presentes
              </div>
              {asistencias.filter(a => !a.presente).length > 0 && (
                <div style={{
                  fontSize: '0.875rem',
                  color: '#fff',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontWeight: '600'
                }}>
                  ❌ {asistencias.filter(a => !a.presente).length} Ausentes
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {asistencias.length === 0 ? (
              <div style={{ 
                color: '#9ca3af', 
                textAlign: 'center', 
                padding: '3rem',
                background: '#1f2937',
                borderRadius: '12px',
                border: '2px dashed #374151'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                  No hay asistencias registradas
                </div>
                <div style={{ fontSize: '0.875rem' }}>
                  Registra la llegada del personal para comenzar
                </div>
              </div>
            ) : (
              asistencias.map((asistencia) => (
                <div
                  key={asistencia.id}
                  style={{
                    padding: '1.25rem',
                    background: asistencia.presente 
                      ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
                      : 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
                    borderRadius: '12px',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: asistencia.presente 
                      ? (asistencia.ordenCalculado ? '#3b82f6' : '#374151')
                      : '#dc2626',
                    position: 'relative',
                    transition: 'all 0.3s',
                    opacity: asistencia.presente ? 1 : 0.85
                  }}
                >
                  {/* Badge de INASISTENCIA */}
                  {!asistencia.presente && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: '#dc2626',
                      color: '#fff',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      boxShadow: '0 2px 4px rgba(220, 38, 38, 0.3)'
                    }}>
                      ❌ AUSENTE
                    </div>
                  )}

                  {/* Número de Orden (solo para presentes) */}
                  {asistencia.presente && asistencia.ordenCalculado && (
                    <div style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '-12px',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '1.125rem',
                      boxShadow: '0 4px 8px rgba(59, 130, 246, 0.5)',
                      border: '3px solid #111827'
                    }}>
                      {asistencia.ordenCalculado}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        color: '#fff', 
                        fontWeight: '700',
                        fontSize: '1.125rem',
                        marginBottom: '0.75rem'
                      }}>
                        {asistencia.personal.nombre} {asistencia.personal.apellido}
                      </div>
                      
                      <div style={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '0.75rem',
                        marginBottom: '0.75rem'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          background: '#374151',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.875rem'
                        }}>
                          <span>🕐</span>
                          <span style={{ color: '#fff', fontWeight: '600' }}>
                            {formatHora(asistencia.horaLlegada)}
                          </span>
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          background: '#374151',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.875rem'
                        }}>
                          <span>🎾</span>
                          <span style={{ color: '#fff', fontWeight: '600' }}>
                            {asistencia.turnosRealizadosAyer} ayer
                          </span>
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          background: asistencia.tareasCompletadas ? '#065f46' : '#78350f',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          gridColumn: 'span 2'
                        }}>
                          <span>{asistencia.tareasCompletadas ? '✅' : '⏳'}</span>
                          <span style={{ color: '#fff', fontWeight: '600' }}>
                            {asistencia.tareasCompletadas ? 'Tareas completas' : 'Tareas pendientes'}
                          </span>
                        </div>
                      </div>

                      {asistencia.observaciones && (
                        <div style={{
                          padding: '0.75rem',
                          background: 'rgba(59, 130, 246, 0.1)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          color: '#bfdbfe',
                          display: 'flex',
                          gap: '0.5rem'
                        }}>
                          <span>💬</span>
                          <span>{asistencia.observaciones}</span>
                        </div>
                      )}

                      {/* Tareas Asignadas */}
                      {tareasAsignadas[asistencia.id] && tareasAsignadas[asistencia.id].length > 0 && (
                        <div style={{ marginTop: '0.75rem' }}>
                          <div style={{
                            color: '#9ca3af',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            📋 Tareas Asignadas ({tareasAsignadas[asistencia.id].filter(t => t.completada).length}/{tareasAsignadas[asistencia.id].length})
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {tareasAsignadas[asistencia.id].map(tareaAsignada => (
                              <div
                                key={tareaAsignada.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.75rem',
                                  padding: '0.75rem',
                                  background: tareaAsignada.completada 
                                    ? 'rgba(16, 185, 129, 0.1)' 
                                    : 'rgba(245, 158, 11, 0.1)',
                                  border: `1px solid ${tareaAsignada.completada ? '#10b981' : '#f59e0b'}`,
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s'
                                }}
                                onClick={() => toggleCompletadaTarea(
                                  tareaAsignada.id, 
                                  asistencia.id, 
                                  !tareaAsignada.completada
                                )}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'translateX(4px)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'translateX(0)';
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={tareaAsignada.completada}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    toggleCompletadaTarea(
                                      tareaAsignada.id, 
                                      asistencia.id, 
                                      e.target.checked
                                    );
                                  }}
                                  style={{
                                    width: '18px',
                                    height: '18px',
                                    cursor: 'pointer',
                                    flexShrink: 0
                                  }}
                                />
                                <div style={{ flex: 1 }}>
                                  <div style={{
                                    color: '#fff',
                                    fontWeight: '600',
                                    fontSize: '0.875rem',
                                    textDecoration: tareaAsignada.completada ? 'line-through' : 'none',
                                    opacity: tareaAsignada.completada ? 0.7 : 1
                                  }}>
                                    {tareaAsignada.tarea?.nombre}
                                  </div>
                                  {tareaAsignada.tarea?.descripcion && (
                                    <div style={{
                                      color: '#9ca3af',
                                      fontSize: '0.75rem',
                                      marginTop: '0.125rem'
                                    }}>
                                      {tareaAsignada.tarea.descripcion}
                                    </div>
                                  )}
                                </div>
                                {tareaAsignada.tarea?.categoria && (
                                  <span style={{
                                    padding: '0.25rem 0.5rem',
                                    background: '#4b5563',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    color: '#9ca3af',
                                    flexShrink: 0
                                  }}>
                                    {tareaAsignada.tarea.categoria}
                                  </span>
                                )}
                                <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>
                                  {tareaAsignada.completada ? '✅' : '⏳'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => abrirModalEliminar(asistencia)}
                      style={{
                        padding: '0.5rem',
                        background: 'transparent',
                        color: '#ef4444',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1.25rem'
                      }}
                      title="Eliminar registro"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal de Registro */}
      {showModal && personalSeleccionado && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: '#1f2937',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
          }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: '#fff',
              marginBottom: '1.5rem'
            }}>
              📝 Registrar Llegada
            </h3>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ color: '#fff', fontWeight: '600', fontSize: '1.125rem' }}>
                {personalSeleccionado.nombre} {personalSeleccionado.apellido}
              </div>
              <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                {personalSeleccionado.tipo_personal}
              </div>
            </div>

            {/* Turnos Ayer */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                color: '#9ca3af', 
                fontSize: '0.875rem',
                marginBottom: '0.5rem'
              }}>
                Turnos realizados ayer
              </label>
              <input
                type="number"
                min="0"
                max="50"
                step="1"
                value={turnosAyer}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setTurnosAyer(Math.max(0, val));
                }}
                onBlur={(e) => {
                  // Asegurar que sea un número válido al perder el foco
                  const val = parseInt(e.target.value) || 0;
                  setTurnosAyer(Math.max(0, val));
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#374151',
                  border: '1px solid #4b5563',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '1rem'
                }}
                placeholder="0"
              />
            </div>

            {/* Tareas Completadas */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                color: '#fff'
              }}>
                <input
                  type="checkbox"
                  checked={tareasCompletadas}
                  onChange={(e) => setTareasCompletadas(e.target.checked)}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <span>¿Completó las tareas asignadas?</span>
              </label>
            </div>

            {/* Tareas Pendientes */}
            {!tareasCompletadas && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ 
                  display: 'block', 
                  color: '#9ca3af', 
                  fontSize: '0.875rem',
                  marginBottom: '0.5rem'
                }}>
                  Tareas pendientes
                </label>
                <input
                  type="text"
                  value={tareasPendientes}
                  onChange={(e) => setTareasPendientes(e.target.value)}
                  placeholder="Ej: Limpiar pista 3"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#374151',
                    border: '1px solid #4b5563',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '1rem'
                  }}
                />
              </div>
            )}

            {/* Asignar Tareas */}
            {tareasDisponibles.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ 
                  display: 'block', 
                  color: '#9ca3af', 
                  fontSize: '0.875rem',
                  marginBottom: '0.5rem',
                  fontWeight: '600'
                }}>
                  📋 Asignar Tareas
                </label>
                <div style={{
                  maxHeight: '200px',
                  overflowY: 'auto',
                  background: '#374151',
                  border: '1px solid #4b5563',
                  borderRadius: '8px',
                  padding: '0.5rem'
                }}>
                  {tareasDisponibles.map(tarea => (
                    <label
                      key={tarea.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        background: tareasSeleccionadas.includes(tarea.id) 
                          ? 'rgba(16, 185, 129, 0.1)' 
                          : 'transparent',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        marginBottom: '0.5rem',
                        border: tareasSeleccionadas.includes(tarea.id)
                          ? '1px solid #10b981'
                          : '1px solid transparent',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (!tareasSeleccionadas.includes(tarea.id)) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!tareasSeleccionadas.includes(tarea.id)) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={tareasSeleccionadas.includes(tarea.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setTareasSeleccionadas([...tareasSeleccionadas, tarea.id]);
                          } else {
                            setTareasSeleccionadas(tareasSeleccionadas.filter(id => id !== tarea.id));
                          }
                        }}
                        style={{ 
                          width: '18px', 
                          height: '18px', 
                          cursor: 'pointer',
                          flexShrink: 0
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          color: '#fff', 
                          fontWeight: '600',
                          fontSize: '0.875rem'
                        }}>
                          {tarea.nombre}
                        </div>
                        {tarea.descripcion && (
                          <div style={{ 
                            color: '#9ca3af', 
                            fontSize: '0.75rem',
                            marginTop: '0.25rem'
                          }}>
                            {tarea.descripcion}
                          </div>
                        )}
                      </div>
                      {tarea.categoria && (
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          background: '#4b5563',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          color: '#9ca3af',
                          flexShrink: 0
                        }}>
                          {tarea.categoria}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
                {tareasSeleccionadas.length > 0 && (
                  <div style={{
                    marginTop: '0.5rem',
                    padding: '0.5rem',
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '6px',
                    color: '#10b981',
                    fontSize: '0.875rem',
                    textAlign: 'center'
                  }}>
                    ✓ {tareasSeleccionadas.length} tarea(s) seleccionada(s)
                  </div>
                )}
              </div>
            )}

            {/* Observaciones */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                color: '#9ca3af', 
                fontSize: '0.875rem',
                marginBottom: '0.5rem'
              }}>
                Observaciones (opcional)
              </label>
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Alguna observación sobre esta llegada..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#374151',
                  border: '1px solid #4b5563',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Botones */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: '#374151',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={registrarLlegada}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: loading 
                    ? '#374151' 
                    : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}
              >
                {loading ? 'Registrando...' : '✅ Registrar Llegada'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && asistenciaAEliminar && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '1rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                ⚠️
              </div>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: '#fff',
                margin: 0
              }}>
                Confirmar Eliminación
              </h2>
            </div>

            <p style={{ 
              color: '#d1d5db', 
              marginBottom: '1rem',
              fontSize: '1rem'
            }}>
              ¿Estás seguro de eliminar el registro de asistencia de:
            </p>

            <div style={{
              background: '#374151',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}>
              <div style={{ color: '#fff', fontWeight: '600', marginBottom: '0.5rem' }}>
                {asistenciaAEliminar.personal.nombre} {asistenciaAEliminar.personal.apellido}
              </div>
              <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                🕐 Hora de llegada: {formatHora(asistenciaAEliminar.horaLlegada)}
              </div>
            </div>

            <p style={{ 
              color: '#ef4444', 
              fontSize: '0.875rem',
              marginBottom: '1.5rem'
            }}>
              ⚠️ Esta acción no se puede deshacer.
            </p>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setAsistenciaAEliminar(null);
                }}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: '#374151',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminacion}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: loading 
                    ? '#374151' 
                    : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}
              >
                {loading ? 'Eliminando...' : '🗑️ Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Inasistencia */}
      {showInasistenciaModal && personalInasistencia && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
            borderRadius: '16px',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            border: '2px solid #ef4444'
          }}>
            <div style={{ padding: '2rem' }}>
              {/* Header con ícono */}
              <div style={{
                display: 'flex',
                alignItems: 'start',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  padding: '0.75rem',
                  background: 'rgba(239, 68, 68, 0.2)',
                  borderRadius: '12px',
                  border: '2px solid rgba(239, 68, 68, 0.3)',
                  flexShrink: 0
                }}>
                  <span style={{ fontSize: '2rem' }}>❌</span>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#fff',
                    marginBottom: '0.5rem'
                  }}>
                    Registrar Inasistencia
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#9ca3af',
                    margin: 0
                  }}>
                    Confirma que esta persona no asistió a trabajar
                  </p>
                </div>
              </div>

              {/* Información del personal */}
              <div style={{
                background: 'rgba(31, 41, 55, 0.5)',
                border: '1px solid #374151',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#fff',
                  marginBottom: '0.75rem'
                }}>
                  {personalInasistencia.nombre} {personalInasistencia.apellido}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#9ca3af',
                  fontSize: '0.875rem'
                }}>
                  <span>🎾</span>
                  <span>{personalInasistencia.tipo_personal}</span>
                </div>
              </div>

              {/* Advertencias con viñetas */}
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '2px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  color: '#fca5a5',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ fontSize: '1.25rem' }}>⚠️</span>
                  <span>Esta acción registrará que:</span>
                </div>
                <ul style={{
                  margin: 0,
                  paddingLeft: '1.5rem',
                  color: '#fca5a5',
                  fontSize: '0.875rem',
                  listStyle: 'disc',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <li>Esta persona <strong>NO asistió</strong> a trabajar hoy</li>
                  <li>Quedará marcada como <strong>AUSENTE</strong> en los reportes</li>
                  <li>No se le asignará ningún turno</li>
                  <li>Se registrará la fecha y hora de la inasistencia</li>
                </ul>
              </div>

              {/* Botones */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => {
                    setShowInasistenciaModal(false);
                    setPersonalInasistencia(null);
                  }}
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    background: '#374151',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '1rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.currentTarget.style.background = '#4b5563';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#374151';
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarInasistencia}
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    background: loading 
                      ? '#374151' 
                      : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: '700',
                    fontSize: '1rem',
                    boxShadow: loading ? 'none' : '0 4px 12px rgba(239, 68, 68, 0.4)',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.5)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
                  }}
                >
                  {loading ? (
                    <>
                      <span>⏳</span>
                      <span>Registrando...</span>
                    </>
                  ) : (
                    <>
                      <span>❌</span>
                      <span>Registrar Inasistencia</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        </div>
        )}
      </div>
      
      <GlobalFooter />
    </div>
  );
};
