import React, { useState } from 'react';
import { AppLayout } from '../components';
import GestionCanchas from '../components/canchas/GestionCanchas';
import TiposSuperficie from '../components/canchas/TiposSuperficie';
import EstadosCanchas from '../components/canchas/EstadosCanchas';

type TabType = 'canchas' | 'superficies' | 'estados';

const Canchas: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('canchas');

  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Canchas</h1>
          <p className="text-gray-600 mt-2">
            Administra las canchas, tipos de superficie y estados del club
          </p>
        </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('canchas')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${activeTab === 'canchas'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Gestión de Canchas
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('superficies')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${activeTab === 'superficies'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Tipos de Superficie
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('estados')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${activeTab === 'estados'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Estados de Cancha
            </span>
          </button>
        </nav>
      </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'canchas' && <GestionCanchas />}
          {activeTab === 'superficies' && <TiposSuperficie />}
          {activeTab === 'estados' && <EstadosCanchas />}
        </div>
      </div>
    </AppLayout>
  );
};

export default Canchas;
