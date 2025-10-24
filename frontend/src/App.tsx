
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts';
import { ToastProvider } from './contexts/ToastContext';
import { ToastContainer } from './components/Toast';
import { ProtectedRoute, PublicRoute } from './components';
import { LoginPage, RegisterPage, DashboardPage, AuthCallbackPage, TermsOfServicePage, PrivacyPolicyPage, TurnosPage, CrearTurnoPage, ConfiguracionPage, JornadasPage } from './pages';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <RegisterPage />
                  </PublicRoute>
                }
              />
              
              {/* Auth Callback Route */}
              <Route
                path="/auth/callback"
                element={<AuthCallbackPage />}
              />

              {/* Legal Pages - Public */}
              <Route
                path="/terms-of-service"
                element={<TermsOfServicePage />}
              />
              <Route
                path="/privacy-policy"
                element={<PrivacyPolicyPage />}
              />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              
              {/* Turnos Routes */}
              <Route
                path="/turnos"
                element={
                  <ProtectedRoute>
                    <TurnosPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/turnos/nuevo"
                element={
                  <ProtectedRoute>
                    <CrearTurnoPage />
                  </ProtectedRoute>
                }
              />

              {/* Jornadas Routes */}
              <Route
                path="/jornadas"
                element={
                  <ProtectedRoute>
                    <JornadasPage />
                  </ProtectedRoute>
                }
              />

              {/* Configuración Routes */}
              <Route
                path="/configuracion"
                element={
                  <ProtectedRoute>
                    <ConfiguracionPage />
                  </ProtectedRoute>
                }
              />

              {/* Default Route */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Catch-all Route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
            
            {/* Toast Container */}
            <ToastContainer />
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
