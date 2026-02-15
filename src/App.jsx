
import { Nav } from './UI/nav'
import './App.css'
import { RouterNav } from './router/routerNav'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/AuthContextCore'
import { Login } from './pages/login/Login'
import { Routes, Route, Navigate } from 'react-router-dom'

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  // Not authenticated: show login
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Authenticated: show app
  return (
    <>
      <Nav />
      <div className='container'>
        <RouterNav />
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App
