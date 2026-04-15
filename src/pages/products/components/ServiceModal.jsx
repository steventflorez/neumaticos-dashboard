import React, { useState, useEffect } from 'react';

export const ServiceModal = ({ isEditMode, initialData, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        suggested_price: '',
        description: ''
    });

    useEffect(() => {
        if (isEditMode && initialData) {
            setFormData({
                name: initialData.name || '',
                suggested_price: initialData.suggested_price || '',
                description: initialData.description || ''
            });
        } else {
            setFormData({ name: '', suggested_price: '', description: '' });
        }
    }, [isEditMode, initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.suggested_price) return;
        onSubmit({
            ...formData,
            suggested_price: parseFloat(formData.suggested_price)
        });
    };

    return (
        <div className="modal fade" id="servicioModal" tabIndex="-1" aria-labelledby="servicioModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title fw-bold d-flex align-items-center" id="servicioModalLabel">
                                <div className="rounded-3 d-flex align-items-center justify-content-center me-3"
                                    style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(139,92,246,0.1))' }}>
                                    <i className="bi bi-wrench" style={{ color: '#a855f7' }}></i>
                                </div>
                                {isEditMode ? 'Editar Servicio' : 'Nuevo Servicio'}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row g-3">
                                <div className="col-12">
                                    <label htmlFor="service_name" className="form-label">Nombre del servicio *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="service_name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="ej. Cambio de aceite"
                                        required
                                    />
                                </div>
                                <div className="col-12">
                                    <label htmlFor="service_price" className="form-label">Precio sugerido (€) *</label>
                                    <div className="input-group">
                                        <span className="input-group-text">€</span>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="service_price"
                                            name="suggested_price"
                                            value={formData.suggested_price}
                                            onChange={handleChange}
                                            placeholder="ej. 25.00"
                                            step="0.01"
                                            min="0"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <label htmlFor="service_description" className="form-label">Descripción</label>
                                    <textarea
                                        className="form-control"
                                        id="service_description"
                                        name="description"
                                        rows="3"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Describe el servicio..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-light" data-bs-dismiss="modal">Cancelar</button>
                            <button
                                type="submit"
                                className="btn btn-primary d-flex align-items-center"
                                disabled={!formData.name.trim() || !formData.suggested_price}
                            >
                                <i className={`bi ${isEditMode ? 'bi-check-lg' : 'bi-plus-lg'} me-2`}></i>
                                {isEditMode ? 'Guardar Cambios' : 'Crear Servicio'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
