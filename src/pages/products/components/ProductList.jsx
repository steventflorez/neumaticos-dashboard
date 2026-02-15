import React from 'react';
import { CardRueda } from './CardRueda';

export const ProductList = ({ tires }) => {
    return (
        <div className="premium-card card-static mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h6 className="card-title mb-0 d-flex align-items-center">
                        <i className="bi bi-grid me-2 text-info"></i>
                        Resultados
                        <span className="badge bg-info bg-opacity-25 text-info ms-2">{tires.length}</span>
                    </h6>
                    <div className="d-flex align-items-center text-muted small">
                        <i className="bi bi-box-seam me-2"></i>
                        Stock total: <strong className="text-white ms-1">{tires.reduce((acc, tire) => acc + (tire.product?.stock || 0), 0)}</strong>
                    </div>
                </div>
                <div className="row g-4 stagger-children">
                    {tires.length === 0 && (
                        <div className="col-12 text-center py-5">
                            <i className="bi bi-search display-3 text-muted d-block mb-3" style={{ opacity: 0.2 }}></i>
                            <h6 className="text-muted fw-normal">No se encontraron resultados</h6>
                            <p className="text-muted small">Prueba ajustando los filtros de búsqueda</p>
                        </div>
                    )}
                    {tires.map((tire) => (
                        <CardRueda key={tire.id} tire={tire} />
                    ))}
                </div>
            </div>
        </div>
    );
};
