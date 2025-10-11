
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts';
import { ProtectedRoute, PublicRoute } from './components';
import { LoginPage, RegisterPage, DashboardPage, AuthCallbackPage, TermsOfServicePage, PrivacyPolicyPage } from './pages';

function App() {
  return (
    <AuthProvider>
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

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Catch-all Route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
