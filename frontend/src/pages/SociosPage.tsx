import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  Download, 
  Upload,
  Mail,
  Phone,
  Calendar,
  Settings2,
  ArrowLeft,
  User,
  FileText,
  X
} from 'lucide-react';
import { CrearSocioModal, EditarSocioModal, GestionCategorias, Modal } from '../components';
import { useToast } from '../contexts/ToastContext';
import { GlobalNavigation, GlobalFooter } from '../components';
import { tiposMembresiaService, type TipoMembresia } from '../services/tiposMembresiaService';
import { sociosService, type Socio, type CrearSocioDto, type ActualizarSocioDto } from '../services/sociosService';

// Los datos de ejemplo se cargarán desde el backend

interface SociosPageProps {
  isSubModule?: boolean;
}

type VistaActual = 'socios' | 'categorias';

export const SociosPage: React.FC<SociosPageProps> = ({ isSubModule = false }) => {
  const { addToast } = useToast();
  const [vistaActual, setVistaActual] = useState<VistaActual>('socios');
  const [socios, setSocios] = useState<Socio[]>([]);
  const [categorias, setCategorias] = useState<TipoMembresia[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');
  const [socioSeleccionado, setSocioSeleccionado] = useState<Socio | null>(null);
  const [modalCrear, setModalCrear] = useState(false);
  const [modalVer, setModalVer] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [cargando, setCargando] = useState(false);

  // Cargar socios y categorías del backend
  useEffect(() => {
    cargarCategorias();
    cargarSocios();
  }, []);

  const cargarCategorias = async () => {
    try {
      const categoriasObtenidas = await tiposMembresiaService.obtenerTipos();
      setCategorias(categoriasObtenidas);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      addToast({
        type: 'error',
        title: 'Error al cargar categorías',
        message: 'Error al cargar las categorías de membresía'
      });
    }
  };

  const cargarSocios = async () => {
    setCargando(true);
    try {
      console.log('Iniciando carga de socios...');
      const response = await sociosService.obtenerSocios();
      console.log('Respuesta del servicio de socios:', response);
      console.log('Datos de socios obtenidos:', response.data);
      setSocios(response.data || []);
      console.log('Estado de socios actualizado');
    } catch (error) {
      console.error('Error al cargar socios:', error);
      addToast({
        type: 'error',
        title: 'Error al cargar socios',
        message: 'Error al cargar la lista de socios'
      });
    } finally {
      setCargando(false);
    }
  };

  const crearSocio = async (socioData: CrearSocioDto) => {
    try {
      console.log('Creando socio con datos:', socioData);
      const resultado = await sociosService.crearSocio(socioData);
      console.log('Socio creado exitosamente:', resultado);
      
      // Mostrar notificación de éxito
      addToast({
        type: 'success',
        title: 'Socio creado',
        message: 'Socio creado exitosamente'
      });
      
      // Recargar la lista inmediatamente
      console.log('Recargando lista de socios...');
      await cargarSocios();
      console.log('Lista de socios recargada');
      
    } catch (error) {
      console.error('Error al crear socio:', error);
      addToast({
        type: 'error',
        title: 'Error al crear socio',
        message: 'Error al crear el socio'
      });
      throw error;
    }
  };

  const actualizarSocio = async (id: string, socioData: ActualizarSocioDto) => {
    try {
      console.log('Actualizando socio:', id, 'con datos:', socioData);
      const resultado = await sociosService.actualizarSocio(id, socioData);
      console.log('Socio actualizado exitosamente:', resultado);
      
      // Mostrar notificación de éxito
      addToast({
        type: 'success',
        title: 'Socio actualizado',
        message: 'Socio actualizado exitosamente'
      });
      
      // Recargar la lista inmediatamente
      console.log('Recargando lista de socios...');
      await cargarSocios();
      console.log('Lista de socios recargada');
      
    } catch (error) {
      console.error('Error al actualizar socio:', error);
      addToast({
        type: 'error',
        title: 'Error al actualizar socio',
        message: 'Error al actualizar el socio'
      });
      throw error;
    }
  };

  // Función para eliminar socio
  const eliminarSocio = async (id: string) => {
    try {
      console.log('Eliminando socio:', id);
      await sociosService.eliminarSocio(id);
      console.log('Socio eliminado exitosamente');
      
      // Mostrar notificación de éxito
      addToast({
        type: 'success',
        title: 'Socio eliminado',
        message: 'Socio eliminado exitosamente'
      });
      
      // Recargar la lista
      await cargarSocios();
    } catch (error) {
      console.error('Error al eliminar socio:', error);
      addToast({
        type: 'error',
        title: 'Error al eliminar socio',
        message: 'Error al eliminar el socio'
      });
      throw error;
    }
  };

  // Filtrar socios
  const sociosFiltrados = socios.filter(socio => {
    const matchSearch = socio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       socio.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       socio.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       socio.documento.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchEstado = filtroEstado === 'todos' || socio.estado === filtroEstado;
    const matchCategoria = filtroCategoria === 'todas' || socio.tipo_membresia_id === filtroCategoria;
    
    return matchSearch && matchEstado && matchCategoria;
  });

  // Función para exportar socios a CSV
  const exportarSocios = () => {
    const headers = [
      'ID',
      'Nombre',
      'Apellidos',
      'Email',
      'Teléfono',
      'Fecha Nacimiento',
      'Categoría',
      'Fecha Ingreso',
      'Estado',
      'Dirección',
      'Observaciones'
    ];

    const csvContent = [
      headers.join(','),
      ...sociosFiltrados.map(socio => {
        const categoria = categorias.find(cat => cat.id === socio.tipo_membresia_id);
        return [
          socio.id,
          `"${socio.nombre}"`,
          `"${socio.apellido}"`,
          socio.email,
          socio.telefono || '',
          socio.fecha_nacimiento || '',
          categoria?.nombre || 'Sin categoría',
          socio.fecha_inicio_membresia,
          socio.estado,
          `"${socio.direccion || ''}"`,
          `"${socio.observaciones || ''}"`
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `socios_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    // Mostrar notificación de éxito
    addToast({
      type: 'success',
      title: 'Exportación exitosa',
      message: `${sociosFiltrados.length} socios exportados exitosamente`
    });
  };

  // Función para manejar importación de socios
  const handleImportarSocios = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Funcionalidad de importación simplificada
    // Por ahora mostramos un mensaje indicando que se use el formulario
    alert('Por favor, usa el formulario "Nuevo Socio" para registrar socios individualmente.');
    event.target.value = ''; // Limpiar el input
  };

  const getCategoriaColor = (categoriaId: string) => {
    const categoria = categorias.find(cat => cat.id === categoriaId);
    return categoria?.color || '#6b7280';
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      case 'inactivo': return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
      case 'suspendido': return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      default: return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
    }
  };

  return (
    <div style={{
      minHeight: isSubModule ? 'auto' : '100vh',
      backgroundColor: isSubModule ? 'transparent' : '#0f0f23',
      color: '#fff',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {!isSubModule && <GlobalNavigation />}
      <div style={{ padding: isSubModule ? '0' : '24px' }}>

      {/* Header con navegación entre vistas */}
      {isSubModule && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {vistaActual === 'categorias' && (
              <button
                onClick={() => setVistaActual('socios')}
                style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  color: '#3b82f6',
                  padding: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                title="Volver a Socios"
              >
                <ArrowLeft size={16} />
              </button>
            )}
            
            <div style={{
              background: vistaActual === 'socios' 
                ? 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'
                : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              borderRadius: '8px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users size={20} color="white" />
            </div>
            <div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#f9fafb',
                margin: 0,
                lineHeight: '1.2'
              }}>
                {vistaActual === 'socios' ? 'Gestión de Socios' : 'Categorías de Socios'}
              </h2>
              <p style={{
                fontSize: '14px',
                color: '#9ca3af',
                margin: '2px 0 0'
              }}>
                {vistaActual === 'socios' 
                  ? 'Administra la membresía del club de tenis'
                  : 'Configura los tipos de socios de tu club'
                }
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {vistaActual === 'socios' && (
              <>
                <button
                  onClick={() => setVistaActual('categorias')}
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Settings2 size={14} />
                  Categorías
                </button>

                <button
                  onClick={exportarSocios}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Download size={14} />
                  Exportar
                </button>

                <label
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleImportarSocios}
                    style={{ display: 'none' }}
                  />
                  <Upload size={14} />
                  Importar
                </label>

                <button
                  onClick={() => setModalCrear(true)}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Plus size={14} />
                  Nuevo Socio
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Renderizado condicional según la vista activa */}
      {vistaActual === 'categorias' ? (
        <GestionCategorias
          categorias={categorias}
          onActualizar={cargarCategorias}
        />
      ) : (
        <>
        {/* Filtros y búsqueda simplificados */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isSubModule ? '2fr 1fr 1fr' : '2fr 1fr 1fr', 
          gap: '12px',
          marginBottom: isSubModule ? '16px' : '24px'
        }}>
          <div style={{ position: 'relative' }}>
            <Search 
              size={16} 
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                zIndex: 1
              }}
            />
            <input
              type="text"
              placeholder="Buscar por nombre, apellidos o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 36px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.05)',
                fontSize: '14px',
                color: '#f9fafb',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                e.target.style.background = 'rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
            />
          </div>

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.05)',
              fontSize: '14px',
              color: '#f9fafb',
              outline: 'none',
              transition: 'all 0.2s ease',
              appearance: 'none' as const,
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 12px center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '16px'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(139, 92, 246, 0.5)';
              e.target.style.background = 'rgba(139, 92, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
            <option value="suspendido">Suspendidos</option>
          </select>

          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.05)',
              fontSize: '14px',
              color: '#f9fafb',
              outline: 'none',
              transition: 'all 0.2s ease',
              appearance: 'none' as const,
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 12px center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '16px'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(16, 185, 129, 0.5)';
              e.target.style.background = 'rgba(16, 185, 129, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          >
            <option value="todas">Todas las categorías</option>
            {categorias.filter(cat => cat.activo).map(categoria => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>

      {/* Estadísticas simplificadas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '12px', 
        marginBottom: '16px' 
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: '12px',
          padding: '16px',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
            {socios.filter(s => s.estado === 'activo').length}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>Socios Activos</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          borderRadius: '12px',
          padding: '16px',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
            {categorias.filter(cat => cat.activo).length}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>Categorías Activas</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          borderRadius: '12px',
          padding: '16px',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
            {socios.filter(s => s.tipo_membresia_id === categorias.find(cat => cat.nombre.toLowerCase().includes('propietario'))?.id).length}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>Propietarios</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          borderRadius: '12px',
          padding: '16px',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
            {socios.length}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>Total Socios</div>
        </div>
      </div>

      {/* Tabla de socios simplificada */}
      <div style={{
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid #374151'
      }}>
        <div style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ 
                background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)'
              }}>
                <th style={{ 
                  padding: '16px', 
                  textAlign: 'left', 
                  fontWeight: '600', 
                  color: '#f1f5f9', 
                  fontSize: '14px'
                }}>
                  Socio
                </th>
                <th style={{ 
                  padding: '16px', 
                  textAlign: 'left', 
                  fontWeight: '600', 
                  color: '#f1f5f9', 
                  fontSize: '14px'
                }}>
                  Contacto
                </th>
                <th style={{ 
                  padding: '16px', 
                  textAlign: 'left', 
                  fontWeight: '600', 
                  color: '#f1f5f9', 
                  fontSize: '14px'
                }}>
                  Categoría
                </th>
                <th style={{ 
                  padding: '16px', 
                  textAlign: 'left', 
                  fontWeight: '600', 
                  color: '#f1f5f9', 
                  fontSize: '14px'
                }}>
                  Estado
                </th>
                <th style={{ 
                  padding: '16px', 
                  textAlign: 'left', 
                  fontWeight: '600', 
                  color: '#f1f5f9', 
                  fontSize: '14px'
                }}>
                  Registro
                </th>
                <th style={{ 
                  padding: '16px', 
                  textAlign: 'center', 
                  fontWeight: '600', 
                  color: '#f1f5f9', 
                  fontSize: '14px'
                }}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {sociosFiltrados.map((socio) => (
                <tr 
                  key={socio.id}
                  style={{
                    borderBottom: '1px solid #374151',
                    transition: 'all 0.2s ease',
                    background: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        #{sociosFiltrados.indexOf(socio) + 1}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#f9fafb', marginBottom: '4px' }}>
                          {socio.nombre} {socio.apellido}
                        </div>
                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                          Doc: {socio.documento}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#e2e8f0' }}>
                        <Mail size={12} />
                        {socio.email}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#e2e8f0' }}>
                        <Phone size={12} />
                        {socio.telefono}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: 'white',
                      background: getCategoriaColor(socio.tipo_membresia_id),
                      textTransform: 'uppercase'
                    }}>
                      {categorias.find(cat => cat.id === socio.tipo_membresia_id)?.nombre || 'Sin categoría'}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: 'white',
                      background: getEstadoColor(socio.estado),
                      textTransform: 'capitalize'
                    }}>
                      {socio.estado}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#9ca3af' }}>
                      <Calendar size={12} />
                      {new Date(socio.created_at).toLocaleDateString('es-ES')}
                    </div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      <button
                        onClick={() => {
                          setSocioSeleccionado(socio);
                          setModalVer(true);
                        }}
                        style={{
                          background: '#3b82f6',
                          border: 'none',
                          borderRadius: '6px',
                          color: 'white',
                          padding: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Eye size={14} />
                      </button>
                      
                      <button
                        onClick={() => {
                          setSocioSeleccionado(socio);
                          setModalEditar(true);
                        }}
                        style={{
                          background: '#10b981',
                          border: 'none',
                          borderRadius: '6px',
                          color: 'white',
                          padding: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Edit3 size={14} />
                      </button>
                      
                      <button
                        onClick={() => {
                          setSocioSeleccionado(socio);
                          setModalEliminar(true);
                        }}
                        style={{
                          background: '#ef4444',
                          border: 'none',
                          borderRadius: '6px',
                          color: 'white',
                          padding: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sociosFiltrados.length === 0 && (
          <div style={{
            padding: '48px',
            textAlign: 'center',
            color: '#9ca3af'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(156, 163, 175, 0.1)',
              marginBottom: '16px'
            }}>
              <Users size={24} style={{ opacity: 0.5 }} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '500', color: '#9ca3af', margin: '0 0 8px 0' }}>
              No hay socios registrados
            </h3>
            <p style={{ fontSize: '14px', margin: 0, color: '#6b7280' }}>
              No se encontraron socios con los filtros aplicados
            </p>
          </div>
        )}
      </div>

      {/* Resumen al final simplificado */}
      <div style={{
        marginTop: '16px',
        padding: '12px 16px',
        background: 'rgba(55, 65, 81, 0.5)',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: '13px'
      }}>
        Mostrando <strong style={{ color: '#f1f5f9' }}>{sociosFiltrados.length}</strong> de <strong style={{ color: '#f1f5f9' }}>{socios.length}</strong> socios
        {sociosFiltrados.length !== socios.length && (
          <span style={{ 
            marginLeft: '8px',
            padding: '2px 8px', 
            background: 'rgba(59, 130, 246, 0.2)', 
            borderRadius: '8px',
            fontSize: '11px',
            color: '#93c5fd'
          }}>
            Filtros aplicados
          </span>
        )}
      </div>

      {/* Modales */}
      {modalCrear && (
        <CrearSocioModal
          isOpen={modalCrear}
          onClose={() => setModalCrear(false)}
          categorias={categorias}
          onSave={crearSocio}
        />
      )}

      {modalEditar && socioSeleccionado && (
        <EditarSocioModal
          isOpen={modalEditar}
          onClose={() => {
            setModalEditar(false);
            setSocioSeleccionado(null);
          }}
          socio={socioSeleccionado}
          categorias={categorias}
          onSave={actualizarSocio}
        />
      )}

      {modalEliminar && socioSeleccionado && (
        <Modal
          isOpen={modalEliminar}
          onClose={() => {
            setModalEliminar(false);
            setSocioSeleccionado(null);
          }}
          title="Confirmar Eliminación"
          size="md"
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {/* Icono de advertencia */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '8px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '2px solid rgba(239, 68, 68, 0.3)'
              }}>
                <Trash2 size={28} color="#ef4444" />
              </div>
            </div>

            {/* Mensaje */}
            <div style={{ textAlign: 'center', color: '#f9fafb' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                margin: '0 0 12px 0'
              }}>
                ¿Eliminar Socio?
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#9ca3af',
                margin: '0 0 8px 0',
                lineHeight: '1.5'
              }}>
                Esta acción eliminará permanentemente el socio:
              </p>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '10px',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                margin: '16px 0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    #{socios.indexOf(socioSeleccionado) + 1}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{
                      fontWeight: '600',
                      color: '#f9fafb',
                      fontSize: '16px'
                    }}>
                      {socioSeleccionado.nombre} {socioSeleccionado.apellido}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#9ca3af'
                    }}>
                      {socioSeleccionado.email}
                    </div>
                  </div>
                </div>
              </div>
              <p style={{
                fontSize: '13px',
                color: '#ef4444',
                margin: 0,
                fontWeight: '500'
              }}>
                Esta acción no se puede deshacer.
              </p>
            </div>

            {/* Botones */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              paddingTop: '8px'
            }}>
              <button
                onClick={() => {
                  setModalEliminar(false);
                  setSocioSeleccionado(null);
                }}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'transparent',
                  color: '#9ca3af',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(156, 163, 175, 0.1)';
                  e.currentTarget.style.color = '#f9fafb';
                  e.currentTarget.style.borderColor = '#9ca3af';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#9ca3af';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                <X size={16} />
                Cancelar
              </button>
              
              <button
                onClick={async () => {
                  try {
                    await eliminarSocio(socioSeleccionado.id);
                    setModalEliminar(false);
                    setSocioSeleccionado(null);
                  } catch (error) {
                    // Error ya manejado en eliminarSocio con notificación
                    console.error('Error al eliminar socio:', error);
                  }
                }}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                }}
              >
                <Trash2 size={16} />
                Eliminar
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Vista Detallada */}
      {modalVer && socioSeleccionado && (
        <Modal
          isOpen={modalVer}
          onClose={() => {
            setModalVer(false);
            setSocioSeleccionado(null);
          }}
          title="Información Detallada del Socio"
          size="lg"
        >
          <div style={{
            display: 'grid',
            gap: '24px'
          }}>
            {/* Header con avatar y datos principales */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '20px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              borderRadius: '12px',
              color: 'white'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                fontSize: '24px',
                fontWeight: '700'
              }}>
                #{socios.indexOf(socioSeleccionado) + 1}
              </div>
              <div>
                <h3 style={{ 
                  margin: '0 0 4px 0', 
                  fontSize: '20px', 
                  fontWeight: '700' 
                }}>
                  {socioSeleccionado.nombre} {socioSeleccionado.apellido}
                </h3>
                <p style={{ 
                  margin: 0, 
                  opacity: 0.9,
                  fontSize: '14px' 
                }}>
                  {categorias.find(cat => cat.id === socioSeleccionado.tipo_membresia_id)?.nombre || 'Sin categoría'}
                </p>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: socioSeleccionado.estado === 'activo' 
                    ? 'rgba(16, 185, 129, 0.3)' 
                    : 'rgba(239, 68, 68, 0.3)',
                  border: `1px solid ${socioSeleccionado.estado === 'activo' ? '#10b981' : '#ef4444'}`,
                  textTransform: 'capitalize'
                }}>
                  {socioSeleccionado.estado}
                </span>
              </div>
            </div>

            {/* Información Personal */}
            <div>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#f9fafb',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <User size={18} />
                Información Personal
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>
                    Documento
                  </label>
                  <div style={{ color: '#f9fafb', fontWeight: '500' }}>
                    {socioSeleccionado.documento} ({socioSeleccionado.tipo_documento})
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>
                    Fecha de Nacimiento
                  </label>
                  <div style={{ color: '#f9fafb', fontWeight: '500' }}>
                    {socioSeleccionado.fecha_nacimiento ? new Date(socioSeleccionado.fecha_nacimiento).toLocaleDateString('es-ES') : 'No especificada'}
                  </div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>
                    Dirección
                  </label>
                  <div style={{ color: '#f9fafb', fontWeight: '500' }}>
                    {socioSeleccionado.direccion || 'No especificada'}
                  </div>
                </div>
              </div>
            </div>

            {/* Información de Contacto */}
            <div>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#f9fafb',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Mail size={18} />
                Información de Contacto
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>
                    Email
                  </label>
                  <div style={{ color: '#f9fafb', fontWeight: '500' }}>
                    {socioSeleccionado.email}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>
                    Teléfono
                  </label>
                  <div style={{ color: '#f9fafb', fontWeight: '500' }}>
                    {socioSeleccionado.telefono || 'No especificado'}
                  </div>
                </div>
              </div>
            </div>

            {/* Información de Membresía */}
            <div>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#f9fafb',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Calendar size={18} />
                Información de Membresía
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>
                    Fecha de Inicio
                  </label>
                  <div style={{ color: '#f9fafb', fontWeight: '500' }}>
                    {new Date(socioSeleccionado.fecha_inicio_membresia).toLocaleDateString('es-ES')}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>
                    Fecha de Registro
                  </label>
                  <div style={{ color: '#f9fafb', fontWeight: '500' }}>
                    {new Date(socioSeleccionado.created_at).toLocaleDateString('es-ES')}
                  </div>
                </div>
              </div>
            </div>

            {/* Observaciones */}
            {socioSeleccionado.observaciones && (
              <div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#f9fafb',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <FileText size={18} />
                  Observaciones
                </h4>
                <div style={{
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#f9fafb',
                  lineHeight: '1.6'
                }}>
                  {socioSeleccionado.observaciones}
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <button
                onClick={() => {
                  setModalVer(false);
                  setSocioSeleccionado(null);
                }}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'transparent',
                  color: '#9ca3af',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(156, 163, 175, 0.1)';
                  e.currentTarget.style.color = '#f9fafb';
                  e.currentTarget.style.borderColor = '#9ca3af';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#9ca3af';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                <X size={16} />
                Cerrar
              </button>
              
              <button
                onClick={() => {
                  setModalVer(false);
                  setModalEditar(true);
                  // socioSeleccionado ya está definido
                }}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                }}
              >
                <Edit3 size={16} />
                Editar
              </button>
            </div>
          </div>
        </Modal>
      )}
        </>
      )}
      </div>
      {!isSubModule && <GlobalFooter />}
    </div>
  );
};

export default SociosPage;