import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Eye, 
  Edit2, 
  Trash2, 
  Plus, 
  Search, 
  Filter,
  Archive,
  ArchiveRestore,
  FileText,
  Users,
  TrendingUp,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { jornadasService } from '../services/jornadasService';
import type { 
  Jornada, 
  JornadasResponse, 
  JornadaFilters, 
  JornadaEstadisticas,
  ModalState,
  JornadaFormData,
  TurnoJornada
} from '../types/jornadas';
import { formatJornadaDate, formatTurnosCount, generateJornadaName } from '../types/jornadas';

const GestionJornadas: React.FC = () => {
  const { addToast } = useToast();
  
  // Estados principales
  const [jornadas, setJornadas] = useState<Jornada[]>([]);
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState<JornadaEstadisticas | null>(null);
  
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJornadas, setTotalJornadas] = useState(0);
  const [itemsPerPage] = useState(10);
  
  // Estados de filtros
  const [filtros, setFiltros] = useState<JornadaFilters>({
    busqueda: '',
    fechaInicio: '',
    fechaFin: '',
    activa: undefined,
    page: 1,
    limit: 10
  });
  
  // Estados de modales
  const [modals, setModals] = useState<ModalState>({
    crear: { isOpen: false },
    editar: { isOpen: false, jornada: null },
    eliminar: { isOpen: false, jornada: null },
    ver: { isOpen: false, jornada: null }
  });
  
  // Estados de formulario
  const [formData, setFormData] = useState<JornadaFormData>({
    fechaJornada: '',
    nombreJornada: '',
    observaciones: '',
    activa: true
  });

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos();
    cargarEstadisticas();
  }, [filtros]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const response = await jornadasService.obtenerLista(filtros);
      if (response.success && response.data) {
        setJornadas(response.data.jornadas);
        setTotalPages(response.data.totalPages);
        setTotalJornadas(response.data.total);
      } else {
        addToast({ type: 'error', title: response.error || 'Error al cargar las jornadas' });
      }
    } catch (error) {
      console.error('Error cargando jornadas:', error);
      addToast({ type: 'error', title: 'Error al cargar las jornadas' });
    } finally {
      setLoading(false);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const response = await jornadasService.obtenerEstadisticas();
      if (response.success && response.data) {
        setEstadisticas(response.data);
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const handleCrearJornada = async () => {
    try {
      const createData = {
        fechaJornada: formData.fechaJornada,
        nombreJornada: formData.nombreJornada || generateJornadaName(new Date(formData.fechaJornada)),
        datosTurnos: [],
        totalTurnos: 0,
        observaciones: formData.observaciones,
        activa: formData.activa
      };

      const response = await jornadasService.crear(createData);
      if (response.success) {
        addToast({ type: 'success', title: 'Jornada creada correctamente' });
        cerrarModal('crear');
        cargarDatos();
        cargarEstadisticas();
        resetForm();
      } else {
        addToast(response.error || 'Error al crear la jornada', 'error');
      }
    } catch (error) {
      console.error('Error creando jornada:', error);
      addToast('Error al crear la jornada', 'error');
    }
  };

  const handleEditarJornada = async () => {
    if (!modals.editar.jornada) return;

    try {
      const updateData = {
        fechaJornada: formData.fechaJornada,
        nombreJornada: formData.nombreJornada,
        observaciones: formData.observaciones,
        activa: formData.activa
      };

      const response = await jornadasService.actualizar(modals.editar.jornada.id, updateData);
      if (response.success) {
        addToast('Jornada actualizada correctamente', 'success');
        cerrarModal('editar');
        cargarDatos();
        cargarEstadisticas();
        resetForm();
      } else {
        addToast(response.error || 'Error al actualizar la jornada', 'error');
      }
    } catch (error) {
      console.error('Error actualizando jornada:', error);
      addToast('Error al actualizar la jornada', 'error');
    }
  };

  const handleEliminarJornada = async () => {
    if (!modals.eliminar.jornada) return;

    try {
      const response = await jornadasService.eliminar(modals.eliminar.jornada.id);
      if (response.success) {
        addToast('Jornada eliminada correctamente', 'success');
        cerrarModal('eliminar');
        cargarDatos();
        cargarEstadisticas();
      } else {
        addToast(response.error || 'Error al eliminar la jornada', 'error');
      }
    } catch (error) {
      console.error('Error eliminando jornada:', error);
      addToast('Error al eliminar la jornada', 'error');
    }
  };

  const handleToggleActiva = async (jornada: Jornada) => {
    try {
      const response = await jornadasService.toggleActiva(jornada.id);
      if (response.success) {
        const accion = jornada.activa ? 'archivada' : 'restaurada';
        addToast(`Jornada ${accion} correctamente`, 'success');
        cargarDatos();
        cargarEstadisticas();
      } else {
        addToast(response.error || 'Error al cambiar el estado', 'error');
      }
    } catch (error) {
      console.error('Error cambiando estado:', error);
      addToast('Error al cambiar el estado', 'error');
    }
  };

  const abrirModal = (tipo: keyof ModalState, jornada?: Jornada) => {
    if (tipo === 'crear') {
      resetForm();
      setModals(prev => ({ ...prev, crear: { isOpen: true } }));
    } else if (tipo === 'editar' && jornada) {
      setFormData({
        fechaJornada: jornada.fechaJornada,
        nombreJornada: jornada.nombreJornada,
        observaciones: jornada.observaciones || '',
        activa: jornada.activa
      });
      setModals(prev => ({ ...prev, editar: { isOpen: true, jornada } }));
    } else if (tipo === 'eliminar' && jornada) {
      setModals(prev => ({ ...prev, eliminar: { isOpen: true, jornada } }));
    } else if (tipo === 'ver' && jornada) {
      setModals(prev => ({ ...prev, ver: { isOpen: true, jornada } }));
    }
  };

  const cerrarModal = (tipo: keyof ModalState) => {
    setModals(prev => ({
      ...prev,
      [tipo]: tipo === 'crear' ? { isOpen: false } : { isOpen: false, jornada: null }
    }));
  };

  const resetForm = () => {
    setFormData({
      fechaJornada: '',
      nombreJornada: '',
      observaciones: '',
      activa: true
    });
  };

  const handleFiltroChange = (campo: keyof JornadaFilters, valor: any) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor,
      page: 1 // Reset página al cambiar filtros
    }));
    setCurrentPage(1);
  };

  const limpiarFiltros = () => {
    setFiltros({
      busqueda: '',
      fechaInicio: '',
      fechaFin: '',
      activa: undefined,
      page: 1,
      limit: 10
    });
    setCurrentPage(1);
  };

  const cambiarPagina = (nuevaPagina: number) => {
    setCurrentPage(nuevaPagina);
    setFiltros(prev => ({ ...prev, page: nuevaPagina }));
  };

  const exportarJornada = (jornada: Jornada) => {
    const dataStr = JSON.stringify(jornada, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `jornada_${jornada.fechaJornada}_${jornada.id.slice(0, 8)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    addToast('Jornada exportada correctamente', 'success');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                Gestión de Jornadas
              </h1>
              <p className="text-gray-600">
                Administra y consulta el historial de jornadas de turnos guardadas
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => cargarDatos()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Actualizar
              </button>
              
              <button
                onClick={() => abrirModal('crear')}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="h-5 w-5" />
                Nueva Jornada
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        {estadisticas && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Jornadas</p>
                  <p className="text-2xl font-bold text-gray-900">{estadisticas.totalJornadas}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Activas</p>
                  <p className="text-2xl font-bold text-green-600">{estadisticas.jornadasActivas}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Archivadas</p>
                  <p className="text-2xl font-bold text-gray-600">{estadisticas.jornadasInactivas}</p>
                </div>
                <Archive className="h-8 w-8 text-gray-600" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Turnos</p>
                  <p className="text-2xl font-bold text-purple-600">{estadisticas.totalTurnosGuardados}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Promedio</p>
                  <p className="text-2xl font-bold text-indigo-600">{estadisticas.promedioTurnosPorJornada}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={filtros.busqueda || ''}
                onChange={(e) => handleFiltroChange('busqueda', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Fecha inicio */}
            <input
              type="date"
              placeholder="Fecha inicio"
              value={filtros.fechaInicio || ''}
              onChange={(e) => handleFiltroChange('fechaInicio', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            {/* Fecha fin */}
            <input
              type="date"
              placeholder="Fecha fin"
              value={filtros.fechaFin || ''}
              onChange={(e) => handleFiltroChange('fechaFin', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            {/* Estado */}
            <select
              value={filtros.activa === undefined ? '' : filtros.activa.toString()}
              onChange={(e) => handleFiltroChange('activa', e.target.value === '' ? undefined : e.target.value === 'true')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              <option value="true">Activas</option>
              <option value="false">Archivadas</option>
            </select>
            
            {/* Limpiar filtros */}
            <button
              onClick={limpiarFiltros}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
              Limpiar
            </button>
          </div>
        </div>

        {/* Lista de jornadas */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Jornadas ({totalJornadas})
              </h3>
              <div className="text-sm text-gray-600">
                Página {currentPage} de {totalPages}
              </div>
            </div>
          </div>
          
          {jornadas.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay jornadas</h3>
              <p className="text-gray-500 mb-6">
                {Object.values(filtros).some(v => v !== '' && v !== undefined) 
                  ? 'No se encontraron jornadas con los filtros aplicados'
                  : 'Aún no has guardado ninguna jornada'
                }
              </p>
              {!Object.values(filtros).some(v => v !== '' && v !== undefined) && (
                <button
                  onClick={() => abrirModal('crear')}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors mx-auto"
                >
                  <Plus className="h-5 w-5" />
                  Crear primera jornada
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jornada
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Turnos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Creación
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {jornadas.map((jornada) => (
                      <tr key={jornada.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg mr-3">
                              <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {jornada.nombreJornada}
                              </div>
                              {jornada.observaciones && (
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {jornada.observaciones}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatJornadaDate(jornada.fechaJornada)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900">
                              {formatTurnosCount(jornada.totalTurnos)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            jornada.activa
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {jornada.activa ? 'Activa' : 'Archivada'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(jornada.fechaCreacion).toLocaleDateString('es-ES')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => abrirModal('ver', jornada)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Ver detalles"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={() => abrirModal('editar', jornada)}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={() => handleToggleActiva(jornada)}
                              className={`p-2 rounded-lg transition-colors ${
                                jornada.activa
                                  ? 'text-gray-600 hover:bg-gray-50'
                                  : 'text-green-600 hover:bg-green-50'
                              }`}
                              title={jornada.activa ? 'Archivar' : 'Restaurar'}
                            >
                              {jornada.activa ? <Archive className="h-4 w-4" /> : <ArchiveRestore className="h-4 w-4" />}
                            </button>
                            
                            <button
                              onClick={() => exportarJornada(jornada)}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Exportar"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={() => abrirModal('eliminar', jornada)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Paginación */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, totalJornadas)} de {totalJornadas} jornadas
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => cambiarPagina(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
                      </button>
                      
                      <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNumber;
                          if (totalPages <= 5) {
                            pageNumber = i + 1;
                          } else if (currentPage <= 3) {
                            pageNumber = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNumber = totalPages - 4 + i;
                          } else {
                            pageNumber = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => cambiarPagina(pageNumber)}
                              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                currentPage === pageNumber
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        })}
                      </div>
                      
                      <button
                        onClick={() => cambiarPagina(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Siguiente
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal Crear Jornada */}
      {modals.crear.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Plus className="h-6 w-6 text-blue-600" />
                  </div>
                  Nueva Jornada
                </h3>
                <button
                  onClick={() => cerrarModal('crear')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de la jornada *
                </label>
                <input
                  type="date"
                  value={formData.fechaJornada}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      fechaJornada: e.target.value,
                      nombreJornada: e.target.value ? generateJornadaName(new Date(e.target.value)) : ''
                    }));
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la jornada *
                </label>
                <input
                  type="text"
                  value={formData.nombreJornada}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombreJornada: e.target.value }))}
                  placeholder="Ej: Jornada 24/10/2025"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones
                </label>
                <textarea
                  value={formData.observaciones}
                  onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
                  placeholder="Notas adicionales sobre esta jornada..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="activa"
                  checked={formData.activa}
                  onChange={(e) => setFormData(prev => ({ ...prev, activa: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="activa" className="ml-2 block text-sm text-gray-700">
                  Jornada activa
                </label>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => cerrarModal('crear')}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCrearJornada}
                disabled={!formData.fechaJornada || !formData.nombreJornada}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Crear Jornada
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Jornada */}
      {modals.editar.isOpen && modals.editar.jornada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Edit2 className="h-6 w-6 text-indigo-600" />
                  </div>
                  Editar Jornada
                </h3>
                <button
                  onClick={() => cerrarModal('editar')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de la jornada *
                </label>
                <input
                  type="date"
                  value={formData.fechaJornada}
                  onChange={(e) => setFormData(prev => ({ ...prev, fechaJornada: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la jornada *
                </label>
                <input
                  type="text"
                  value={formData.nombreJornada}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombreJornada: e.target.value }))}
                  placeholder="Ej: Jornada 24/10/2025"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones
                </label>
                <textarea
                  value={formData.observaciones}
                  onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
                  placeholder="Notas adicionales sobre esta jornada..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="activa-edit"
                  checked={formData.activa}
                  onChange={(e) => setFormData(prev => ({ ...prev, activa: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="activa-edit" className="ml-2 block text-sm text-gray-700">
                  Jornada activa
                </label>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => cerrarModal('editar')}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleEditarJornada}
                disabled={!formData.fechaJornada || !formData.nombreJornada}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Actualizar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar Jornada */}
      {modals.eliminar.isOpen && modals.eliminar.jornada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  Eliminar Jornada
                </h3>
                <button
                  onClick={() => cerrarModal('eliminar')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <p className="text-gray-600 mb-4">
                  ¿Estás seguro de que deseas eliminar esta jornada? Esta acción no se puede deshacer.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900">
                      {modals.eliminar.jornada.nombreJornada}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 ml-8">
                    <p>Fecha: {formatJornadaDate(modals.eliminar.jornada.fechaJornada)}</p>
                    <p>Turnos: {formatTurnosCount(modals.eliminar.jornada.totalTurnos)}</p>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700">
                      Se eliminará permanentemente la jornada y todos los datos de turnos asociados.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => cerrarModal('eliminar')}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminarJornada}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Eliminar Jornada
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ver Jornada */}
      {modals.ver.isOpen && modals.ver.jornada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Eye className="h-6 w-6 text-blue-600" />
                  </div>
                  Detalles de la Jornada
                </h3>
                <button
                  onClick={() => cerrarModal('ver')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Información general */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Información General</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nombre:</span>
                      <span className="font-medium">{modals.ver.jornada.nombreJornada}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha:</span>
                      <span className="font-medium">{formatJornadaDate(modals.ver.jornada.fechaJornada)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        modals.ver.jornada.activa
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {modals.ver.jornada.activa ? 'Activa' : 'Archivada'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total turnos:</span>
                      <span className="font-medium">{formatTurnosCount(modals.ver.jornada.totalTurnos)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Fechas</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Creada:</span>
                      <span className="font-medium">
                        {new Date(modals.ver.jornada.fechaCreacion).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Actualizada:</span>
                      <span className="font-medium">
                        {new Date(modals.ver.jornada.fechaActualizacion).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Observaciones */}
              {modals.ver.jornada.observaciones && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Observaciones</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{modals.ver.jornada.observaciones}</p>
                  </div>
                </div>
              )}
              
              {/* Lista de turnos */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Turnos de la Jornada ({modals.ver.jornada.datosTurnos.length})
                </h4>
                
                {modals.ver.jornada.datosTurnos.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No hay turnos registrados en esta jornada</p>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Cancha
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Horario
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Socio
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Caddie
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Precio
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Estado
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {modals.ver.jornada.datosTurnos.map((turno: TurnoJornada, index: number) => (
                            <tr key={index} className="hover:bg-white transition-colors">
                              <td className="px-4 py-3">
                                <div className="flex items-center">
                                  <div className="text-sm font-medium text-gray-900">
                                    {turno.cancha}
                                  </div>
                                  {turno.numeroCancha && (
                                    <div className="text-xs text-gray-500 ml-1">
                                      #{turno.numeroCancha}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center text-sm text-gray-900">
                                  <Clock className="h-4 w-4 text-gray-400 mr-1" />
                                  {turno.horaInicio} - {turno.horaFin}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {turno.socio}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="text-sm text-gray-600">
                                  {turno.caddie || '-'}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="text-sm font-medium text-gray-900">
                                  ${turno.precio.toLocaleString()}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  turno.estado === 'confirmado'
                                    ? 'bg-green-100 text-green-800'
                                    : turno.estado === 'pendiente'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : turno.estado === 'cancelado'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {turno.estado}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => exportarJornada(modals.ver.jornada!)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Download className="h-4 w-4" />
                Exportar
              </button>
              <button
                onClick={() => cerrarModal('ver')}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionJornadas;