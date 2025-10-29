import React from 'react';
import { GlobalNavigation, GlobalFooter } from '../components';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#0f0f23',
      color: '#ffffff',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <GlobalNavigation />
      
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {children}
      </main>
      
      <GlobalFooter />
    </div>
  );
};

export default AppLayout;