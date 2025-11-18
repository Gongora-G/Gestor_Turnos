import React, { useState, useEffect } from 'react';
import { canchasService, type CanchaBackend, type TipoSuperficieCancha, type EstadoCancha } from '../../services/canchasService';
import { useToast } from '../../contexts/ToastContext';

interface Props {
  cancha: CanchaBackend | null;
  tiposSuperficie: TipoSuperficieCancha[];
  estados: EstadoCancha[];
  onClose: () => void;
  onSuccess: () => void;
}

const CanchaModal: React.FC<Props> = ({ cancha, tiposSuperficie, estados, onClose, onSuccess }) => {
  const { success, error: showError } = useToast();
  const [formData, setFormData] = useState({
    nombre: '',
    numero: '',
    ubicacion: '',
    descripcion: '',
    capacidad: '4',
    tipo: '',
    precioHora: '',
    superficieId: '',
    estadoId: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cancha) {
      setFormData({
        nombre: cancha.nombre,
        numero: cancha.numero?.toString() || '',
        ubicacion: cancha.ubicacion || '',
        descripcion: cancha.descripcion || '',
        capacidad: cancha.capacidad.toString(),
        tipo: cancha.tipo || '',
        precioHora: cancha.precioHora?.toString() || '',
        superficieId: cancha.superficieId?.toString() || '',
        estadoId: cancha.estadoId?.toString() || '',
      });
    }
  }, [cancha]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data: any = {
        nombre: formData.nombre,
        numero: formData.numero ? Number(formData.numero) : undefined,
        ubicacion: formData.ubicacion || undefined,
        descripcion: formData.descripcion || undefined,
        capacidad: Number(formData.capacidad),
        tipo: formData.tipo || undefined,
        precio_hora: formData.precioHora ? Number(formData.precioHora) : undefined,
        superficieId: formData.superficieId && formData.superficieId !== '' ? Number(formData.superficieId) : undefined,
        estadoId: formData.estadoId && formData.estadoId !== '' ? Number(formData.estadoId) : undefined,
      };

      if (cancha) {
        await canchasService.actualizarCancha(cancha.id, data);
        success('Cancha actualizada', `La cancha "${formData.nombre}" ha sido actualizada exitosamente`);
      } else {
        await canchasService.crearCancha(data as CrearCanchaDto);
        success('Cancha creada', `La cancha "${formData.nombre}" ha sido creada exitosamente`);
      }

      onSuccess();
    } catch (error) {
      console.error('Error al guardar:', error);
      showError('Error al guardar', 'No se pudo guardar la cancha. Por favor, intenta de nuevo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '700px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
          border: '1px solid #374151',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            padding: '12px',
            background: cancha ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            borderRadius: '12px',
            display: 'flex'
          }}>
            <svg width="24" height="24" fill="none" stroke={cancha ? '#3b82f6' : '#10b981'} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h2 style={{ 
              color: '#f9fafb', 
              fontSize: '24px', 
              fontWeight: '700', 
              margin: 0,
              marginBottom: '4px'
            }}>
              {cancha ? '✏️ Editar Cancha' : '➕ Nueva Cancha'}
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>
              {cancha ? 'Modifica la información de la cancha' : 'Completa los datos para crear una nueva cancha'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            {/* Nombre */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#d1d5db', marginBottom: '8px' }}>
                🏟️ Nombre *
              </label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '10px',
                  color: '#f9fafb',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#10b981'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#374151'}
                placeholder="Ej: Cancha Central"
              />
            </div>

            {/* Número */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#d1d5db', marginBottom: '8px' }}>
                🔢 Número
              </label>
              <input
                type="number"
                value={formData.numero}
                onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '10px',
                  color: '#f9fafb',
                  fontSize: '14px',
                  outline: 'none'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#10b981'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#374151'}
                min="1"
                placeholder="1"
              />
            </div>

            {/* Capacidad */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#d1d5db', marginBottom: '8px' }}>
                👥 Capacidad *
              </label>
              <input
                type="number"
                required
                value={formData.capacidad}
                onChange={(e) => setFormData({ ...formData, capacidad: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '10px',
                  color: '#f9fafb',
                  fontSize: '14px',
                  outline: 'none'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#10b981'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#374151'}
                min="1"
              />
            </div>

            {/* Tipo de Superficie */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#d1d5db', marginBottom: '8px' }}>
                🎨 Tipo de Superficie
              </label>
              <select
                value={formData.superficieId}
                onChange={(e) => setFormData({ ...formData, superficieId: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '10px',
                  color: '#f9fafb',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#10b981'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#374151'}
              >
                <option value="" style={{ background: '#111827' }}>Seleccionar...</option>
                {tiposSuperficie.map(tipo => (
                  <option key={tipo.id} value={tipo.id} style={{ background: '#111827' }}>{tipo.nombre}</option>
                ))}
              </select>
            </div>

            {/* Estado */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#d1d5db', marginBottom: '8px' }}>
                📊 Estado
              </label>
              <select
                value={formData.estadoId}
                onChange={(e) => setFormData({ ...formData, estadoId: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '10px',
                  color: '#f9fafb',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#10b981'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#374151'}
              >
                <option value="" style={{ background: '#111827' }}>Seleccionar...</option>
                {estados.map(estado => (
                  <option key={estado.id} value={estado.id} style={{ background: '#111827' }}>{estado.nombre}</option>
                ))}
              </select>
            </div>

            {/* Ubicación */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#d1d5db', marginBottom: '8px' }}>
                📍 Ubicación
              </label>
              <input
                type="text"
                value={formData.ubicacion}
                onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '10px',
                  color: '#f9fafb',
                  fontSize: '14px',
                  outline: 'none'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#10b981'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#374151'}
                placeholder="Ej: Planta baja, Sector A"
              />
            </div>

            {/* Tipo de Deporte - COMENTADO: Sistema enfocado solo en tenis */}
            {/* <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#d1d5db', marginBottom: '8px' }}>
                🎾 Tipo de Deporte
              </label>
              <input
                type="text"
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '10px',
                  color: '#f9fafb',
                  fontSize: '14px',
                  outline: 'none'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#10b981'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#374151'}
                placeholder="Ej: Tenis"
              />
            </div> */}

            {/* Precio por Hora - COMENTADO: No necesario por ahora */}
            {/* <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#d1d5db', marginBottom: '8px' }}>
                💵 Precio por Hora
              </label>
              <input
                type="number"
                value={formData.precioHora}
                onChange={(e) => setFormData({ ...formData, precioHora: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '10px',
                  color: '#f9fafb',
                  fontSize: '14px',
                  outline: 'none'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#10b981'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#374151'}
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div> */}

            {/* Descripción */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#d1d5db', marginBottom: '8px' }}>
                📝 Descripción
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '10px',
                  color: '#f9fafb',
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'vertical',
                  minHeight: '80px'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#10b981'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#374151'}
                rows={3}
                placeholder="Información adicional sobre la cancha..."
              />
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '12px 24px',
                background: 'transparent',
                border: '1px solid #374151',
                borderRadius: '10px',
                color: '#d1d5db',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: loading ? 0.5 : 1
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.background = '#1f2937')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 32px',
                background: loading ? '#6b7280' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: loading ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {loading ? '⏳ Guardando...' : cancha ? '💾 Actualizar' : '✅ Crear Cancha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CanchaModal;
