import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContextCore';

/**
 * ProtectedRoute — wrapper para rutas que requieren autenticación.
 * 
 * Props:
 *   - allowedRoles: array de roles permitidos (ej: ['administrador'])
 *                   Si no se pasa, cualquier usuario autenticado puede acceder.
 *   - children: el contenido de la ruta
 */
export function ProtectedRoute({ children, allowedRoles }) {
    const { user, profile, loading } = useAuth();

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="spinner-border text-info" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    // Not authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check role if specified
    if (allowedRoles && allowedRoles.length > 0) {
        if (!profile || !allowedRoles.includes(profile.role)) {
            // Redirect to home if user doesn't have the required role
            return <Navigate to="/" replace />;
        }
    }

    return children;
}
