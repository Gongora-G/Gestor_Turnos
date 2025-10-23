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
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  MapPin
} from 'lucide-react';
import { CrearSocioModal } from '../components/CrearSocioModal';
import { VerSocioModal } from '../components/VerSocioModal';
import { GlobalNavigation } from '../components';
import { sociosService, type Socio } from '../services';

// Los datos de ejemplo se cargarán desde el backend

export const SociosPage: React.FC = () => {
  const [socios, setSocios] = useState<Socio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [filtroMembresia, setFiltroMembresia] = useState<string>('todas');
  const [socioSeleccionado, setSocioSeleccionado] = useState<Socio | null>(null);
  const [modalCrear, setModalCrear] = useState(false);
  const [modalVer, setModalVer] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);

  // Cargar socios del backend
  useEffect(() => {
    const cargarSocios = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // TEMPORALMENTE deshabilitado para evitar errores 401
        // const response = await sociosService.obtenerSocios();
        // setSocios(response);
        
        // Datos de ejemplo temporales
        setSocios([]);
        
      } catch (error) {
        console.error('Error al cargar socios:', error);
        setError('Error al conectar con el servidor');
        setSocios([]);
      } finally {
        setLoading(false);
      }
    };

    cargarSocios();
  }, []);

  // Función para eliminar socio
  const handleEliminarSocio = async (id: string) => {
    try {
      await sociosService.eliminarSocio(id);
      setSocios(prev => prev.filter(socio => socio.id !== id));
    } catch (error) {
      console.error('Error al eliminar socio:', error);
      setError('Error al eliminar el socio');
    }
  };

  // Función para actualizar socio
  const handleActualizarSocio = async (socioActualizado: Socio) => {
    try {
      const response = await sociosService.actualizarSocio(socioActualizado.id, {
        nombre: socioActualizado.nombre,
        apellido: socioActualizado.apellido,
        email: socioActualizado.email,
        telefono: socioActualizado.telefono,
        documento: socioActualizado.documento,
        tipo_documento: socioActualizado.tipo_documento,
        fecha_nacimiento: socioActualizado.fecha_nacimiento,
        direccion: socioActualizado.direccion,
        tipo_membresia_id: socioActualizado.tipo_membresia_id,
        fecha_inicio_membresia: socioActualizado.fecha_inicio_membresia,
        estado: socioActualizado.estado,
        observaciones: socioActualizado.observaciones
      });
      
      setSocios(prev => prev.map(socio => 
        socio.id === socioActualizado.id ? response : socio
      ));
    } catch (error) {
      console.error('Error al actualizar socio:', error);
      setError('Error al actualizar el socio');
    }
  };

  // Filtrar socios
  const sociosFiltrados = socios.filter(socio => {
    const matchSearch = socio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       socio.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       socio.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       socio.documento.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchEstado = filtroEstado === 'todos' || socio.estado === filtroEstado;
    const matchMembresia = filtroMembresia === 'todas' || socio.tipo_membresia?.nombre === filtroMembresia;
    
    return matchSearch && matchEstado && matchMembresia;
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
      'Tipo Membresía',
      'Fecha Registro',
      'Estado',
      'Dirección',
      'Observaciones'
    ];

    const csvContent = [
      headers.join(','),
      ...sociosFiltrados.map(socio => [
        socio.id,
        `"${socio.nombre}"`,
        `"${socio.apellido}"`,
        socio.email,
        socio.telefono,
        socio.fecha_nacimiento,
        socio.tipo_membresia?.nombre,
        socio.created_at,
        socio.estado,
        `"${socio.direccion || ''}"`,
        `"${socio.observaciones || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `socios_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Función para manejar importación de socios
  const handleImportarSocios = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        
        const nuevosSocios: Socio[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(',');
            const socio: Socio = {
              id: values[0] || `SOC${Date.now()}`,
              nombre: values[1]?.replace(/"/g, '') || '',
              apellido: values[2]?.replace(/"/g, '') || '',
              email: values[3] || '',
              telefono: values[4] || '',
              documento: values[5] || '',
              tipo_documento: 'cedula',
              fecha_nacimiento: values[6] || '',
              direccion: values[9]?.replace(/"/g, '') || '',
              tipo_membresia_id: '1',
              fecha_inicio_membresia: new Date().toISOString().split('T')[0],
              estado: (values[8] as 'activo' | 'inactivo' | 'suspendido') || 'activo',
              observaciones: values[10]?.replace(/"/g, '') || '',
              club_id: '1',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            nuevosSocios.push(socio);
          }
        }
        
        setSocios([...socios, ...nuevosSocios]);
        // Resetear el input file
        event.target.value = '';
      };
      reader.readAsText(file);
    }
  };

  const getTipoMembresiaColor = (tipo: string) => {
    switch (tipo) {
      case 'vip': return 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)';
      case 'premium': return 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)';
      case 'basica': return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
      default: return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      case 'inactivo': return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
      case 'suspendido': return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      default: return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
    }
  };

  const selectStyles = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '2px solid transparent',
    background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #3b82f6, #8b5cf6) border-box',
    fontSize: '14px',
    fontWeight: '500',
    color: '#1f2937',
    outline: 'none',
    transition: 'all 0.3s ease',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 12px center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '16px',
    paddingRight: '40px'
  };

  const inputStyles = {
    width: '100%',
    padding: '12px 16px',
    paddingLeft: '44px',
    borderRadius: '10px',
    border: '2px solid transparent',
    background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #3b82f6, #8b5cf6) border-box',
    fontSize: '14px',
    fontWeight: '500',
    color: '#1f2937',
    outline: 'none',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f0f23',
      color: '#fff',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <GlobalNavigation />
      <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '24px',
        border: '1px solid #374151',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              borderRadius: '12px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users size={24} color="white" />
            </div>
            <div>
              <h1 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#f9fafb',
                margin: 0,
                lineHeight: '1.2'
              }}>
                Gestión de Socios
              </h1>
              <p style={{
                fontSize: '16px',
                color: '#9ca3af',
                margin: '4px 0 0'
              }}>
                Administra la membresía del club de tenis
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={exportarSocios}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
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
              <Download size={16} />
              Exportar
            </button>

            <label
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
              }}
            >
              <input
                type="file"
                accept=".csv"
                onChange={handleImportarSocios}
                style={{ display: 'none' }}
              />
              <Upload size={16} />
              Importar
            </label>

            <button
              onClick={() => setModalCrear(true)}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
              }}
            >
              <Plus size={16} />
              Nuevo Socio
            </button>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Search 
              size={20} 
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6b7280',
                zIndex: 1
              }}
            />
            <input
              type="text"
              placeholder="Buscar por nombre, apellidos o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                ...inputStyles,
                ':focus': {
                  background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #8b5cf6, #3b82f6) border-box'
                }
              }}
              onFocus={(e) => {
                e.target.style.background = 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #8b5cf6, #3b82f6) border-box';
                e.target.style.transform = 'scale(1.02)';
              }}
              onBlur={(e) => {
                e.target.style.background = 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #3b82f6, #8b5cf6) border-box';
                e.target.style.transform = 'scale(1)';
              }}
            />
          </div>

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            style={selectStyles}
            onFocus={(e) => {
              e.target.style.background = 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #8b5cf6, #3b82f6) border-box';
              e.target.style.transform = 'scale(1.02)';
            }}
            onBlur={(e) => {
              e.target.style.background = 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #3b82f6, #8b5cf6) border-box';
              e.target.style.transform = 'scale(1)';
            }}
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
            <option value="suspendido">Suspendidos</option>
          </select>

          <select
            value={filtroMembresia}
            onChange={(e) => setFiltroMembresia(e.target.value)}
            style={selectStyles}
            onFocus={(e) => {
              e.target.style.background = 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #8b5cf6, #3b82f6) border-box';
              e.target.style.transform = 'scale(1.02)';
            }}
            onBlur={(e) => {
              e.target.style.background = 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #3b82f6, #8b5cf6) border-box';
              e.target.style.transform = 'scale(1)';
            }}
          >
            <option value="todas">Todas las membresías</option>
            <option value="basica">Básica</option>
            <option value="premium">Premium</option>
            <option value="vip">VIP</option>
          </select>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: '12px',
          padding: '20px',
          color: 'white',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
            {socios.filter(s => s.estado === 'activo').length}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>Socios Activos</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          borderRadius: '12px',
          padding: '20px',
          color: 'white',
          boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
            {socios.filter(s => s.tipo_membresia?.nombre === 'premium').length}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>Premium</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          borderRadius: '12px',
          padding: '20px',
          color: 'white',
          boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
            {socios.filter(s => s.tipo_membresia?.nombre === 'vip').length}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>VIP</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          borderRadius: '12px',
          padding: '20px',
          color: 'white',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
            {socios.length}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>Total</div>
        </div>
      </div>

      {/* Tabla de socios */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                  Socio
                </th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                  Contacto
                </th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                  Membresía
                </th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                  Estado
                </th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                  Registro
                </th>
                <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {sociosFiltrados.map((socio, index) => (
                <tr 
                  key={socio.id}
                  style={{
                    borderBottom: '1px solid #f3f4f6',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <td style={{ padding: '16px' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                        {socio.nombre} {socio.apellido}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        ID: {socio.id}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#374151' }}>
                        <Mail size={12} />
                        {socio.email}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#374151' }}>
                        <Phone size={12} />
                        {socio.telefono}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'white',
                      background: getTipoMembresiaColor(socio.tipo_membresia?.nombre || ''),
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                    }}>
                      {socio.tipo_membresia?.nombre}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'white',
                      background: getEstadoColor(socio.estado),
                      textTransform: 'capitalize',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                    }}>
                      {socio.estado}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#374151' }}>
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
                          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white',
                          padding: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.1)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
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
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white',
                          padding: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.1)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <Edit3 size={14} />
                      </button>
                      
                      <button
                        onClick={() => {
                          if (window.confirm('¿Está seguro de que desea eliminar este socio?')) {
                            setSocios(prev => prev.filter(s => s.id !== socio.id));
                          }
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white',
                          padding: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.1)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
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
            color: '#6b7280'
          }}>
            <Users size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <p style={{ fontSize: '16px', margin: 0 }}>
              No se encontraron socios con los filtros aplicados
            </p>
          </div>
        )}
      </div>

      {/* Resumen al final */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '14px'
      }}>
        Mostrando {sociosFiltrados.length} de {socios.length} socios
      </div>

      {/* Modales */}
      {modalCrear && (
        <CrearSocioModal
          isOpen={modalCrear}
          onClose={() => setModalCrear(false)}
          onSave={(formSocio) => {
            // Crear el objeto socio completo
            const nuevoSocio: Socio = {
              id: `SOC${Date.now()}`,
              nombre: formSocio.nombre,
              apellidos: formSocio.apellido,
              email: formSocio.email,
              telefono: formSocio.telefono,
              fechaNacimiento: '', // Este campo no está en el form, podrías agregarlo
              tipoMembresia: formSocio.tipoMembresia as 'basica' | 'premium' | 'vip',
              fechaRegistro: formSocio.fechaIngreso,
              estado: 'activo',
              direccion: formSocio.direccion,
              observaciones: ''
            };
            
            // Agregar el nuevo socio a la lista
            setSocios([...socios, nuevoSocio]);
            setModalCrear(false);
            // Aquí podrías mostrar una notificación de éxito
          }}
        />
      )}

      {modalVer && socioSeleccionado && (
        <VerSocioModal
          isOpen={modalVer}
          onClose={() => {
            setModalVer(false);
            setSocioSeleccionado(null);
          }}
          socio={socioSeleccionado}
        />
      )}

      {/* TODO: Implementar modal de editar */}
      </div>
    </div>
  );
};

export default SociosPage;