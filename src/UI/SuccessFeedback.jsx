import React from 'react';
import PropTypes from 'prop-types';

export const SuccessFeedback = ({ show, message }) => {
    if (!show) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1060, // Higher than Bootstrap modals (1055)
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            transition: 'all 0.3s ease-in-out'
        }}>
            <div className="card text-center p-4 border-0 shadow-lg animate-fade-in" style={{
                maxWidth: '400px',
                borderRadius: '16px',
                backgroundColor: 'var(--bs-body-bg)', // Adapts to theme if set, otherwise default white/dark
                color: 'var(--bs-body-color)'
            }}>
                <div className="mb-3">
                    <div className="rounded-circle d-inline-flex align-items-center justify-content-center" style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: 'rgba(25, 135, 84, 0.1)', // Success green tint
                    }}>
                        <i className="bi bi-check-lg text-success" style={{ fontSize: '3rem' }}></i>
                    </div>
                </div>
                <h4 className="fw-bold mb-2">¡Éxito!</h4>
                <p className="text-muted mb-0 fs-5">{message}</p>
            </div>
        </div>
    );
};

SuccessFeedback.propTypes = {
    show: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
};
