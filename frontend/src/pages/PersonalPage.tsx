import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Edit,
  Trash2,
  Phone,
  Mail,
  Clock,
  UserCheck,
  Activity
} from 'lucide-react';
import { GlobalNavigation, GlobalFooter } from '../components';
import GestionEstadosPersonal from '../components/GestionEstadosPersonal';
import { apiService } from '../services/api';
import type { PersonalUnificado } from '../services/personalUnificadoService';
import { tiposPersonalService } from '../services/tiposPersonalService';
import type { TipoPersonal, CampoPersonalizado } from '../services/tiposPersonalService';
import { useToast } from '../contexts/ToastContext';

interface JornadaConfig {
  id: number;
  codigo: string;
  nombre: string;
  horaInicio: string;
  horaFin: string;
  color: string;
  orden: number;
  activa: boolean;
  descripcion?: string;
}

export const PersonalPage: React.FC = () => {
  const [personal, setPersonal] = useState<PersonalUnificado[]>([]);
  const [tipos, setTipos] = useState<TipoPersonal[]>([]);
  const [jornadas, setJornadas] = useState<JornadaConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [selectedItem, setSelectedItem] = useState<PersonalUnificado | null>(null);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PersonalUnificado | null>(null);
  const [tabActual, setTabActual] = useState<'personal' | 'estados'>('personal');
  const toast = useToast();

  // Obtener el clubId del usuario actual (ajustar según tu implementación)
  const clubId = localStorage.getItem('clubId') || 'default-club-id';

  // Estado del formulario con datos específicos dinámicos
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    datosEspecificos: {} as Record<string, any>,
    jornadaAsignadaId: null as number | null,
  });

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  useEffect(() => {
    cargarPersonal();
  }, [filtroTipo]);

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);
      const tiposData = await tiposPersonalService.getAllActivos(clubId);
      setTipos(tiposData);
      
      if (tiposData.length > 0) {
        setTipoSeleccionado(tiposData[0].id);
      }
      
      // Cargar jornadas disponibles
      try {
        const jornadasData = await apiService.get<JornadaConfig[]>('/jornadas/configuradas');
        console.log('✅ Jornadas cargadas:', jornadasData);
        const jornadasActivas = jornadasData.filter(j => j.activa);
        console.log('✅ Jornadas activas filtradas:', jornadasActivas);
        setJornadas(jornadasActivas);
      } catch (jornadaError) {
        console.error('❌ Error al cargar jornadas:', jornadaError);
        toast.error('No se pudieron cargar las jornadas');
      }
      
      await cargarPersonal();
    } catch (error) {
      toast.error('Error al cargar datos iniciales');
    } finally {
      setLoading(false);
    }
  };

  const cargarPersonal = async () => {
    try {
      const data = await apiService.get<PersonalUnificado[]>('/personal');
      console.log('✅ Personal cargado en página:', data);
      setPersonal(data);
    } catch (error) {
      toast.error('Error al cargar personal');
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      apellido: '',
      telefono: '',
      email: '',
      datosEspecificos: {},
      jornadaAsignadaId: null,
    });
    setSelectedItem(null);
  };

  const handleCreatePersonal = () => {
    setModalType('create');
    resetForm();
    setShowModal(true);
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('datosEspecificos.')) {
      const campoNombre = field.replace('datosEspecificos.', '');
      setFormData(prev => ({
        ...prev,
        datosEspecificos: {
          ...prev.datosEspecificos,
          [campoNombre]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSavePersonal = async () => {
    try {
      if (!tipoSeleccionado) {
        toast.error('Seleccione un tipo de personal');
        return;
      }

      if (!formData.nombre || !formData.apellido) {
        toast.error('Complete los campos obligatorios');
        return;
      }

      setLoading(true);
      
      if (modalType === 'create') {
        await apiService.post('/personal', {
          nombre: formData.nombre,
          apellido: formData.apellido,
          telefono: formData.telefono,
          email: formData.email,
          tipoPersonalId: tipoSeleccionado,
          datosEspecificos: formData.datosEspecificos,
          jornadaAsignadaId: formData.jornadaAsignadaId,
          clubId: clubId,
        });
        toast.success('Personal creado correctamente');
      } else if (selectedItem) {
        await apiService.patch(`/personal/${selectedItem.id}`, {
          nombre: formData.nombre,
          apellido: formData.apellido,
          telefono: formData.telefono,
          email: formData.email,
          datosEspecificos: formData.datosEspecificos,
          jornadaAsignadaId: formData.jornadaAsignadaId,
        });
        toast.success('Personal actualizado correctamente');
      }
      
      console.log('✅ Personal guardado, recargando lista...');
      await cargarPersonal();
      setShowModal(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar personal');
    } finally {
      setLoading(false);
    }
  };

  const personalFiltrado = personal.filter(item => {
    const matchesTipo = filtroTipo === 'todos' || item.tipoPersonal.codigo === filtroTipo;
    const matchesBusqueda = busqueda === '' || 
      `${item.nombre} ${item.apellido}`.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.telefono?.includes(busqueda) ||
      item.email?.toLowerCase().includes(busqueda.toLowerCase());
    
    return matchesTipo && matchesBusqueda;
  });

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'disponible': return 'bg-green-500/20 text-green-300 hover:bg-green-500/30';
      case 'ocupado': return 'bg-red-500/20 text-red-300 hover:bg-red-500/30';
      case 'descanso': return 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30';
      case 'inactivo': return 'bg-gray-500/20 text-gray-300 hover:bg-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-300 hover:bg-gray-500/30';
    }
  };

  const handleEstadoChange = async (personalId: string, nuevoEstado: 'disponible' | 'ocupado' | 'descanso' | 'inactivo') => {
    try {
      await apiService.patch(`/personal/${personalId}/estado`, { estado: nuevoEstado });
      toast.success(`Estado actualizado a: ${nuevoEstado}`);
      await cargarPersonal();
    } catch (error) {
      toast.error('Error al actualizar el estado');
      console.error('Error:', error);
    }
  };

  const handleEdit = (item: PersonalUnificado) => {
    setSelectedItem(item);
    setTipoSeleccionado(item.tipoPersonal.id);
    setModalType('edit');
    setFormData({
      nombre: item.nombre,
      apellido: item.apellido,
      telefono: item.telefono || '',
      email: item.email || '',
      datosEspecificos: item.datosEspecificos || {},
      jornadaAsignadaId: (item as any).jornadaAsignadaId || null,
    });
    setShowModal(true);
  };

  const handleDelete = (item: PersonalUnificado) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      setLoading(true);
      await apiService.delete(`/personal/${itemToDelete.id}`);
      console.log('✅ Personal eliminado, recargando lista...');
      toast.success('Personal eliminado exitosamente');
      await cargarPersonal();
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      toast.error('Error al eliminar personal');
    } finally {
      setLoading(false);
    }
  };

  const getTipoActual = () => {
    if (!tipoSeleccionado) return null;
    return tipos.find(t => t.id === tipoSeleccionado);
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
                  <Users className="w-8 h-8 text-blue-400" />
                  Gestión de Personal
                </h1>
                <p className="mt-2 text-gray-300">
                  Administra caddies, boleadores y personal del club
                </p>
              </div>
              {tabActual === 'personal' && (
                <button
                  onClick={handleCreatePersonal}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Personal
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-t border-gray-700 pt-4 pb-2">
            <button
              onClick={() => setTabActual('personal')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                tabActual === 'personal'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Users className="w-5 h-5" />
              Personal
            </button>
            <button
              onClick={() => setTabActual('estados')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                tabActual === 'estados'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Activity className="w-5 h-5" />
              Estados
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Contenido según tab activo */}
        {tabActual === 'estados' ? (
          <GestionEstadosPersonal />
        ) : (
          <div>
        {/* Filtros */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Filtro por tipo */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo de Personal
              </label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="todos">Todos los tipos</option>
                {tipos.map(tipo => (
                  <option key={tipo.id} value={tipo.codigo}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Búsqueda */}
            <div className="flex-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Buscar Personal
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, teléfono o email..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-200" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold">{personal.length}</div>
                <div className="text-sm text-blue-200">Total Personal</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserCheck className="h-8 w-8 text-green-200" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold">
                  {personal.filter(p => p.estado === 'disponible').length}
                </div>
                <div className="text-sm text-green-200">Disponibles</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-lg p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-200" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold">
                  {personal.filter(p => p.estado === 'ocupado').length}
                </div>
                <div className="text-sm text-yellow-200">Ocupados</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-purple-200" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold">
                  {personal.filter(p => p.estado === 'descanso').length}
                </div>
                <div className="text-sm text-purple-200">En Descanso</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserCheck className="h-8 w-8 text-gray-300" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold">
                  {personal.filter(p => p.estado === 'inactivo').length}
                </div>
                <div className="text-sm text-gray-300">Inactivos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de personal */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-lg font-medium text-white">
              Personal ({personalFiltrado.length})
            </h3>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
              <p className="mt-2 text-gray-400">Cargando personal...</p>
            </div>
          ) : personalFiltrado.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No se encontró personal con los filtros aplicados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Personal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Jornada
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Contacto
                    </th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Ranking
                    </th> */}
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Tarifa/Hora
                    </th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {personalFiltrado.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-700 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                              <Users className="h-6 w-6 text-blue-200" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">
                              {item.nombre} {item.apellido}
                            </div>
                            <div className="text-sm text-gray-400">
                              ID: {item.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-200">
                          {item.tipoPersonal.nombre}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {(item as any).jornadaAsignadaId ? (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-blue-400" />
                            {(() => {
                              const jornada = jornadas.find(j => j.id === (item as any).jornadaAsignadaId);
                              return jornada ? (
                                <span className="text-blue-400 text-xs font-medium">
                                  {jornada.codigo} - {jornada.nombre}
                                </span>
                              ) : (
                                <span className="text-yellow-400 text-xs">Jornada #{(item as any).jornadaAsignadaId}</span>
                              );
                            })()}
                          </div>
                        ) : (
                          <span className="text-gray-500 text-xs italic">Sin jornada</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <div className="space-y-1">
                          {item.telefono && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-gray-500" />
                              {item.telefono}
                            </div>
                          )}
                          {item.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-gray-500" />
                              {item.email}
                            </div>
                          )}
                        </div>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <div className="text-xs text-gray-400">
                          {Object.keys(item.datosEspecificos || {}).length} campos
                        </div>
                      </td> */}
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <span className="text-gray-400">
                          {item.tarifaPorHora ? `$${item.tarifaPorHora.toLocaleString()}` : 'N/A'}
                        </span>
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={item.estado}
                          onChange={(e) => handleEstadoChange(item.id, e.target.value as any)}
                          className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer ${getEstadoColor(item.estado)}`}
                        >
                          <option value="disponible">Disponible</option>
                          <option value="ocupado">Ocupado</option>
                          <option value="descanso">Descanso</option>
                          <option value="inactivo">Inactivo</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-150 p-1 rounded hover:bg-gray-700"
                            title="Editar personal"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="text-red-400 hover:text-red-300 transition-colors duration-150 p-1 rounded hover:bg-gray-700"
                            title="Eliminar personal"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal para crear/editar personal */}
        {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                {modalType === 'create' ? 'Agregar Personal' : 'Editar Personal'}
              </h3>
              
              <div className="space-y-6">
                {/* Selector de tipo (solo en modo creación) */}
                {modalType === 'create' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tipo de Personal *
                    </label>
                    <select
                      value={tipoSeleccionado || ''}
                      onChange={(e) => {
                        setTipoSeleccionado(parseInt(e.target.value));
                        setFormData(prev => ({ ...prev, datosEspecificos: {} }));
                      }}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      {tipos.map(tipo => (
                        <option key={tipo.id} value={tipo.id}>
                          {tipo.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Información básica */}
                <div className="border-b border-gray-700 pb-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">
                    Información Personal
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ingrese el nombre"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Apellido *
                      </label>
                      <input
                        type="text"
                        value={formData.apellido}
                        onChange={(e) => handleInputChange('apellido', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ingrese el apellido"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={formData.telefono}
                        onChange={(e) => handleInputChange('telefono', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="+57 300 123 4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Email (Opcional)
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="email@ejemplo.com (opcional)"
                      />
                    </div>
                  </div>
                </div>

                {/* Asignación de Jornada */}
                <div className="border-b border-gray-700 pb-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Jornada de Trabajo
                  </h4>
                  <p className="text-sm text-gray-400 mb-3">
                    Selecciona la jornada principal de trabajo (opcional)
                  </p>
                  
                  {jornadas.length === 0 ? (
                    <div className="text-center py-4 bg-gray-700/50 rounded-lg border border-gray-600">
                      <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">
                        No hay jornadas configuradas aún
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Configura jornadas en el módulo de Gestión de Turnos
                      </p>
                    </div>
                  ) : (
                    <select
                      value={formData.jornadaAsignadaId || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        jornadaAsignadaId: e.target.value ? parseInt(e.target.value) : null 
                      }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Sin jornada asignada (horario libre)</option>
                      {jornadas.map((jornada) => (
                        <option key={jornada.id} value={jornada.id}>
                          {jornada.codigo} - {jornada.nombre} ({jornada.horaInicio} - {jornada.horaFin})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Campos específicos dinámicos */}
                {getTipoActual() && getTipoActual()!.campos_personalizados && getTipoActual()!.campos_personalizados.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-3">
                      Campos Específicos
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {getTipoActual()!.campos_personalizados.map((campo: CampoPersonalizado, index: number) => (
                        <div key={index}>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            {campo.label} {campo.requerido && '*'}
                          </label>
                          
                          {campo.tipo === 'text' && (
                            <input
                              type="text"
                              value={formData.datosEspecificos[campo.nombre] || ''}
                              onChange={(e) => handleInputChange(`datosEspecificos.${campo.nombre}`, e.target.value)}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder={campo.placeholder || ''}
                              required={campo.requerido}
                            />
                          )}

                          {campo.tipo === 'number' && (
                            <input
                              type="number"
                              value={formData.datosEspecificos[campo.nombre] || ''}
                              onChange={(e) => handleInputChange(`datosEspecificos.${campo.nombre}`, parseFloat(e.target.value))}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required={campo.requerido}
                            />
                          )}

                          {campo.tipo === 'textarea' && (
                            <textarea
                              value={formData.datosEspecificos[campo.nombre] || ''}
                              onChange={(e) => handleInputChange(`datosEspecificos.${campo.nombre}`, e.target.value)}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder={campo.placeholder || ''}
                              rows={3}
                              required={campo.requerido}
                            />
                          )}

                          {campo.tipo === 'select' && campo.opciones && (
                            <select
                              value={formData.datosEspecificos[campo.nombre] || ''}
                              onChange={(e) => handleInputChange(`datosEspecificos.${campo.nombre}`, e.target.value)}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required={campo.requerido}
                            >
                              <option value="">Seleccione...</option>
                              {campo.opciones.map((opcion: string, idx: number) => (
                                <option key={idx} value={opcion}>{opcion}</option>
                              ))}
                            </select>
                          )}

                          {campo.tipo === 'checkbox' && (
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.datosEspecificos[campo.nombre] || false}
                                onChange={(e) => handleInputChange(`datosEspecificos.${campo.nombre}`, e.target.checked)}
                                className="w-4 h-4 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-400">{campo.placeholder}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-6 py-2 text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors duration-150"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSavePersonal}
                    disabled={!formData.nombre || !formData.apellido || !tipoSeleccionado}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-150 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                  >
                    {modalType === 'create' ? 'Crear' : 'Guardar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Modal de confirmación de eliminación */}
        {showDeleteModal && itemToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-md w-full shadow-2xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-900/50 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-lg font-medium text-white">
                  Confirmar Eliminación
                </h3>
              </div>
              
              <p className="text-gray-300 mb-6">
                ¿Estás seguro de que deseas eliminar a{' '}
                <span className="font-semibold text-white">
                  {itemToDelete.nombre} {itemToDelete.apellido}
                </span>
                ?
                <br />
                <span className="text-sm text-gray-400 mt-2 block">
                  Esta acción no se puede deshacer.
                </span>
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setItemToDelete(null);
                  }}
                  className="px-4 py-2 text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors duration-150"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-150 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Eliminar
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