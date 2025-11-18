import React, { useState, useEffect } from 'react';
import { Search, User, Star, DollarSign } from 'lucide-react';
import { caddiesService, type Caddie } from '../services/caddiesService';
import { boleadoresService, type Boleador } from '../services/boleadoresService';

interface PersonalSelectorProps {
  tipo: 'caddie' | 'boleador';
  clubId: string;
  fecha?: string;
  horaInicio?: string;
  horaFin?: string;
  selectedId?: string;
  onSelect: (persona: Caddie | Boleador | null) => void;
  disabled?: boolean;
}

export const PersonalSelector: React.FC<PersonalSelectorProps> = ({
  tipo,
  clubId,
  fecha,
  horaInicio,
  horaFin,
  selectedId,
  onSelect,
  disabled = false
}) => {
  const [personal, setPersonal] = useState<(Caddie | Boleador)[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const selectedPersonal = personal.find(p => p.id === selectedId);

  useEffect(() => {
    loadPersonal();
  }, [clubId, fecha, horaInicio, horaFin]);

  const loadPersonal = async () => {
    if (!clubId) return;
    
    setLoading(true);
    try {
      let data: (Caddie | Boleador)[] = [];
      
      if (fecha && horaInicio && horaFin) {
        // Buscar disponibles en horario específico
        if (tipo === 'caddie') {
          data = await caddiesService.getAvailable(clubId, fecha, horaInicio, horaFin);
        } else {
          data = await boleadoresService.getAvailable(clubId, fecha, horaInicio, horaFin);
        }
      } else {
        // Buscar todos los activos
        if (tipo === 'caddie') {
          data = await caddiesService.getAll(clubId);
        } else {
          data = await boleadoresService.getAll(clubId);
        }
      }
      
      setPersonal(data);
    } catch (error) {
      console.error(`Error cargando ${tipo}s:`, error);
      setPersonal([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPersonal = personal.filter(p =>
    `${p.nombre} ${p.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (persona: Caddie | Boleador | null) => {
    onSelect(persona);
    setShowDropdown(false);
    setSearchTerm('');
  };

  const getNivelInfo = (persona: Caddie | Boleador) => {
    if (tipo === 'caddie') {
      const nivel = (persona as Caddie).nivel_experiencia;
      return `Experiencia: ${nivel}/5`;
    } else {
      const boleador = persona as Boleador;
      return `${boleador.nivel_juego} (${boleador.ranking_habilidad}/10)`;
    }
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {tipo === 'caddie' ? 'Caddie' : 'Boleador'} {fecha && horaInicio && '(Disponibles en horario)'}
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setShowDropdown(!showDropdown)}
          disabled={disabled}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md text-left bg-white ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-400 cursor-pointer'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              {selectedPersonal ? (
                <span className="text-gray-900">
                  {selectedPersonal.nombre} {selectedPersonal.apellido}
                </span>
              ) : (
                <span className="text-gray-500">
                  Seleccionar {tipo === 'caddie' ? 'caddie' : 'boleador'}
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              {loading ? 'Cargando...' : `${filteredPersonal.length} disponibles`}
            </div>
          </div>
        </button>

        {showDropdown && !disabled && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {/* Barra de búsqueda */}
            <div className="p-2 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Opción "Sin asignar" */}
            <button
              type="button"
              onClick={() => handleSelect(null)}
              className="w-full px-3 py-2 text-left hover:bg-gray-50 border-b border-gray-100"
            >
              <span className="text-gray-500">Sin {tipo === 'caddie' ? 'caddie' : 'boleador'}</span>
            </button>

            {/* Lista de personal */}
            {filteredPersonal.length === 0 ? (
              <div className="px-3 py-4 text-center text-gray-500 text-sm">
                {loading ? 'Cargando...' : 'No hay personal disponible'}
              </div>
            ) : (
              filteredPersonal.map((persona) => (
                <button
                  key={persona.id}
                  type="button"
                  onClick={() => handleSelect(persona)}
                  className={`w-full px-3 py-3 text-left hover:bg-gray-50 border-b border-gray-100 ${
                    selectedId === persona.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">
                        {persona.nombre} {persona.apellido}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {getNivelInfo(persona)}
                        </span>
                        {persona.tarifa_por_hora && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            ${persona.tarifa_por_hora.toLocaleString()}/h
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      persona.estado === 'disponible' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {persona.estado}
                    </div>
                  </div>
                  {persona.telefono && (
                    <div className="text-xs text-gray-400 mt-1">
                      📞 {persona.telefono}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Información del personal seleccionado */}
      {selectedPersonal && (
        <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">{selectedPersonal.nombre} {selectedPersonal.apellido}</span>
              <div className="text-gray-600">{getNivelInfo(selectedPersonal)}</div>
            </div>
            {selectedPersonal.tarifa_por_hora && (
              <div className="text-right">
                <div className="font-medium text-green-600">
                  ${selectedPersonal.tarifa_por_hora.toLocaleString()}/h
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};