import React from 'react'

export const Proximamente = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center animate-fade-in" style={{ minHeight: '60vh' }}>
      <div className="text-center">
        <div className="mb-4" style={{ opacity: 0.2 }}>
          <i className="bi bi-rocket-takeoff display-1"></i>
        </div>
        <h2 className="fw-bold mb-2">Próximamente</h2>
        <p className="text-muted fs-5 mb-4" style={{ maxWidth: '400px' }}>
          Estamos trabajando en esta sección. Pronto tendrás acceso a nuevas funcionalidades.
        </p>
        <div className="d-flex justify-content-center gap-2">
          <span className="badge bg-info bg-opacity-25 text-info py-2 px-3">
            <i className="bi bi-gear-wide-connected me-1"></i> En desarrollo
          </span>
        </div>
      </div>
    </div>
  )
}
