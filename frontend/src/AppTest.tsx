import React from 'react';

function AppTest() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f0f23',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>
          ✅ App Test Funcionando
        </h1>
        <p style={{ fontSize: '18px', color: '#9ca3af' }}>
          El servidor de React está funcionando correctamente
        </p>
        <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '16px' }}>
          Si ves este mensaje, el problema está en el código de la aplicación principal
        </p>
      </div>
    </div>
  );
}

export default AppTest;