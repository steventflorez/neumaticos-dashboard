import React from 'react';
import { CardServicio } from './CardServicio';

export const ServiceList = ({ services, onEdit, onRefresh }) => {
    return (
        <div className="premium-card card-static mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h6 className="card-title mb-0 d-flex align-items-center">
                        <i className="bi bi-wrench me-2 text-info"></i>
                        Servicios Disponibles
                        <span className="badge bg-info bg-opacity-25 text-info ms-2">{services.length}</span>
                    </h6>
                </div>
                <div className="row g-4 stagger-children">
                    {services.length === 0 && (
                        <div className="col-12 text-center py-5">
                            <i className="bi bi-wrench display-3 text-muted d-block mb-3" style={{ opacity: 0.2 }}></i>
                            <h6 className="text-muted fw-normal">No hay servicios registrados</h6>
                            <p className="text-muted small">Añade un servicio con el botón superior</p>
                        </div>
                    )}
                    {services.map((service) => (
                        <CardServicio key={service.id} service={service} onEdit={onEdit} onRefresh={onRefresh} />
                    ))}
                </div>
            </div>
        </div>
    );
};
