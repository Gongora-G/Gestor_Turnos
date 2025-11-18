import { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Save, Trash2, RefreshCw, AlertTriangle } from 'lucide-react';
import configuracionJornadasService from '../services/configuracionJornadasService';
import type { ConfiguracionJornadas, JornadaConfig, DiaSemana } from '../types/jornadas-config';
import { useToast } from '../contexts/ToastContext';

// Modal de confirmación de eliminación
interface ConfirmDeleteModalProps {
  isOpen: boolean;
  jornada: JornadaConfig | null;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDeleteModal({ isOpen, jornada, onConfirm, onCancel }: ConfirmDeleteModalProps) {
  if (!isOpen || !jornada) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700 animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white">Confirmar Eliminación</h3>
          </div>
          
          <p className="text-gray-300 mb-4">
            ¿Estás seguro de que deseas eliminar la siguiente jornada?
          </p>
          
          <div className="bg-gray-700 rounded-lg p-4 mb-4 border border-gray-600">
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: jornada.color || '#3B82F6' }}
              />
              <span className="text-white font-semibold">{jornada.nombre} ({(jornada as any).codigo || 'Sin código'})</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{(jornada as any).horaInicio} - {(jornada as any).horaFin}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-400 mb-6">
            <strong>Nota:</strong> Este cambio no será permanente hasta que presiones 
            "Actualizar Configuración".
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Eliminar Jornada
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfiguracionJornadasSimple() {
  const { success, error, warning } = useToast();
  
  // Estado del modal de eliminación
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    jornadaIndex: number | null;
    jornada: JornadaConfig | null;
  }>({
    isOpen: false,
    jornadaIndex: null,
    jornada: null
  });

  // Estado para conflictos de horario
  const [conflictos, setConflictos] = useState<{
    hayConflicto: boolean;
    mensaje: string;
    jornadasConflicto: string[];
    espaciosDisponibles: string[];
  } | null>(null);
  
  // Estados principales
  const [configuracion, setConfiguracion] = useState<ConfiguracionJornadas>({
    nombre: 'Configuración Tennis Club',
    descripcion: 'Esquema de dos jornadas: Jornada A y Jornada B',
    esquema_tipo: 'dos',
    activa: true,
    jornadas: [
      {
        id: `temp-${Date.now()}-1`,
        nombre: 'Jornada A',
        codigo: 'A',
        descripcion: 'Primera jornada del día',
        horaInicio: '07:00 AM',
        horaFin: '12:00 PM',
        horario: { horaInicio: '07:00 AM', horaFin: '12:00 PM' },
        orden: 1,
        activa: true,
        diasSemana: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] as DiaSemana[],
        color: '#3B82F6'
      } as any,
      {
        id: `temp-${Date.now()}-2`,
        nombre: 'Jornada B',
        codigo: 'B',
        descripcion: 'Segunda jornada del día',
        horaInicio: '03:00 PM',
        horaFin: '09:00 PM',
        horario: { horaInicio: '03:00 PM', horaFin: '09:00 PM' },
        orden: 2,
        activa: true,
        diasSemana: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] as DiaSemana[],
        color: '#10B981'
      } as any
    ]
  } as any);

  const [loading, setLoading] = useState(false);
  const [loadingInicial, setLoadingInicial] = useState(true);

  // Configuraciones predefinidas
  const tiposEsquema = [
    { value: 'una', label: 'Una Jornada (24h)' },
    { value: 'dos', label: 'Dos Jornadas (12h cada una)' },
    { value: 'tres', label: 'Tennis Club (Jornada A + Jornada B)' },
    { value: 'personalizado', label: 'Personalizado' }
  ];

  // Componente selector de tiempo con formato 12h - UN SOLO SELECTOR UNIFICADO
  const TimeSelector12h = ({ value, onChange, label }: { value: string, onChange: (time: string) => void, label: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hora, setHora] = useState('12');
    const [minutos, setMinutos] = useState('00');
    const [periodo, setPeriodo] = useState('AM');

    // Inicializar desde el valor actual
    useEffect(() => {
      if (value && value.includes(' ')) {
        const [time, period] = value.split(' ');
        const [h, m] = time.split(':');
        setHora(h);
        setMinutos(m);
        setPeriodo(period);
      }
    }, [value]);

    const handleChange = (newHora: string, newMinutos: string, newPeriodo: string) => {
      setHora(newHora);
      setMinutos(newMinutos);
      setPeriodo(newPeriodo);
      onChange(`${newHora}:${newMinutos} ${newPeriodo}`);
    };

    return (
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center gap-2 bg-gray-800/90 border border-gray-600 rounded-lg px-3 py-2.5 hover:bg-gray-800 transition-colors"
          >
            <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-white text-sm font-medium flex-grow text-left">
              {hora} : {minutos} {periodo}
            </span>
            <svg 
              className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute z-50 mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg shadow-xl p-3">
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Hora</label>
                  <select
                    value={hora}
                    onChange={(e) => handleChange(e.target.value, minutos, periodo)}
                    className="w-full px-2 py-1.5 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Array.from({ length: 12 }, (_, i) => {
                      const h = (i + 1).toString();
                      return <option key={h} value={h}>{h}</option>;
                    })}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Min</label>
                  <select
                    value={minutos}
                    onChange={(e) => handleChange(hora, e.target.value, periodo)}
                    className="w-full px-2 py-1.5 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {['00', '15', '30', '45'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Período</label>
                  <select
                    value={periodo}
                    onChange={(e) => handleChange(hora, minutos, e.target.value)}
                    className="w-full px-2 py-1.5 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
              >
                Listo
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Efecto para cargar datos iniciales
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      setLoadingInicial(true);
      try {
        console.log('🔄 Cargando configuración de jornadas desde la base de datos...');
        const configuracionActiva = await configuracionJornadasService.obtenerConfiguracionActiva();
        
        if (configuracionActiva && configuracionActiva.jornadas && configuracionActiva.jornadas.length > 0) {
          console.log('✅ Configuración cargada:', configuracionActiva);
          
          // Convertir horas de 24h (backend) a 12h (frontend)
          const jornadasConvertidas = configuracionActiva.jornadas.map((jornada: any) => ({
            ...jornada,
            codigo: jornada.codigo || '',
            horaInicio: convertirA12Horas(jornada.hora_inicio || jornada.horaInicio || '00:00'),
            horaFin: convertirA12Horas(jornada.hora_fin || jornada.horaFin || '00:00'),
            diasSemana: jornada.diasSemana || ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
          }));
          
          setConfiguracion({
            ...configuracionActiva,
            esquemaTipo: (configuracionActiva as any).esquema_tipo || 'personalizado', // Asegurar que siempre tenga un valor
            jornadas: jornadasConvertidas
          } as ConfiguracionJornadas);
          
          console.log('✅ Configuración establecida en el estado');
        } else {
          console.log('ℹ️ No se encontró configuración activa, usando valores por defecto');
        }
      } catch (err) {
        console.error('❌ Error al cargar datos iniciales:', err);
      } finally {
        setLoadingInicial(false);
      }
    };

    cargarDatosIniciales();
  }, []);

  // Efecto para validar conflictos cuando cambien las jornadas
  useEffect(() => {
    if (configuracion.jornadas.length > 1) {
      validarConflictosHorario();
    } else {
      setConflictos(null);
    }
  }, [configuracion.jornadas]);

  // Función para convertir de 12h a 24h para el backend
  const convertirA24Horas = (hora12: string): string => {
    if (!hora12) return '00:00';
    
    const [time, period] = hora12.split(' ');
    const [horas, minutos] = time.split(':');
    let hora24 = parseInt(horas);
    
    if (period === 'PM' && hora24 !== 12) {
      hora24 += 12;
    } else if (period === 'AM' && hora24 === 12) {
      hora24 = 0;
    }
    
    return `${hora24.toString().padStart(2, '0')}:${minutos}`;
  };

  // Función para convertir hora a minutos totales del día (para comparaciones)
  const horaAMinutos = (hora12: string): number => {
    const hora24 = convertirA24Horas(hora12);
    const [horas, minutos] = hora24.split(':').map(Number);
    return horas * 60 + minutos;
  };

  // Función para validar conflictos de horario
  const validarConflictosHorario = (): boolean => {
    const jornadas = configuracion.jornadas as any[];
    
    // Verificar cada jornada contra las demás
    for (let i = 0; i < jornadas.length; i++) {
      const jornadaA = jornadas[i];
      const inicioA = horaAMinutos(jornadaA.horaInicio);
      const finA = horaAMinutos(jornadaA.horaFin);
      
      const jornadasConflicto: string[] = [];
      
      for (let j = 0; j < jornadas.length; j++) {
        if (i === j) continue;
        
        const jornadaB = jornadas[j];
        const inicioB = horaAMinutos(jornadaB.horaInicio);
        const finB = horaAMinutos(jornadaB.horaFin);
        
        // Verificar si hay superposición
        const haySuperposicion = (inicioA < finB && finA > inicioB);
        
        if (haySuperposicion) {
          jornadasConflicto.push(`${jornadaB.nombre} (${jornadaB.horaInicio} - ${jornadaB.horaFin})`);
        }
      }
      
      if (jornadasConflicto.length > 0) {
        // Calcular espacios disponibles
        const espaciosDisponibles = calcularEspaciosDisponibles(jornadas, i);
        
        setConflictos({
          hayConflicto: true,
          mensaje: `Las jornadas ${jornadaA.nombre} (${jornadaA.horaInicio} - ${jornadaA.horaFin}) y ${jornadasConflicto.join(', ')} se superponen.`,
          jornadasConflicto: jornadasConflicto,
          espaciosDisponibles: espaciosDisponibles
        });
        
        return false;
      }
    }
    
    // No hay conflictos
    setConflictos(null);
    return true;
  };

  // Función para calcular espacios disponibles
  const calcularEspaciosDisponibles = (jornadas: any[], indexExcluir: number): string[] => {
    // Ordenar jornadas por hora de inicio (excluyendo la jornada actual)
    const jornadasOrdenadas = jornadas
      .map((j, idx) => ({ ...j, originalIndex: idx }))
      .filter((_, idx) => idx !== indexExcluir)
      .sort((a, b) => horaAMinutos(a.horaInicio) - horaAMinutos(b.horaInicio));
    
    const espacios: string[] = [];
    
    // Espacio antes de la primera jornada
    if (jornadasOrdenadas.length > 0) {
      const primeraHora = horaAMinutos(jornadasOrdenadas[0].horaInicio);
      if (primeraHora > 0) {
        espacios.push(`12:00 AM - ${jornadasOrdenadas[0].horaInicio}`);
      }
    } else {
      espacios.push('12:00 AM - 11:59 PM (Todo el día disponible)');
      return espacios;
    }
    
    // Espacios entre jornadas
    for (let i = 0; i < jornadasOrdenadas.length - 1; i++) {
      const finActual = horaAMinutos(jornadasOrdenadas[i].horaFin);
      const inicioSiguiente = horaAMinutos(jornadasOrdenadas[i + 1].horaInicio);
      
      if (inicioSiguiente > finActual) {
        espacios.push(`${jornadasOrdenadas[i].horaFin} - ${jornadasOrdenadas[i + 1].horaInicio}`);
      }
    }
    
    // Espacio después de la última jornada
    const ultimaHora = horaAMinutos(jornadasOrdenadas[jornadasOrdenadas.length - 1].horaFin);
    if (ultimaHora < 1440) { // 1440 minutos = 24 horas
      espacios.push(`${jornadasOrdenadas[jornadasOrdenadas.length - 1].horaFin} - 11:59 PM`);
    }
    
    return espacios;
  };

  // Función para convertir de 24h a 12h para el frontend
  const convertirA12Horas = (hora24: string): string => {
    if (!hora24) return '12:00 AM';
    
    const [horas, minutos] = hora24.split(':');
    const hora = parseInt(horas);
    const periodo = hora >= 12 ? 'PM' : 'AM';
    const hora12 = hora === 0 ? 12 : hora > 12 ? hora - 12 : hora;
    
    return `${hora12}:${minutos} ${periodo}`;
  };

  // Manejadores de eventos
  const handleConfiguracionChange = (field: any, value: any) => {
    setConfiguracion((prev: ConfiguracionJornadas) => {
      const prevAny = prev as any;
      const nueva = { 
        ...prevAny, 
        [field]: value,
        // Mantener campos importantes
        nombre: field === 'nombre' ? value : prevAny.nombre,
        descripcion: field === 'descripcion' ? value : prevAny.descripcion,
        esquema_tipo: field === 'esquema_tipo' || field === 'esquemaTipo' ? value : prevAny.esquema_tipo,
        activa: field === 'activa' ? value : prevAny.activa
      };
      
      if (field === 'esquemaTipo' || field === 'esquema_tipo') {
        aplicarEsquemaPredefinido(value);
      }
      
      return nueva as ConfiguracionJornadas;
    });
  };

  const handleJornadaChange = (index: number, field: any, value: any) => {
    setConfiguracion((prev: ConfiguracionJornadas) => {
      const nuevasJornadas = [...prev.jornadas] as any[];
      nuevasJornadas[index] = { ...nuevasJornadas[index], [field]: value };
      
      return { ...prev, jornadas: nuevasJornadas as any };
    });
  };

  const agregarJornada = () => {
    if (configuracion.jornadas.length >= 5) {
      warning('Límite alcanzado', 'No puedes tener más de 5 jornadas en una configuración');
      return;
    }
    
    // Generar letra del alfabeto para la nueva jornada
    const letraAlfabeto = String.fromCharCode(65 + configuracion.jornadas.length); // A, B, C, D, E
    
    // Colores predefinidos para cada jornada
    const coloresPredefinidos = ['#3B82F6', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6'];
    const colorJornada = coloresPredefinidos[configuracion.jornadas.length] || '#6B7280';
    
    setConfiguracion((prev: ConfiguracionJornadas) => ({
      ...prev,
      jornadas: [...prev.jornadas, {
        id: `temp-${Date.now()}`,
        codigo: letraAlfabeto,
        nombre: `Jornada ${letraAlfabeto}`,
        descripcion: `Descripción de la jornada ${letraAlfabeto}`,
        horaInicio: '12:00 AM',
        horaFin: '08:00 AM',
        orden: prev.jornadas.length + 1,
        activa: true,
        diasSemana: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] as DiaSemana[],
        color: colorJornada,
        horario: {
          horaInicio: '00:00',
          horaFin: '08:00'
        }
      } as any]
    } as ConfiguracionJornadas));
  };

  const eliminarJornada = (index: number) => {
    if (configuracion.jornadas.length <= 1) {
      warning('No se puede eliminar', 'Debe haber al menos una jornada en la configuración');
      return;
    }
    
    // Abrir modal de confirmación
    setDeleteModal({
      isOpen: true,
      jornadaIndex: index,
      jornada: configuracion.jornadas[index]
    });
  };

  const confirmarEliminacion = () => {
    if (deleteModal.jornadaIndex === null) return;
    
    setConfiguracion((prev: ConfiguracionJornadas) => {
      const nuevasJornadas = prev.jornadas.filter((_: JornadaConfig, i: number) => i !== deleteModal.jornadaIndex)
        .map((jornada, i) => {
          // Regenerar códigos alfabéticos al eliminar
          const letraAlfabeto = String.fromCharCode(65 + i); // A, B, C, etc.
          return { 
            ...jornada, 
            orden: i + 1,
            codigo: letraAlfabeto
          };
        });
      
      return { ...prev, jornadas: nuevasJornadas };
    });
    
    // Cerrar modal
    setDeleteModal({ isOpen: false, jornadaIndex: null, jornada: null });
    success('Jornada eliminada', 'La jornada ha sido removida de la configuración');
  };

  const aplicarEsquemaPredefinido = (tipo: string) => {
    let nuevasJornadas: any[] = [];
    
    switch (tipo) {
      case 'una':
        nuevasJornadas = [{
          id: `temp-${Date.now()}-1`,
          nombre: 'Jornada A',
          descripcion: 'Jornada completa de 24 horas',
          horaInicio: '12:00 AM',
          horaFin: '11:45 PM',
          orden: 1,
          activa: true,
          diasSemana: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] as DiaSemana[],
          color: '#3B82F6',
          horario: { horaInicio: '00:00', horaFin: '23:45' }
        }];
        break;
        
      case 'dos':
        nuevasJornadas = [
          {
            id: `temp-${Date.now()}-1`,
            nombre: 'Jornada A',
            descripcion: 'Primera jornada del día',
            horaInicio: '07:00 AM',
            horaFin: '12:00 PM',
            orden: 1,
            activa: true,
            diasSemana: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] as DiaSemana[],
            color: '#3B82F6',
            horario: { horaInicio: '07:00', horaFin: '12:00' }
          },
          {
            id: `temp-${Date.now()}-2`,
            nombre: 'Jornada B',
            descripcion: 'Segunda jornada del día',
            horaInicio: '03:00 PM',
            horaFin: '09:00 PM',
            orden: 2,
            activa: true,
            diasSemana: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] as DiaSemana[],
            color: '#10B981',
            horario: { horaInicio: '15:00', horaFin: '21:00' }
          }
        ];
        break;
        
      case 'tres':
        nuevasJornadas = [
          {
            id: `temp-${Date.now()}-1`,
            nombre: 'Jornada A',
            descripcion: 'Primera jornada del día',
            horaInicio: '07:00 AM',
            horaFin: '12:00 PM',
            orden: 1,
            activa: true,
            diasSemana: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] as DiaSemana[],
            color: '#3B82F6',
            horario: { horaInicio: '07:00', horaFin: '12:00' }
          },
          {
            id: `temp-${Date.now()}-2`,
            nombre: 'Jornada B',
            descripcion: 'Segunda jornada del día',
            horaInicio: '03:00 PM',
            horaFin: '09:00 PM',
            orden: 2,
            activa: true,
            diasSemana: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] as DiaSemana[],
            color: '#10B981',
            horario: { horaInicio: '15:00', horaFin: '21:00' }
          }
        ];
        break;
    }
    
    if (nuevasJornadas.length > 0) {
      setConfiguracion((prev: ConfiguracionJornadas) => ({ ...prev, jornadas: nuevasJornadas }));
    }
  };

  // Función para guardar configuración
  const guardarConfiguracion = async () => {
    if (!(configuracion as any).nombre?.trim()) {
      error('Nombre requerido', 'Debes proporcionar un nombre para la configuración');
      return;
    }

    // Validar conflictos de horario antes de guardar
    if (!validarConflictosHorario()) {
      error('Conflicto de horarios', 'Las jornadas tienen horarios que se superponen. Por favor corrige los conflictos antes de guardar.');
      return;
    }

    setLoading(true);
    try {
      // Preparar jornadas para el backend (convertir a formato 24h)
      const jornadasParaBackend = configuracion.jornadas.map((j: any) => ({
        codigo: j.codigo || '',
        nombre: j.nombre,
        descripcion: j.descripcion || '',
        horaInicio: convertirA24Horas(j.horaInicio || j.horario?.horaInicio || ''),
        horaFin: convertirA24Horas(j.horaFin || j.horario?.horaFin || ''),
        activa: j.activa !== undefined ? j.activa : true,
        diasSemana: j.diasSemana || ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] as DiaSemana[],
        color: j.color || '#3B82F6'
      }));

      console.log('Enviando jornadas al backend (24h format):', jornadasParaBackend);
      console.log('Configuración completa:', configuracion);
      console.log('esquema_tipo:', (configuracion as any).esquema_tipo);

      let resultado: ConfiguracionJornadas | undefined;
      
      if (configuracion.id) {
        resultado = await configuracionJornadasService.actualizarConfiguracion(Number((configuracion as any).id), {
          nombre: (configuracion as any).nombre || '',
          descripcion: (configuracion as any).descripcion || '',
          esquema_tipo: (configuracion as any).esquema_tipo || 'dos',
          activa: (configuracion as any).activa !== undefined ? (configuracion as any).activa : true,
          jornadas: jornadasParaBackend
        });
        success('Configuración actualizada', 'Los cambios se han guardado correctamente');
      } else {
        resultado = await configuracionJornadasService.crearConfiguracion({
          nombre: (configuracion as any).nombre || '',
          descripcion: (configuracion as any).descripcion || '',
          esquema_tipo: (configuracion as any).esquema_tipo || 'dos',
          activa: (configuracion as any).activa !== undefined ? (configuracion as any).activa : true,
          jornadas: jornadasParaBackend
        });
        success('Configuración creada', 'La nueva configuración se ha guardado correctamente');
        
        // Actualizar el ID de la configuración creada
        if (resultado?.id) {
          setConfiguracion(prev => ({ ...prev, id: resultado!.id } as any));
        }
      }
      
    } catch (err: any) {
      console.error('❌ Error completo al guardar configuración:', err);
      console.error('❌ Error response:', err.response);
      console.error('❌ Error data:', err.response?.data);
      
      // Manejo específico de errores según el tipo
      if (err.response?.status === 400) {
        const mensajeDetallado = err.response.data?.message || JSON.stringify(err.response.data) || 'Los datos proporcionados no son válidos';
        console.error('❌ Error 400 detallado:', mensajeDetallado);
        error('Error de validación', mensajeDetallado);
      } else if (err.response?.status === 409) {
        error('Conflicto de datos', 'Ya existe una configuración con este nombre o características similares');
      } else if (err.response?.status === 500) {
        error('Error del servidor', 'Hubo un problema interno. Intenta nuevamente en unos momentos');
      } else {
        error('Error al guardar', err.message || 'No se pudo guardar la configuración. Verifica tu conexión e intenta nuevamente');
      }
    } finally {
      setLoading(false);
    }
  };

  // Pantalla de carga inicial
  if (loadingInicial) {
    return (
      <div className="max-w-6xl mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Modal de confirmación de eliminación */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        jornada={deleteModal.jornada}
        onConfirm={confirmarEliminacion}
        onCancel={() => setDeleteModal({ isOpen: false, jornadaIndex: null, jornada: null })}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-8 h-8 text-blue-500" />
            Sistema de Jornadas
          </h1>
          <p className="text-gray-400 mt-1">
            Gestione completamente sus esquemas de jornadas y horarios para su club
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </button>
        </div>
      </div>

      {/* Configuración */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
          Configuración de Jornadas
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nombre de la configuración
            </label>
            <input
              type="text"
              value={(configuracion as any).nombre || ''}
              onChange={(e) => handleConfiguracionChange('nombre' as any, e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Configuración Tennis Club"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tipo de esquema
            </label>
            <select
              value={(configuracion as any).esquema_tipo || ''}
              onChange={(e) => {
                handleConfiguracionChange('esquema_tipo' as any, e.target.value);
                aplicarEsquemaPredefinido(e.target.value);
              }}
              className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
            >
              {tiposEsquema.map(tipo => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Descripción
          </label>
          <textarea
            value={(configuracion as any).descripcion || ''}
            onChange={(e) => handleConfiguracionChange('descripcion' as any, e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            placeholder="Esquema de dos jornadas: Jornada A y Jornada B"
          />
        </div>

        {/* Jornadas */}
        <div className="flex items-center justify-between mb-4 mt-8">
          <div>
            <h4 className="text-base font-semibold text-white">
              Jornadas ({configuracion.jornadas.length})
            </h4>
            <p className="text-gray-400 text-sm">Configure los horarios de cada jornada</p>
          </div>
          <button
            onClick={agregarJornada}
            disabled={configuracion.jornadas.length >= 5}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-4 h-4" />
            Agregar Jornada
          </button>
        </div>

        <div className="space-y-4">
          {configuracion.jornadas.map((jornada: JornadaConfig, index: number) => (
            <div key={`jornada-${index}`} className="bg-gray-700/50 border border-gray-600 rounded-lg p-5 hover:border-gray-500 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full shadow-lg" 
                    style={{ backgroundColor: jornada.color || '#3B82F6' }}
                  />
                  <span className="text-white font-semibold text-base">{jornada.nombre}</span>
                </div>
                {configuracion.jornadas.length > 1 && (
                  <button
                    onClick={() => eliminarJornada(index)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all"
                    title="Eliminar jornada"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Código</label>
                  <input
                    type="text"
                    value={(jornada as any).codigo || ''}
                    onChange={(e) => handleJornadaChange(index, 'codigo' as any, e.target.value)}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="A"
                    maxLength={3}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Nombre</label>
                  <input
                    type="text"
                    value={jornada.nombre}
                    onChange={(e) => handleJornadaChange(index, 'nombre', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Jornada A"
                  />
                </div>
                
                <TimeSelector12h
                  value={(jornada as any).horaInicio || ''}
                  onChange={(time) => handleJornadaChange(index, 'horaInicio', time)}
                  label="Hora Inicio"
                />
                
                <TimeSelector12h
                  value={(jornada as any).horaFin || ''}
                  onChange={(time) => handleJornadaChange(index, 'horaFin', time)}
                  label="Hora Fin"
                />
              </div>

              <div className="mt-3 pt-3 border-t border-gray-600">
                <div className="text-xs text-gray-400 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>Duración: {(jornada as any).horaInicio || ''} - {(jornada as any).horaFin || ''}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Alerta de conflicto de horarios */}
        {conflictos && conflictos.hayConflicto && (
          <div className="mt-4 bg-red-900/20 border border-red-500 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-grow">
                <h4 className="text-red-400 font-semibold text-sm mb-2 flex items-center gap-2">
                  <span>Conflicto de Horarios</span>
                  <button
                    onClick={() => setConflictos(null)}
                    className="ml-auto text-red-400 hover:text-red-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </h4>
                <p className="text-red-300 text-sm mb-3">
                  ❌ CONFLICTO: {conflictos.mensaje}
                </p>
                <div className="bg-gray-800/50 rounded p-3 border border-gray-700">
                  <p className="text-green-400 text-xs font-semibold mb-2">✅ ESPACIOS DISPONIBLES:</p>
                  <ul className="space-y-1">
                    {conflictos.espaciosDisponibles.map((espacio, idx) => (
                      <li key={idx} className="text-gray-300 text-xs flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                        {espacio}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6 pt-6 border-t border-gray-700">
          <button
            onClick={guardarConfiguracion}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save className={`w-5 h-5 ${loading ? 'animate-pulse' : ''}`} />
            {loading ? 'Guardando...' : 'Guardar Configuración'}
          </button>
        </div>
      </div>
    </div>
  );
}