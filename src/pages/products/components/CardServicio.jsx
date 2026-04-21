import React, { useState } from 'react';
import { deleteService } from '../../../data/services/Service';

export const CardServicio = ({ service, onEdit, onRefresh }) => {
    const [cantidad, setCantidad] = useState('');
    const [showCantidad, setShowCantidad] = useState(false);
    const [added, setAdded] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        try {
            setDeleting(true);
            await deleteService(service.id);
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error('Error al eliminar servicio:', error);
        } finally {
            setDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const handleAddToCart = () => {
        const count = parseInt(cantidad);
        if (!count || count <= 0) return;

        // Crear un item compatible con el carrito existente
        // Usa la misma forma {tire: {product: {...}}, count} para compatibilidad
        const cartItem = {
            tire: {
                id: `service-${service.id}`,
                width: '',
                height: '',
                diameter: '',
                load_index: '',
                is_new: true,
                speed_index: null,
                product: {
                    id: `service-${service.id}`,
                    name: service.name,
                    price: service.suggested_price,
                    stock: 9999
                }
            },
            count: count,
            isService: true
        };

        const products = JSON.parse(localStorage.getItem('productsCar')) || [];

        // Verificar si ya existe
        const existingIdx = products.findIndex(item => item.tire?.id === `service-${service.id}`);
        if (existingIdx >= 0) {
            products[existingIdx].count = parseInt(products[existingIdx].count) + count;
        } else {
            products.push(cartItem);
        }

        localStorage.setItem('productsCar', JSON.stringify(products));
        setCantidad('');
        setShowCantidad(false);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    return (
        <div className="col-12 col-md-6 col-xl-4 animate-fade-in">
            <div className="premium-card h-100">
                <div className="card-body p-4">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center">
                            <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(139,92,246,0.1))' }}>
                                <i className="bi bi-wrench" style={{ color: '#a855f7' }}></i>
                            </div>
                            <div>
                                <h6 className="fw-bold mb-0">{service.name}</h6>
                                <small className="text-muted" style={{ fontSize: '0.75rem' }}>Servicio</small>
                            </div>
                        </div>
                        <span className="badge" style={{ background: 'rgba(168,85,247,0.15)', color: '#a855f7' }}>
                            <i className="bi bi-tools me-1"></i>Servicio
                        </span>
                    </div>

                    {/* Description */}
                    {service.description && (
                        <div className="mb-3 p-2 rounded" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)' }}>
                            <p className="small text-muted mb-0 fst-italic">"{service.description}"</p>
                        </div>
                    )}

                    {/* Price */}
                    <div className="rounded-3 p-3 mb-3" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)' }}>
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted small">Precio sugerido</span>
                            <span className="fw-bold text-info fs-5">€ {service.suggested_price}</span>
                        </div>
                    </div>

                    {/* Cantidad inline */}
                    {showCantidad && (
                        <div className="mb-3 animate-fade-in">
                            <div className="input-group">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Cantidad"
                                    min="1"
                                    value={cantidad}
                                    onChange={(e) => setCantidad(e.target.value)}
                                    autoFocus
                                />
                                <button
                                    className="btn btn-primary d-flex align-items-center"
                                    onClick={handleAddToCart}
                                    disabled={!cantidad || parseInt(cantidad) <= 0}
                                >
                                    <i className="bi bi-cart-check me-1"></i>Añadir
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Success feedback */}
                    {added && (
                        <div className="alert alert-success py-2 mb-3 d-flex align-items-center small animate-fade-in" role="alert">
                            <i className="bi bi-check-circle me-2"></i>
                            Añadido al carrito
                        </div>
                    )}

                    {/* Delete Confirmation */}
                    {showDeleteConfirm && (
                        <div className="alert alert-danger py-2 mb-3 d-flex align-items-center justify-content-between small animate-fade-in" role="alert">
                            <span><i className="bi bi-exclamation-triangle me-1"></i>¿Eliminar este servicio?</span>
                            <div className="d-flex gap-1">
                                <button
                                    className="btn btn-danger btn-sm px-2 py-0"
                                    onClick={handleDelete}
                                    disabled={deleting}
                                >
                                    {deleting ? <i className="bi bi-hourglass-split"></i> : 'Sí'}
                                </button>
                                <button
                                    className="btn btn-outline-light btn-sm px-2 py-0"
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={deleting}
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="d-flex gap-2">
                        <button
                            type="button"
                            className="btn btn-outline-light btn-sm flex-fill d-flex align-items-center justify-content-center"
                            onClick={() => onEdit(service)}
                        >
                            <i className="bi bi-pencil-square me-2"></i>Editar
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary btn-sm flex-fill d-flex align-items-center justify-content-center"
                            onClick={() => setShowCantidad(!showCantidad)}
                        >
                            <i className="bi bi-cart-plus me-2"></i>Venta
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-danger btn-sm d-flex align-items-center justify-content-center"
                            onClick={() => setShowDeleteConfirm(true)}
                            title="Eliminar servicio"
                        >
                            <i className="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
