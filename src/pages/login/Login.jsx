import { useState } from 'react';
import { useAuth } from '../../context/AuthContextCore';
import { useNavigate } from 'react-router-dom';
import './login.css';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            navigate('/', { replace: true });
        } catch (err) {
            const msg = err.message || 'Error al iniciar sesión';
            if (msg.includes('Invalid login credentials')) {
                setError('Credenciales incorrectas. Verifica tu email y contraseña.');
            } else if (msg.includes('Email not confirmed')) {
                setError('Tu email no ha sido confirmado.');
            } else {
                setError(msg);
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">
                    <i className="bi bi-gear-fill"></i>
                </div>
                <h1 className="login-title">28 Ruedas</h1>
                <p className="login-subtitle">Panel de Gestión</p>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="login-error mb-3">
                            <i className="bi bi-exclamation-triangle-fill"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="mb-3">
                        <label htmlFor="login-email" className="form-label">
                            Email
                        </label>
                        <input
                            id="login-email"
                            type="email"
                            className="form-control"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                            disabled={isLoading}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="login-password" className="form-label">
                            Contraseña
                        </label>
                        <div className="position-relative">
                            <input
                                id="login-password"
                                type={showPassword ? 'text' : 'password'}
                                className="form-control"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                                style={{ paddingRight: '2.5rem' }}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="login-btn btn"
                        disabled={isLoading}
                    >
                        {isLoading && <span className="login-spinner"></span>}
                        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                </form>
            </div>
        </div>
    );
}
