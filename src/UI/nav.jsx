import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContextCore'

export const Nav = () => {
  const location = useLocation();
  const { profile, logout, isAdmin } = useAuth();

  const allLinks = [
    { to: '/', icon: 'bi-cart3', label: 'Venta', roles: ['administrador', 'trabajador'] },
    { to: '/inventario', icon: 'bi-archive', label: 'Inventario', roles: ['administrador', 'trabajador'] },
    { to: '/facturas', icon: 'bi-file-earmark-text', label: 'Facturas', roles: ['administrador', 'trabajador'] },
    { to: '/dashboard', icon: 'bi-graph-up-arrow', label: 'Dashboard', roles: ['administrador'] },
    { to: '/caja', icon: 'bi-cash-stack', label: 'Caja', roles: ['administrador', 'trabajador'] },
  ];

  // Filter links by user role
  const links = allLinks.filter(link => {
    if (!profile) return false;
    return link.roles.includes(profile.role);
  });

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  const roleBadgeStyle = {
    fontSize: '0.65rem',
    padding: '0.2em 0.6em',
    borderRadius: 'var(--radius-full)',
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    background: isAdmin() ? 'var(--color-accent-muted)' : 'var(--color-success-muted)',
    color: isAdmin() ? 'var(--color-accent)' : 'var(--color-success)',
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-premium mb-5 sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <div className="d-flex align-items-center justify-content-center rounded-circle me-2"
            style={{ width: '36px', height: '36px', background: 'var(--color-accent-muted)' }}>
            <i className="bi bi-gear-fill text-info small"></i>
          </div>
          <span className="fw-bold" style={{ letterSpacing: '-0.03em' }}>28 Ruedas</span>
        </Link>
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarColor01">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {links.map(({ to, icon, label }) => (
              <li key={to} className="nav-item mx-1">
                <Link
                  to={to}
                  className={`nav-link px-3 d-flex align-items-center ${isActive(to) ? 'active' : ''}`}
                >
                  <i className={`bi ${icon} me-2`}></i>
                  {label}
                </Link>
              </li>
            ))}

            {/* User info & logout */}
            <li className="nav-item mx-1 d-flex align-items-center ms-lg-3">
              <div className="d-flex align-items-center gap-2 px-3 py-1"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                }}>
                <i className="bi bi-person-circle" style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}></i>
                <div className="d-flex flex-column" style={{ lineHeight: 1.2 }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-primary)', fontWeight: 500 }}>
                    {profile?.full_name || 'Usuario'}
                  </span>
                  <span style={roleBadgeStyle}>
                    {profile?.role || 'trabajador'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-sm ms-2 p-1 d-flex align-items-center"
                  style={{
                    background: 'var(--color-danger-muted)',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-danger)',
                    fontSize: '0.85rem',
                  }}
                  title="Cerrar sesión"
                >
                  <i className="bi bi-box-arrow-right"></i>
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
