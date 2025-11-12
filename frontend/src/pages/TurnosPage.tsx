import React, { useState, useEffect } from 'react';
import { 
  AppLayout, 
  CrearTurnoModal, 
  TurnoCard, 
  VerTurnoModal, 
  EditarTurnoModal, 
  EliminarTurnoModal 
} from '../components';
import RegistroJornadas from '../components/RegistroJornadas';
import { Plus, Filter, Search, Save, History, Clock, Trash2 } from 'lucide-react';
import { turnosService, canchasService, type Turno as TurnoService } from '../services';
import { JornadasService } from '../services/jornadasService';
import { calcularEstadoAutomatico } from '../utils/turnoStates';
import { useToast } from '../contexts/ToastContext';
import { apiService } from '../services/api';

// Usar el tipo del servicio
type Turno = TurnoService;

// Alias para compatibilidad con otros componentes
interface TurnoBackend extends Turno {}

// Esta función ya no se necesita - el plano empieza vacío


  console.log('� Recargando turnos del día desde backend...');
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

interface PersonalInfo {
  id: string;
  nombre: string;
  apellido: string;
  tipoPersonal: {
    nombre: string;
    color?: string;
  };
}

export const TurnosPage: React.FC = () => {
  const { success: showSuccess, error: showError, warning: showWarning } = useToast();
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [canchas, setCanchas] = useState<CanchaBackend[]>([]);
  const [personalData, setPersonalData] = useState<PersonalInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [guardandoJornada, setGuardandoJornada] = useState(false);
  const [tabActivo, setTabActivo] = useState<'turnos' | 'historial'>('turnos');
  const [jornadaActual, setJornadaActual] = useState<any>(null);
  const [siguienteJornada, setSiguienteJornada] = useState<{ jornada: any; tiempoRestante: string } | null>(null);
  
  // Estados para modales de finalización
  const [modalFinalizacionAbierto, setModalFinalizacionAbierto] = useState(false);
  const [modalSeleccionAbierto, setModalSeleccionAbierto] = useState(false);
  const [turnosParaCompletar, setTurnosParaCompletar] = useState<any[]>([]);
  const [turnosSeleccionados, setTurnosSeleccionados] = useState<string[]>([]);
  const [forceRender, setForceRender] = useState(0); // Para forzar re-renders
  
  // Estados de modales
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [verTurnoModal, setVerTurnoModal] = useState<{ abierto: boolean; turno: Turno | null }>({
    abierto: false,
    turno: null
  });
  const [editarTurnoModal, setEditarTurnoModal] = useState<{ abierto: boolean; turno: Turno | null }>({
    abierto: false,
    turno: null
  });
  const [eliminarTurnoModal, setEliminarTurnoModal] = useState<{ abierto: boolean; turno: Turno | null }>({
    abierto: false,
    turno: null
  });



  // Cargar datos básicos Y turnos del día actual desde backend
  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Cargando datos básicos y turnos del día...');
      const [canchasResponse, jornadaResponse, personalResponse] = await Promise.all([
        canchasService.obtenerCanchas(),
        JornadasService.getJornadaActual(),
        apiService.get<PersonalInfo[]>('/personal/activos')
      ]);
      
      setPersonalData(personalResponse);
      console.log('👥 Personal cargado:', personalResponse.length);
      
      // Cargar turnos de la jornada activa
      if (jornadaResponse?.id) {
        console.log('📋 Cargando turnos de la jornada activa:', jornadaResponse.id);
        try {
          const turnosJornada = await turnosService.obtenerTurnos();
          console.log('🔍 TODOS los turnos del backend:', turnosJornada.length);
          console.log('🔍 ID de jornada activa:', jornadaResponse.id);
          
          // Mostrar los jornada_id de todos los turnos para debug
          turnosJornada.forEach((turno, index) => {
            console.log(`  Turno ${index + 1}: ID=${turno.id}, jornada_id=${turno.jornada_id}, estado_registro=${turno.estado_registro}, nombre=${turno.nombre}`);
          });
          
          // Filtrar solo turnos de la jornada activa y que estén activos (no guardados)
          const turnosDeJornada = turnosJornada.filter(turno => 
            turno.jornada_id === jornadaResponse.id && 
            (turno.estado_registro === 'ACTIVO' || !turno.estado_registro) // Incluir turnos sin estado o ACTIVO
          );
          setTurnos(turnosDeJornada);
          console.log('✅ Turnos de jornada activa cargados:', turnosDeJornada.length);
        } catch (error) {
          console.error('Error al cargar turnos de jornada:', error);
          setTurnos([]);
        }
      } else {
        console.log('⚠️ No hay jornada activa disponible en este horario');
        setTurnos([]);
        
        // Buscar la siguiente jornada disponible
        try {
          const siguienteInfo = await JornadasService.getSiguienteJornadaDisponible();
          setSiguienteJornada(siguienteInfo);
          console.log('🕐 Siguiente jornada:', siguienteInfo);
        } catch (error) {
          console.error('Error al obtener siguiente jornada:', error);
        }
      }
      
      console.log('✅ Datos cargados:', {
        canchas: canchasResponse.length,
        jornada: jornadaResponse?.id
      });
      
      setCanchas(canchasResponse);
      setJornadaActual(jornadaResponse);
      
    } catch (error: any) {
      console.error('❌ Error al cargar datos:', error);
      
      if (error.statusCode === 401) {
        console.log('🔒 Error de autenticación, redirigiendo...');
        return;
      }
      
      setError(`Error al conectar con el servidor: ${error.message || 'Error desconocido'}`);
      setTurnos([]);
      setCanchas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // ✅ Los turnos se manejan directamente desde backend - no necesitamos localStorage

  // ➕ Recargar turnos de la jornada activa después de crear uno
  const recargarTurnosJornadaActiva = async () => {
    try {
      if (!jornadaActual?.id) {
        console.log('⚠️ No hay jornada activa');
        return;
      }
      
      console.log('🔄 Recargando turnos de jornada activa:', jornadaActual.id, jornadaActual.nombre);
      const todosTurnos = await turnosService.obtenerTurnos();
      console.log('📊 TODOS LOS TURNOS DEL BACKEND:', todosTurnos.length);
      
      console.log('🔍 DEBUG RECARGA - Total turnos:', todosTurnos.length);
      console.log('🔍 DEBUG RECARGA - Jornada activa ID:', jornadaActual.id);
      
      // Mostrar jornada_config_id de cada turno
      todosTurnos.forEach((turno, index) => {
        const jornadaIdDelTurno = turno.jornada_config_id || turno.jornada_id;
        console.log(`  Turno ${index + 1}: ID=${turno.id}, jornada_config_id=${turno.jornada_config_id}, coincide=${jornadaIdDelTurno === jornadaActual.id}`);
      });
      
      // Filtrar SOLO turnos de la jornada activa usando jornada_config_id
      const turnosDeJornada = todosTurnos.filter(turno => {
        // Usar jornada_config_id como jornada_id temporal
        const jornadaIdDelTurno = turno.jornada_config_id || turno.jornada_id;
        
        // EXCLUIR turnos sin jornada_config_id ni jornada_id
        if (jornadaIdDelTurno === undefined || jornadaIdDelTurno === null) {
          console.log(`  Turno ${turno.id} sin jornada - EXCLUIDO (turno antiguo)`);
          return false;
        }
        
        // Solo incluir turnos que pertenecen a la jornada activa
        const turnoJornadaId = Number(jornadaIdDelTurno);
        const jornadaActualId = Number(jornadaActual.id);
        
        const coincide = turnoJornadaId === jornadaActualId;
        console.log(`  Turno ${turno.id}: jornada_config_id=${turno.jornada_config_id} vs jornadaActual=${jornadaActual.id} → ${coincide ? 'INCLUIDO' : 'EXCLUIDO'}`);
        
        return coincide;
      });
      
      console.log('🔍 DEBUG ANTES DE SETEAR - Estados de turnos:', turnosDeJornada.map(t => ({ id: t.id, estado: t.estado, nombre: t.nombre })));
      console.log('📊 RESUMEN RECARGA:', {
        totalBackend: todosTurnos.length,
        coincidentes: turnosDeJornada.length,
        jornadaActual: { id: jornadaActual.id, nombre: jornadaActual.nombre },
        estadosTurnos: turnosDeJornada.reduce((acc, t) => {
          acc[t.estado] = (acc[t.estado] || 0) + 1;
          return acc;
        }, {} as any)
      });
      
      setTurnos(turnosDeJornada);
      console.log('✅ Turnos actualizados:', turnosDeJornada.length);
    } catch (error) {
      console.error('❌ Error al recargar turnos:', error);
    }
  };



  // 🧹 Limpiar plano de trabajo
  const handleLimpiarPlano = () => {
    if (turnos.length === 0) {
      showWarning('Plano vacío', 'No hay turnos en el plano de trabajo');
      return;
    }
    
    if (window.confirm(`¿Limpiar el plano de trabajo?\n\nEsto eliminará los ${turnos.length} turnos del plano actual. Esta acción no se puede deshacer.`)) {
      setTurnos([]);
      showSuccess('✅ Plano limpiado', 'El plano de trabajo ha sido limpiado correctamente');
    }
  };

  // Handlers para modales
  const handleVerTurno = (turno: Turno) => {
    setVerTurnoModal({ abierto: true, turno });
  };

  const handleEditarTurno = (turno: Turno) => {
    setEditarTurnoModal({ abierto: true, turno });
  };

  const handleEliminarTurno = (turno: Turno) => {
    setEliminarTurnoModal({ abierto: true, turno });
  };

  // Función para crear turno (comentada por no usarse actualmente)
  /*
  const handleCrearTurno = async (turnoData: Partial<TurnoBackend>) => {
    try {
      await turnosService.crearTurno(turnoData);
      await cargarDatos(); // Recargar datos
    } catch (error) {
      console.error('Error al crear turno:', error);
      throw error;
    }
  };
  */

  // Función para actualizar turno
  const handleActualizarTurno = async (turnoData: Partial<TurnoBackend>) => {
    try {
      if (!editarTurnoModal.turno?.id) throw new Error('ID de turno no encontrado');
      await turnosService.actualizarTurno(editarTurnoModal.turno.id, turnoData);
      // Recargar turnos de la jornada activa
      await recargarTurnosJornadaActiva();
    } catch (error) {
      console.error('Error al actualizar turno:', error);
      throw error;
    }
  };

  // 🎯 FUNCIONES PARA FINALIZACIÓN DE JORNADA
  const mostrarModalFinalizacion = (turnosEnProgreso: any[]): Promise<string> => {
    return new Promise((resolve) => {
      setTurnosParaCompletar(turnosEnProgreso);
      setModalFinalizacionAbierto(true);
      
      // Guardar resolve en una ref o variable para usarla en los botones del modal
      (window as any).resolveFinalizacion = resolve;
    });
  };

  const mostrarModalSeleccionTurnos = (turnosEnProgreso: any[]): Promise<string[]> => {
    return new Promise((resolve) => {
      setTurnosParaCompletar(turnosEnProgreso);
      setTurnosSeleccionados([]);
      setModalSeleccionAbierto(true);
      
      // Guardar resolve en una ref o variable para usarla en los botones del modal
      (window as any).resolveSeleccion = resolve;
    });
  };

  const completarTurnosAutomaticamente = async (turnoIds: string[]) => {
    try {
      console.log('🔄 Completando turnos automáticamente:', turnoIds);
      
      for (const turnoId of turnoIds) {
        console.log(`  → Completando turno ID: ${turnoId}`);
        const resultado = await turnosService.actualizarTurno(turnoId, { estado: 'completado' });
        console.log(`  ✅ Turno ${turnoId} completado:`, resultado);
      }
      
      console.log('🎉 Todos los turnos seleccionados han sido completados en el backend');
      
      showSuccess(
        '✅ Turnos completados', 
        `Se completaron ${turnoIds.length} turnos automáticamente`
      );
    } catch (error) {
      console.error('❌ Error completando turnos:', error);
      showError('Error', 'No se pudieron completar algunos turnos');
      throw error;
    }
  };

  // Handlers para los modales
  const handleFinalizacionResponse = (respuesta: string) => {
    setModalFinalizacionAbierto(false);
    if ((window as any).resolveFinalizacion) {
      (window as any).resolveFinalizacion(respuesta);
    }
  };

  const handleSeleccionResponse = (seleccionados: string[]) => {
    setModalSeleccionAbierto(false);
    if ((window as any).resolveSeleccion) {
      (window as any).resolveSeleccion(seleccionados);
    }
  };

  // Función para eliminar turno
  const handleConfirmarEliminar = async (turnoId: string) => {
    try {
      await turnosService.eliminarTurno(turnoId);
      // Recargar turnos de la jornada activa
      await recargarTurnosJornadaActiva();
    } catch (error) {
      console.error('Error al eliminar turno:', error);
      throw error;
    }
  };

  // Función para guardar jornada actual
  const handleGuardarJornada = async () => {
    if (turnos.length === 0) {
      showWarning('Sin turnos activos', 'No hay turnos para guardar en la jornada actual');
      return;
    }

    // 🔍 VALIDAR ESTADO DE TURNOS ANTES DE GUARDAR
    const turnosEnProgreso = turnos.filter(turno => 
      turno.estado !== 'completado' && turno.estado !== 'completada'
    );
    
    console.log('🔍 DEBUG VALIDACIÓN:', {
      totalTurnos: turnos.length,
      turnosEnProgreso: turnosEnProgreso.length,
      turnosCompletados: turnos.length - turnosEnProgreso.length
    });

    // Obtener jornada actual antes de procesar
    const jornadaActual = await JornadasService.getJornadaActual();
    if (!jornadaActual) {
      showError('Sin jornada activa', 'No se pudo determinar la jornada actual basada en el horario');
      return;
    }

    // Si hay turnos en progreso, mostrar opciones
    if (turnosEnProgreso.length > 0) {
      console.log('🔍 DEBUG TURNOS PARA MODAL:', turnosEnProgreso.map(t => ({ 
        id: t.id, 
        nombre: t.nombre, 
        numero_turno_dia: t.numero_turno_dia,
        estado: t.estado 
      })));
      
      const respuesta = await mostrarModalFinalizacion(turnosEnProgreso);
      
      if (respuesta === 'cancelar') {
        return; // No guardar nada
      } else if (respuesta === 'autocompletar-todos') {
        // Auto-completar todos los turnos y GUARDAR JORNADA
        await completarTurnosAutomaticamente(turnosEnProgreso.map(t => t.id));
        // Recargar turnos después de completar
        await recargarTurnosJornadaActiva();
        // Como se completaron TODOS, proceder a guardar la jornada
      } else if (respuesta === 'seleccionar') {
        // Mostrar modal de selección individual
        const turnosSeleccionados = await mostrarModalSeleccionTurnos(turnosEnProgreso);
        if (!turnosSeleccionados || turnosSeleccionados.length === 0) {
          return; // Usuario canceló la selección
        }
        await completarTurnosAutomaticamente(turnosSeleccionados);
        
        console.log('🔄 ACTUALIZANDO ESTADO LOCAL INMEDIATAMENTE...');
        
        // ⚡ CALCULAR NUEVOS TURNOS ACTUALIZADOS
        const turnosActualizados = turnos.map(turno => {
          if (turnosSeleccionados.includes(turno.id)) {
            console.log(`  🔄 Actualizando estado local del turno ${turno.id}: ${turno.estado} → completado`);
            return { ...turno, estado: 'completado' };
          }
          return turno;
        });
        
        // ⚡ ACTUALIZAR ESTADO INMEDIATAMENTE
        setTurnos(turnosActualizados);
        setForceRender(prev => prev + 1); // Forzar re-render
        console.log('✅ Estado local actualizado inmediatamente, forzando re-render');
        
        // ⚠️ VERIFICAR USANDO LOS TURNOS ACTUALIZADOS (no el estado de React)
        console.log('🔍 Verificando estado usando turnos actualizados...');
        const turnosAunEnProgreso = turnosActualizados.filter(turno => {
          const enProgreso = turno.estado !== 'completado' && turno.estado !== 'completada';
          console.log(`  Turno ${turno.id}: estado=${turno.estado}, enProgreso=${enProgreso}`);
          return enProgreso;
        });
        
        console.log('🔄 Recarga adicional del backend en paralelo...');
        // Recarga del backend en paralelo para confirmación (pero no bloqueante)
        recargarTurnosJornadaActiva().catch(console.error);
        
        if (turnosAunEnProgreso.length > 0) {
          showSuccess(
            '✅ Turnos seleccionados completados', 
            `Quedan ${turnosAunEnProgreso.length} turnos por completar antes de guardar la jornada`
          );
          setGuardandoJornada(false);
          return; // NO guardar jornada todavía
        }
        // Si llegamos aquí, todos los turnos están completados, proceder a guardar
      }
    }

    setGuardandoJornada(true);
    try {
      // Ya tenemos jornadaActual obtenida arriba

      console.log('📋 Guardando jornada:', jornadaActual.nombre, 'con', turnos.length, 'turnos');

      // 🔐 VALIDACIÓN FINAL: Asegurar que todos los turnos estén completados
      const turnosNoCompletados = turnos.filter(turno => 
        turno.estado !== 'completado' && turno.estado !== 'completada'
      );
      
      if (turnosNoCompletados.length > 0) {
        console.error('❌ ERROR: Intentando guardar jornada con turnos no completados:', turnosNoCompletados);
        showError(
          'Error de validación', 
          `No se puede guardar la jornada. Hay ${turnosNoCompletados.length} turnos que no están completados.`
        );
        setGuardandoJornada(false);
        return;
      }

      console.log('✅ Todos los turnos están completados, procediendo a guardar...');

      // Convertir turnos actuales al formato requerido por el nuevo endpoint
      const turnosData = turnos.map(turno => ({
        id: turno.id || '',
        numeroCancha: parseInt(turno.cancha?.id || '1'),
        horaInicio: turno.hora_inicio,
        horaFin: turno.hora_fin,
        estado: 'completado', // 🔐 FORZAR que todos los turnos estén completados al guardar la jornada
        clienteId: turno.socio?.id || undefined,
        clienteNombre: turno.socio?.nombre || undefined,
        monto: 0, // Por defecto, actualizar según tu lógica
        metodoPago: 'efectivo' // Por defecto, actualizar según tu lógica
      }));

      // Debug: verificar ID de jornada activa vs jornadas disponibles
      console.log('🔍 DEBUG JORNADA ACTIVA:', {
        jornadaActual: jornadaActual,
        jornadaActualId: jornadaActual.id,
        jornadaActualIdParsed: parseInt(jornadaActual.id)
      });

      // Llamar al nuevo servicio para guardar la jornada con todos los turnos
      const resultado = await JornadasService.guardarRegistroJornada({
        jornadaConfigId: parseInt(jornadaActual.id),
        fecha: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        turnos: turnosData
      });
      
      console.log('🔍 DEBUG - Resultado completo de guardar jornada:', JSON.stringify(resultado, null, 2));

      // Mostrar resultado con estadísticas
      const stats = resultado.registroDiario.estadisticas;
      showSuccess(
        '✅ Jornada guardada exitosamente',
        `Se registraron ${stats.totalTurnos} turnos (${stats.turnosCompletados} completados). ${resultado.mensaje || 'Los turnos han sido guardados correctamente.'}`
      );

      // Limpiar turnos después de guardar la jornada
      console.log('🧹 Limpiando vista de turnos...');
      setTurnos([]); // Limpiar vista - los turnos están guardados en el backend
      
      // Recargar jornada actual basada en horario REAL (no usar "siguienteJornada" automática)
      setTimeout(async () => {
        console.log('🔄 Recargando jornada actual basada en horario real...');
        try {
          // SIEMPRE obtener la jornada actual basada en la hora actual del sistema
          const jornadaResponse = await JornadasService.getJornadaActual();
          setJornadaActual(jornadaResponse);
          
          const canchasResponse = await canchasService.obtenerCanchas();
          setCanchas(canchasResponse);
          
          if (jornadaResponse) {
            console.log('✅ Jornada activa actual:', jornadaResponse.nombre, '(ID:', jornadaResponse.id, ')');
            console.log('✅ Plano limpio listo para crear nuevos turnos');
          } else {
            console.log('⚠️ No hay jornada activa basada en la hora actual');
          }
        } catch (error) {
          console.error('Error al recargar datos básicos:', error);
        }
      }, 1000);

    } catch (error: any) {
      console.error('❌ Error al guardar jornada:', error);
      showError(
        'Error al guardar jornada',
        error.message || 'No se pudo completar la operación. Verifica tu conexión.'
      );
    } finally {
      setGuardandoJornada(false);
    }
  };

  // Mostrar todos los turnos de la jornada activa - SIN FILTROS COMPLEJOS
  const turnosFiltrados = turnos;

  if (loading) {
    return (
      <AppLayout>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '400px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '3px solid rgba(59, 130, 246, 0.3)',
              borderTop: '3px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p style={{
              fontSize: '16px',
              color: '#9ca3af',
              margin: 0
            }}>
              Cargando turnos...
            </p>
          </div>
        </div>
        <style>
          {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
        </style>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '400px'
        }}>
          <div style={{
            textAlign: 'center',
            maxWidth: '400px',
            padding: '24px'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'rgba(239, 68, 68, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#f9fafb',
              marginBottom: '8px',
              margin: '0 0 8px 0'
            }}>
              Error al cargar los turnos
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#9ca3af',
              marginBottom: '24px',
              margin: '0 0 24px 0'
            }}>
              {error}
            </p>
            <button 
              onClick={cargarDatos}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Reintentar
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Header con controles */}
      <div style={{
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
        borderBottom: '1px solid #374151',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '24px',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            
            {/* Título y Tabs */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <h1 style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  marginBottom: '16px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  margin: 0
                }}>
                  Gestión de Turnos
                </h1>

                {/* Indicador de Jornada Actual */}
                {jornadaActual && (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    marginBottom: '12px'
                  }}>
                    <Clock size={14} style={{ color: '#3b82f6' }} />
                    <span style={{
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#60a5fa'
                    }}>
                      {jornadaActual.nombre} • {jornadaActual.horaInicio} - {jornadaActual.horaFin}
                    </span>
                  </div>
                )}
                
                {/* Tabs */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '16px'
                }}>
                  <button
                    onClick={() => setTabActivo('turnos')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      background: tabActivo === 'turnos' 
                        ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
                        : 'rgba(55, 65, 81, 0.5)',
                      color: tabActivo === 'turnos' ? 'white' : '#9ca3af',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Clock size={16} />
                    Turnos Actuales
                  </button>
                  <button
                    onClick={() => setTabActivo('historial')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      background: tabActivo === 'historial' 
                        ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
                        : 'rgba(55, 65, 81, 0.5)',
                      color: tabActivo === 'historial' ? 'white' : '#9ca3af',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <History size={16} />
                    Registro de Jornadas
                  </button>
                </div>

                <p style={{
                  fontSize: '16px',
                  color: '#9ca3af',
                  margin: 0
                }}>
                  {tabActivo === 'turnos' ? (
                    <>
                      {turnos.length} {turnos.length === 1 ? 'turno registrado' : 'turnos registrados'}
                      {turnosFiltrados.length !== turnos.length && 
                        ` (${turnosFiltrados.length} ${turnosFiltrados.length === 1 ? 'mostrado' : 'mostrados'})`
                      }
                    </>
                  ) : (
                    'Registro completo de jornadas diarias con estadísticas detalladas'
                  )}
                </p>
              </div>

              {/* Botones de acción - solo mostrar en tab de turnos */}
              {tabActivo === 'turnos' && (
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setModalCrearAbierto(true)}
                    disabled={!jornadaActual}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 24px',
                      background: !jornadaActual 
                        ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                        : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: !jornadaActual ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: !jornadaActual 
                        ? '0 4px 12px rgba(107, 114, 128, 0.3)'
                        : '0 4px 12px rgba(59, 130, 246, 0.3)',
                      opacity: !jornadaActual ? 0.7 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (jornadaActual) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (jornadaActual) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                      }
                    }}
                  >
                    <Plus size={20} />
                    {!jornadaActual ? 'Sin Jornada Activa' : 'Crear Turno'}
                  </button>






                  {/* Botón Guardar Jornada - solo mostrar cuando hay turnos */}
                  {turnos.length > 0 && (
                    <button
                      onClick={handleGuardarJornada}
                      disabled={guardandoJornada}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 24px',
                        background: guardandoJornada 
                          ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
                          : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: guardandoJornada ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: guardandoJornada 
                          ? '0 4px 12px rgba(107, 114, 128, 0.3)'
                          : '0 4px 12px rgba(16, 185, 129, 0.3)',
                        opacity: guardandoJornada ? 0.7 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (!guardandoJornada) {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.4)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!guardandoJornada) {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                        }
                      }}
                    >
                      <Save size={20} />
                      {guardandoJornada ? 'Guardando...' : `Guardar Jornada (${turnos.length})`}
                    </button>
                  )}




                </div>
              )}
            </div>

            {/* Controles de filtro y búsqueda - Solo para turnos */}
            {tabActivo === 'turnos' && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  flexWrap: 'wrap'
                }}>
                  {/* Búsqueda */}
                  <div style={{
                    position: 'relative',
                    flex: '1',
                    minWidth: '300px'
                  }}>
                    <Search 
                      size={20}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#9ca3af'
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Buscar por ID, observaciones o cancha..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      style={{
                        width: '100%',
                        paddingLeft: '44px',
                        paddingRight: '16px',
                        paddingTop: '12px',
                        paddingBottom: '12px',
                        background: 'rgba(55, 65, 81, 0.5)',
                        border: '1px solid #374151',
                        borderRadius: '12px',
                        color: '#f9fafb',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#3b82f6';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#374151';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  {/* Filtro de estado */}
                  <div style={{
                    position: 'relative',
                    minWidth: '200px'
                  }}>
                    <Filter 
                      size={20}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#9ca3af',
                        pointerEvents: 'none'
                      }}
                    />
                    <select
                      value={filtroEstado}
                      onChange={(e) => setFiltroEstado(e.target.value)}
                      style={{
                        paddingLeft: '44px',
                        paddingRight: '32px',
                        paddingTop: '12px',
                        paddingBottom: '12px',
                        background: 'rgba(55, 65, 81, 0.5)',
                        border: '1px solid #374151',
                        borderRadius: '12px',
                        color: '#f9fafb',
                        fontSize: '14px',
                        outline: 'none',
                        cursor: 'pointer',
                        minWidth: '200px'
                      }}
                    >
                      <option value="todos">Todos los estados</option>
                      <option value="en_progreso">En Progreso</option>
                      <option value="completado">Completados</option>
                    </select>
                  </div>
                </div>

                {/* Indicador de filtros activos */}
                {(busqueda || filtroEstado !== 'todos') && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '14px',
                    color: '#9ca3af'
                  }}>
                    <span>Filtros activos:</span>
                    {busqueda && (
                      <span style={{
                        background: 'rgba(59, 130, 246, 0.2)',
                        color: '#60a5fa',
                        padding: '4px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        Búsqueda: "{busqueda}"
                      </span>
                    )}
                    {filtroEstado !== 'todos' && (
                      <span style={{
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#34d399',
                        padding: '4px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        Estado: {filtroEstado}
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setBusqueda('');
                        setFiltroEstado('todos');
                      }}
                      style={{
                        color: '#60a5fa',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        textDecoration: 'underline',
                        marginLeft: '8px'
                      }}
                    >
                      Limpiar filtros
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenido condicional según el tab */}
      {tabActivo === 'turnos' ? (
        /* Lista de turnos */
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '32px 24px'
        }}>
          {turnosFiltrados.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '48px 24px'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'rgba(55, 65, 81, 0.5)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h3z" />
                </svg>
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#f9fafb',
                marginBottom: '8px',
                margin: 0
              }}>
                {!jornadaActual 
                  ? 'No hay jornada activa disponible'
                  : (turnos.length === 0 ? 'No hay turnos registrados' : 'No se encontraron turnos')
                }
              </h3>
              <p style={{
                fontSize: '16px',
                color: '#9ca3af',
                marginBottom: '24px',
                margin: '8px 0 24px 0'
              }}>
                {!jornadaActual 
                  ? (siguienteJornada 
                      ? `La siguiente jornada "${siguienteJornada.jornada?.nombre}" inicia ${siguienteJornada.tiempoRestante === 'mañana' ? 'mañana' : `en ${siguienteJornada.tiempoRestante}`} a las ${siguienteJornada.jornada?.horaInicio}`
                      : 'No hay jornadas configuradas para este horario'
                    )
                  : (turnos.length === 0 
                      ? 'Comienza creando tu primer turno' 
                      : 'Prueba ajustando los filtros de búsqueda'
                    )
                }
              </p>
              {turnos.length === 0 && jornadaActual && (
                <button
                  onClick={() => setModalCrearAbierto(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Plus size={20} />
                  Crear Primer Turno
                </button>
              )}
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '24px',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              width: '100%',
              padding: '0 20px'
            }}>
              {turnosFiltrados.map((turno, index) => (
                <TurnoCard
                  key={`${turno.id}-${forceRender}-${turno.estado}`}
                  turno={{
                    ...turno,
                    // Forzar numeración del plano - sobrescribir completamente
                    numero_turno_dia: index + 1,
                    nombre: `Turno - ${String(index + 1).padStart(3, '0')}` // Forzar nombre también
                  }}
                  personalData={personalData}
                  onVer={() => handleVerTurno(turno)}
                  onEditar={() => handleEditarTurno(turno)}
                  onEliminar={() => handleEliminarTurno(turno)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Registro de Jornadas */
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '32px 24px'
        }}>
          <RegistroJornadas />
        </div>
      )}

      {/* Modales */}
      <CrearTurnoModal
        isOpen={modalCrearAbierto}
        onClose={() => setModalCrearAbierto(false)}
        onTurnoCreated={async () => {
          console.log('🎉 Turno creado exitosamente, recargando jornada...');
          await recargarTurnosJornadaActiva();
        }}
      />

      <VerTurnoModal
        isOpen={verTurnoModal.abierto}
        onClose={() => setVerTurnoModal({ abierto: false, turno: null })}
        turno={verTurnoModal.turno}
        personalData={personalData}
      />

      <EditarTurnoModal
        isOpen={editarTurnoModal.abierto}
        onClose={() => setEditarTurnoModal({ abierto: false, turno: null })}
        onSave={handleActualizarTurno}
        turno={editarTurnoModal.turno}
        canchas={canchas}
      />

      <EliminarTurnoModal
        isOpen={eliminarTurnoModal.abierto}
        onClose={() => setEliminarTurnoModal({ abierto: false, turno: null })}
        onConfirm={handleConfirmarEliminar}
        turno={eliminarTurnoModal.turno}
      />

      {/* Modal de Finalización de Jornada */}
      {modalFinalizacionAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 max-w-4xl w-full mx-4 border border-gray-600 shadow-2xl relative">
            {/* Botón X para cerrar */}
            <button
              onClick={() => handleFinalizacionResponse('cancelar')}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-colors"
            >
              ✕
            </button>

            {/* Header */}
            <div className="text-center mb-6 pr-8">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Turnos Pendientes
              </h3>
              <p className="text-gray-300">
                Hay <span className="font-bold text-yellow-400">{turnosParaCompletar.length} turnos en progreso</span> que deben completarse antes de guardar la jornada.
              </p>
            </div>
            
            {/* Lista de turnos con distribución mejorada */}
            <div className="bg-gray-900/50 rounded-lg p-4 mb-6 border border-gray-700">
              <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                📋 Turnos a completar:
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {turnosParaCompletar.map((turno, index) => (
                  <div key={turno.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-yellow-400 text-sm font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="text-white font-medium truncate">{`Turno - ${String(index + 1).padStart(3, '0')}`}</div>
                          <div className="px-2 py-1 bg-yellow-900/50 text-yellow-300 rounded text-xs font-medium flex-shrink-0">
                            En Progreso
                          </div>
                        </div>
                        <div className="text-sm text-gray-400 space-y-1">
                          <div className="flex items-center gap-1">
                            <span>🏟️</span>
                            <span className="truncate">{turno.cancha?.nombre || 'Cancha N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>⏰</span>
                            <span>{turno.hora_inicio} - {turno.hora_fin}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Pregunta */}
            <div className="text-center mb-6">
              <p className="text-gray-300 font-medium">
                ¿Qué deseas hacer con estos turnos?
              </p>
            </div>

            {/* Botones de acción - Distribución mejorada */}
            <div className="space-y-4">
              {/* Fila superior - Dos botones lado a lado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => handleFinalizacionResponse('autocompletar-todos')}
                  className="px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-3 font-semibold shadow-lg hover:shadow-green-500/25 transform hover:scale-[1.02]"
                >
                  <span className="text-xl">✅</span>
                  <div className="text-center md:text-left">
                    <div>Completar TODOS automáticamente</div>
                    <div className="text-sm text-green-200 opacity-90">Marcar todos como completados</div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleFinalizacionResponse('seleccionar')}
                  className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-3 font-semibold shadow-lg hover:shadow-blue-500/25 transform hover:scale-[1.02]"
                >
                  <span className="text-xl">🎯</span>
                  <div className="text-center md:text-left">
                    <div>Seleccionar cuáles completar</div>
                    <div className="text-sm text-blue-200 opacity-90">Elegir turnos específicos</div>
                  </div>
                </button>
              </div>
              
              {/* Fila inferior - Un botón centrado */}
              <div className="flex justify-center">
                <button
                  onClick={() => handleFinalizacionResponse('cancelar')}
                  className="w-full max-w-md px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-3 font-semibold shadow-lg hover:shadow-gray-500/25 transform hover:scale-[1.02]"
                >
                  <span className="text-xl">❌</span>
                  <div className="text-center">
                    <div>Cancelar guardado</div>
                    <div className="text-sm text-gray-300 opacity-90">No guardar la jornada ahora</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Selección Individual */}
      {modalSeleccionAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 max-w-4xl w-full mx-4 border border-gray-600 shadow-2xl relative">
            {/* Botón X para cerrar */}
            <button
              onClick={() => setModalSeleccionAbierto(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-colors"
            >
              ✕
            </button>

            {/* Header */}
            <div className="text-center mb-6 pr-8">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Seleccionar Turnos a Completar
              </h3>
              <p className="text-gray-300">
                Marca los turnos que deseas completar automáticamente
              </p>
            </div>
            
            {/* Lista de turnos seleccionables */}
            <div className="mb-6">
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                    📋 Turnos disponibles:
                  </h4>
                  <div className="text-xs text-gray-400">
                    {turnosSeleccionados.length} de {turnosParaCompletar.length} seleccionados
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-80 overflow-y-auto">
                  {turnosParaCompletar.map((turno, index) => {
                    const isSelected = turnosSeleccionados.includes(turno.id);
                    return (
                      <label 
                        key={turno.id} 
                        className={`flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                          isSelected 
                            ? 'bg-blue-900/30 border-blue-500 shadow-lg shadow-blue-500/20' 
                            : 'bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 mt-1 ${
                          isSelected 
                            ? 'bg-blue-500 border-blue-500' 
                            : 'border-gray-500 hover:border-blue-400'
                        }`}>
                          {isSelected && <span className="text-white text-sm">✓</span>}
                        </div>
                        
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setTurnosSeleccionados([...turnosSeleccionados, turno.id]);
                            } else {
                              setTurnosSeleccionados(turnosSeleccionados.filter(id => id !== turno.id));
                            }
                          }}
                          className="hidden"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-7 h-7 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-yellow-400 text-xs font-bold">{index + 1}</span>
                              </div>
                              <div className="text-white font-semibold truncate">{`Turno - ${String(index + 1).padStart(3, '0')}`}</div>
                            </div>
                            <div className="px-2 py-1 bg-yellow-900/50 text-yellow-300 rounded text-xs font-medium flex-shrink-0">
                              En Progreso
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-400 space-y-1">
                            <div className="flex items-center gap-1">
                              <span>🏟️</span>
                              <span className="truncate">{turno.cancha?.nombre || 'Cancha N/A'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>⏰</span>
                              <span>{turno.hora_inicio} - {turno.hora_fin}</span>
                            </div>
                            {turno.socio && (
                              <div className="flex items-center gap-1">
                                <span>👤</span>
                                <span className="truncate text-xs">{turno.socio.nombre} {turno.socio.apellido}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Botones de acción - Distribución mejorada */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleSeleccionResponse(turnosSeleccionados)}
                disabled={turnosSeleccionados.length === 0}
                className={`px-6 py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 font-semibold shadow-lg transform hover:scale-[1.02] ${
                  turnosSeleccionados.length === 0
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white hover:shadow-green-500/25'
                }`}
              >
                <span className="text-xl">✅</span>
                <div className="text-center">
                  <div>Completar Seleccionados</div>
                  <div className="text-sm opacity-90">
                    {turnosSeleccionados.length === 0 ? 'Selecciona al menos uno' : `${turnosSeleccionados.length} turno${turnosSeleccionados.length > 1 ? 's' : ''}`}
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => handleSeleccionResponse([])}
                className="px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-3 font-semibold shadow-lg hover:shadow-gray-500/25 transform hover:scale-[1.02]"
              >
                <span className="text-xl">❌</span>
                <div className="text-center">
                  <div>Cancelar</div>
                  <div className="text-sm text-gray-300 opacity-90">No completar ninguno</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Estilos para la animación de spin */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </AppLayout>
  );
};