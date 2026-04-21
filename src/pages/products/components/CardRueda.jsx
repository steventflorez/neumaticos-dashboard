import React, { useState } from 'react'
import PropTypes from "prop-types";
import { useDispatch } from 'react-redux';
import { startSetEdit, startSetProductSlice } from '../../../store/products/thunks';
import { deleteTireWithProduct } from '../../../data/products/Tire';

export const CardRueda = ({ tire }) => {
    const dispatch = useDispatch();
    const [cantidad, setCantidad] = useState('');
    const [showCantidad, setShowCantidad] = useState(false);
    const [added, setAdded] = useState(false);
    const [stockError, setStockError] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        try {
            setDeleting(true);
            await deleteTireWithProduct(tire.id);
            window.location.reload();
        } catch (error) {
            console.error('Error al eliminar neumático:', error);
        } finally {
            setDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const setState = () => {
        dispatch(startSetEdit(true))
        dispatch(startSetProductSlice(tire))
    }

    const handleAddToCart = () => {
        const count = parseInt(cantidad);
        if (!count || count <= 0) return;

        const stock = tire.product?.stock || 0;
        const products = JSON.parse(localStorage.getItem('productsCar')) || [];

        // Verificar si ya existe en el carrito
        const existingIdx = products.findIndex(item => item.tire?.id === tire.id);
        const countInCart = existingIdx >= 0 ? parseInt(products[existingIdx].count) : 0;

        if ((countInCart + count) > stock) {
            setStockError(`Stock insuficiente. Disponible: ${stock - countInCart} u.`);
            return;
        }

        setStockError('');

        if (existingIdx >= 0) {
            products[existingIdx].count = countInCart + count;
        } else {
            products.push({ tire, count });
        }

        localStorage.setItem('productsCar', JSON.stringify(products));
        setCantidad('');
        setShowCantidad(false);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    if (!tire?.product) {
        return null;
    }

    return (
        <div className="col-12 col-md-6 col-xl-4 animate-fade-in">
            <div className="premium-card h-100">
                <div className="card-body p-4">
                    {/* Header: Brand and Badge */}
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center">
                            <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                style={{ width: '42px', height: '42px', background: 'var(--color-accent-muted)' }}>
                                <i className="bi bi-circle text-info"></i>
                            </div>
                            <div>
                                <h6 className="fw-bold mb-0">{tire.product?.name || 'Sin nombre'}</h6>
                                <small className="text-muted" style={{ fontSize: '0.75rem' }}>Neumático</small>
                            </div>
                        </div>
                        <div className="text-end">
                            <span className={`badge ${tire.is_new
                                ? 'bg-success bg-opacity-25 text-success'
                                : 'bg-warning bg-opacity-25 text-warning'
                                }`}>
                                {tire.is_new ? 'Nueva' : 'Ocasión'} {tire.percentaje}%
                            </span>
                            {tire.is_snow && (
                                <div className="mt-1">
                                    <i className="bi bi-snow2 text-info small" title="Nieve"></i>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Info: Measurements */}
                    <div className="rounded-3 p-3 mb-3" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)' }}>
                        <div className="row g-0">
                            <div className="col-4 text-center" style={{ borderRight: '1px solid var(--color-border)' }}>
                                <div className="text-muted small mb-1">Ancho</div>
                                <div className="fw-bold fs-5">{tire.width}</div>
                            </div>
                            <div className="col-4 text-center" style={{ borderRight: '1px solid var(--color-border)' }}>
                                <div className="text-muted small mb-1">Alto</div>
                                <div className="fw-bold fs-5">{tire.height}</div>
                            </div>
                            <div className="col-4 text-center">
                                <div className="text-muted small mb-1">Radio</div>
                                <div className="fw-bold fs-5">R{tire.diameter}</div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Info */}
                    <div className="row g-2 mb-4">
                        <div className="col-6">
                            <div className="d-flex align-items-center text-muted small">
                                <i className="bi bi-speedometer2 me-2"></i>
                                <span>{tire.load_index}{tire.speed_index?.code || 'N/A'}</span>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="d-flex align-items-center text-muted small">
                                <i className="bi bi-box-seam me-2"></i>
                                Stock: <span className="fw-bold ms-1" style={{ color: 'var(--color-warning)' }}>{tire.product?.stock || 0} u.</span>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="d-flex align-items-center text-muted small">
                                <i className="bi bi-calendar3 me-2"></i>
                                Año: <span className="fw-medium text-white ms-1">{tire.year || 'N/A'}</span>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="d-flex align-items-center small">
                                <i className="bi bi-tag me-2 text-muted"></i>
                                <span className="fw-bold text-info">€ {tire.product?.price || '0.00'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {tire.description && (
                        <div className="mb-4 p-2 rounded" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)' }}>
                            <p className="small text-muted mb-0 fst-italic">"{tire.description}"</p>
                        </div>
                    )}

                    {/* Inline Quantity Input */}
                    {showCantidad && (
                        <div className="mb-3 animate-fade-in">
                            <div className="input-group">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Cantidad"
                                    min="1"
                                    max={tire.product?.stock || 0}
                                    value={cantidad}
                                    onChange={(e) => { setCantidad(e.target.value); setStockError(''); }}
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
                            {stockError && (
                                <small className="text-danger mt-1 d-block">
                                    <i className="bi bi-exclamation-triangle me-1"></i>{stockError}
                                </small>
                            )}
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
                            <span><i className="bi bi-exclamation-triangle me-1"></i>¿Eliminar este neumático?</span>
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
                            data-bs-toggle="modal"
                            data-bs-target="#ruedaModal"
                            className="btn btn-outline-light btn-sm flex-fill d-flex align-items-center justify-content-center"
                            onClick={setState}
                        >
                            <i className="bi bi-pencil-square me-2"></i> Editar
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary btn-sm flex-fill d-flex align-items-center justify-content-center"
                            onClick={() => setShowCantidad(!showCantidad)}
                        >
                            <i className="bi bi-cart-plus me-2"></i> Venta
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-danger btn-sm d-flex align-items-center justify-content-center"
                            onClick={() => setShowDeleteConfirm(true)}
                            title="Eliminar neumático"
                        >
                            <i className="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

CardRueda.propTypes = {
    tire: PropTypes.object.isRequired,
}