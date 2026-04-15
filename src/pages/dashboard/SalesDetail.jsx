import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSalesByCreationDate, deleteSale } from '../../data/products/Tire';

const periodConfig = {
    day: {
        label: 'Hoy',
        icon: 'bi-sun',
        getRange: () => {
            const today = new Date();
            const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
            const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();
            return { start, end };
        }
    },
    week: {
        label: 'Esta Semana',
        icon: 'bi-calendar-week',
        getRange: () => {
            const today = new Date();
            const firstDay = new Date(today);
            firstDay.setDate(today.getDate() - today.getDay());
            const start = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate()).toISOString();
            const end = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate() + 7).toISOString();
            return { start, end };
        }
    },
    month: {
        label: 'Este Mes',
        icon: 'bi-calendar-month',
        getRange: () => {
            const today = new Date();
            const start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
            const end = new Date(today.getFullYear(), today.getMonth() + 1, 1).toISOString();
            return { start, end };
        }
    }
};

const paymentLabel = (method) => {
    switch (String(method)) {
        case '1': return { text: 'Efectivo', icon: 'bi-cash', cls: 'bg-success bg-opacity-25 text-success' };
        case '2': return { text: 'Tarjeta', icon: 'bi-credit-card', cls: 'bg-info bg-opacity-25 text-info' };
        case '3': return { text: 'Transferencia', icon: 'bi-bank', cls: 'bg-warning bg-opacity-25 text-warning' };
        default: return { text: 'Otro', icon: 'bi-question-circle', cls: 'bg-secondary bg-opacity-25 text-secondary' };
    }
};

export const SalesDetail = () => {
    const { period } = useParams();
    const navigate = useNavigate();
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedSale, setExpandedSale] = useState(null);
    const [saleToDelete, setSaleToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const config = periodConfig[period] || periodConfig.day;

    useEffect(() => {
        fetchSales();
    }, [period]);

    const fetchSales = async () => {
        setLoading(true);
        try {
            const { start, end } = config.getRange();
            const data = await getSalesByCreationDate(start, end);
            setSales(data);
        } catch (error) {
            console.error('Error al obtener ventas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSale = async () => {
        if (!saleToDelete) return;
        setDeleting(true);
        try {
            await deleteSale(saleToDelete.id);
            setSales(prev => prev.filter(s => s.id !== saleToDelete.id));
            setSaleToDelete(null);
            // Cerrar modal
            // eslint-disable-next-line no-undef
            const modalEl = document.getElementById('deleteSaleDetailModal');
            // eslint-disable-next-line no-undef
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            if (modalInstance) modalInstance.hide();
        } catch (error) {
            console.error('Error al eliminar la venta:', error);
        } finally {
            setDeleting(false);
        }
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const formatTime = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    };

    const totalGeneral = sales.reduce((sum, s) => sum + Number(s.total_amount), 0);

    return (
        <>
            {/* Header */}
            <div className="row mb-4 align-items-center animate-fade-in">
                <div className="col-12 col-lg-8">
                    <div className="d-flex align-items-center mb-1">
                        <button
                            className="btn btn-outline-light btn-sm me-3 d-flex align-items-center"
                            onClick={() => navigate('/dashboard')}
                        >
                            <i className="bi bi-arrow-left me-1"></i>Volver
                        </button>
                        <h1 className="fw-bold mb-0">
                            <i className={`bi ${config.icon} text-info me-2`}></i>
                            Ventas — {config.label}
                        </h1>
                    </div>
                    <p className="text-muted fs-6 mb-0 ms-5 ps-4">
                        Listado completo de ventas del periodo seleccionado
                    </p>
                </div>
                <div className="col-12 col-lg-4 mt-3 mt-lg-0 text-lg-end">
                    <span className="badge bg-info bg-opacity-25 text-info fs-6 py-2 px-3">
                        <i className="bi bi-receipt me-2"></i>
                        {sales.length} venta{sales.length !== 1 ? 's' : ''}
                    </span>
                </div>
            </div>

            {/* Period Tabs */}
            <div className="premium-card card-static mb-4 animate-fade-in">
                <div className="card-body p-0">
                    <ul className="nav nav-tabs border-0 px-3 pt-2" role="tablist" style={{ gap: '4px' }}>
                        {Object.entries(periodConfig).map(([key, cfg]) => (
                            <li className="nav-item" key={key} role="presentation">
                                <button
                                    className={`nav-link border-0 px-4 py-3 d-flex align-items-center fw-medium`}
                                    onClick={() => navigate(`/ventas/${key}`)}
                                    type="button"
                                    role="tab"
                                    style={period === key ? {
                                        background: 'var(--color-accent-muted)',
                                        color: 'var(--color-info)',
                                        borderBottom: '2px solid var(--color-info)',
                                        borderRadius: '8px 8px 0 0'
                                    } : {
                                        color: 'var(--color-text-muted)',
                                        background: 'transparent'
                                    }}
                                >
                                    <i className={`bi ${cfg.icon} me-2`}></i>
                                    {cfg.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Summary Bar */}
            <div className="row g-3 mb-4 stagger-children">
                <div className="col-6 col-md-3 animate-fade-in">
                    <div className="premium-card card-static text-center py-3">
                        <div className="stat-label">Ventas</div>
                        <div className="stat-value text-info">{sales.length}</div>
                    </div>
                </div>
                <div className="col-6 col-md-3 animate-fade-in">
                    <div className="premium-card card-static text-center py-3">
                        <div className="stat-label">Total</div>
                        <div className="stat-value text-info">€ {totalGeneral.toFixed(2)}</div>
                    </div>
                </div>
                <div className="col-6 col-md-3 animate-fade-in">
                    <div className="premium-card card-static text-center py-3">
                        <div className="stat-label">Efectivo</div>
                        <div className="stat-value" style={{ color: 'var(--color-success)' }}>
                            € {sales.filter(s => String(s.payment_method) === '1').reduce((sum, s) => sum + Number(s.total_amount), 0).toFixed(2)}
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3 animate-fade-in">
                    <div className="premium-card card-static text-center py-3">
                        <div className="stat-label">Tarjeta/Otros</div>
                        <div className="stat-value" style={{ color: '#a855f7' }}>
                            € {sales.filter(s => String(s.payment_method) !== '1').reduce((sum, s) => sum + Number(s.total_amount), 0).toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sales List */}
            {loading ? (
                <div className="premium-card card-static animate-fade-in">
                    <div className="card-body text-center py-5">
                        <div className="spinner-border text-info mb-3" role="status"></div>
                        <p className="text-muted mb-0">Cargando ventas...</p>
                    </div>
                </div>
            ) : sales.length === 0 ? (
                <div className="premium-card card-static animate-fade-in">
                    <div className="card-body text-center py-5">
                        <i className="bi bi-inbox display-1 text-muted d-block mb-3" style={{ opacity: 0.2 }}></i>
                        <h5 className="text-muted fw-normal">No hay ventas para este periodo</h5>
                        <p className="text-muted small mb-0">Las ventas registradas aparecerán aquí</p>
                    </div>
                </div>
            ) : (
                <div className="stagger-children">
                    {sales.map((sale) => {
                        const payment = paymentLabel(sale.payment_method);
                        const isExpanded = expandedSale === sale.id;

                        return (
                            <div key={sale.id} className="premium-card card-static mb-3 animate-fade-in">
                                <div className="card-body p-0">
                                    {/* Sale Header - Clickable */}
                                    <div
                                        className="d-flex flex-wrap align-items-center justify-content-between p-4"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => setExpandedSale(isExpanded ? null : sale.id)}
                                    >
                                        <div className="d-flex align-items-center flex-grow-1 me-3">
                                            <div className="rounded-3 d-flex align-items-center justify-content-center me-3"
                                                style={{ width: '44px', height: '44px', background: 'var(--color-accent-muted)', flexShrink: 0 }}>
                                                <i className="bi bi-receipt text-info"></i>
                                            </div>
                                            <div>
                                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                                    <h6 className="fw-bold mb-0">Venta #{sale.id}</h6>
                                                    <span className={`badge ${payment.cls}`}>
                                                        <i className={`bi ${payment.icon} me-1`}></i>{payment.text}
                                                    </span>
                                                </div>
                                                <div className="d-flex gap-3 mt-1">
                                                    <small className="text-muted">
                                                        <i className="bi bi-calendar3 me-1"></i>{formatDate(sale.created_at)}
                                                    </small>
                                                    <small className="text-muted">
                                                        <i className="bi bi-clock me-1"></i>{formatTime(sale.created_at)}
                                                    </small>
                                                    {sale.name_cliente && (
                                                        <small className="text-muted">
                                                            <i className="bi bi-person me-1"></i>{sale.name_cliente}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-center gap-3 mt-2 mt-md-0">
                                            <div className="text-end">
                                                <div className="small text-muted">Total</div>
                                                <div className="fw-bold text-info fs-5">€ {Number(sale.total_amount).toFixed(2)}</div>
                                            </div>
                                            <i className={`bi bi-chevron-${isExpanded ? 'up' : 'down'} text-muted`}></i>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <div style={{ borderTop: '1px solid var(--color-border)' }}>
                                            {/* Items */}
                                            <div className="p-4">
                                                <h6 className="fw-medium mb-3 d-flex align-items-center">
                                                    <i className="bi bi-box-seam text-info me-2"></i>
                                                    Artículos
                                                </h6>
                                                {((sale.list_sale && sale.list_sale.length > 0) || (sale.list_sale_service && sale.list_sale_service.length > 0)) ? (
                                                    <div className="table-responsive">
                                                        <table className="table table-sm mb-0">
                                                            <thead>
                                                                <tr>
                                                                    <th>Artículo</th>
                                                                    <th className="text-center">Tipo</th>
                                                                    <th className="text-center">Cantidad</th>
                                                                    <th className="text-end">Precio Unit.</th>
                                                                    <th className="text-end">Total</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {sale.list_sale && sale.list_sale.map((item, idx) => (
                                                                    <tr key={`p-${idx}`}>
                                                                        <td>
                                                                            <div className="d-flex align-items-center">
                                                                                <i className="bi bi-circle text-info me-2 small"></i>
                                                                                {item.product?.name || `Producto #${item.product_id}`}
                                                                            </div>
                                                                        </td>
                                                                        <td className="text-center">
                                                                            <span className="badge bg-info bg-opacity-25 text-info">Producto</span>
                                                                        </td>
                                                                        <td className="text-center">{item.count}</td>
                                                                        <td className="text-end">€ {Number(item.price).toFixed(2)}</td>
                                                                        <td className="text-end fw-medium">€ {Number(item.total_price).toFixed(2)}</td>
                                                                    </tr>
                                                                ))}
                                                                {sale.list_sale_service && sale.list_sale_service.map((item, idx) => (
                                                                    <tr key={`s-${idx}`}>
                                                                        <td>
                                                                            <div className="d-flex align-items-center">
                                                                                <i className="bi bi-wrench me-2 small" style={{ color: '#a855f7' }}></i>
                                                                                {item.service_name}
                                                                            </div>
                                                                        </td>
                                                                        <td className="text-center">
                                                                            <span className="badge" style={{ background: 'rgba(168,85,247,0.15)', color: '#a855f7' }}>Servicio</span>
                                                                        </td>
                                                                        <td className="text-center">{item.count}</td>
                                                                        <td className="text-end">€ {Number(item.price).toFixed(2)}</td>
                                                                        <td className="text-end fw-medium">€ {Number(item.total_price).toFixed(2)}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ) : (
                                                    <p className="text-muted small mb-0 fst-italic">Sin artículos registrados</p>
                                                )}

                                                {/* Totals */}
                                                <div className="rounded-3 p-3 mt-3" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)' }}>
                                                    <div className="d-flex justify-content-between mb-1">
                                                        <span className="text-muted">Subtotal</span>
                                                        <span>€ {Number(sale.sub_total_amount).toFixed(2)}</span>
                                                    </div>
                                                    {sale.tax_amount > 0 && (
                                                        <div className="d-flex justify-content-between mb-1">
                                                            <span className="text-muted">IVA ({sale.tax}%)</span>
                                                            <span className="text-warning">€ {Number(sale.tax_amount).toFixed(2)}</span>
                                                        </div>
                                                    )}
                                                    <hr className="my-2" style={{ borderColor: 'var(--color-border)' }} />
                                                    <div className="d-flex justify-content-between">
                                                        <span className="fw-bold">Total</span>
                                                        <span className="fw-bold text-info fs-5">€ {Number(sale.total_amount).toFixed(2)}</span>
                                                    </div>
                                                </div>

                                                {/* Client Info */}
                                                {(sale.name_cliente || sale.number_client || sale.email_client || sale.matricula_car) && (
                                                    <div className="mt-3 rounded-3 p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)' }}>
                                                        <h6 className="small fw-medium mb-2"><i className="bi bi-person me-2 text-info"></i>Cliente</h6>
                                                        <div className="row g-2">
                                                            {sale.name_cliente && <div className="col-6"><small className="text-muted d-block">Nombre</small><span className="small">{sale.name_cliente}</span></div>}
                                                            {sale.number_client && <div className="col-6"><small className="text-muted d-block">Teléfono</small><span className="small">{sale.number_client}</span></div>}
                                                            {sale.email_client && <div className="col-6"><small className="text-muted d-block">Email</small><span className="small">{sale.email_client}</span></div>}
                                                            {sale.matricula_car && <div className="col-6"><small className="text-muted d-block">Matrícula</small><span className="small">{sale.matricula_car}</span></div>}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Notes */}
                                                {sale.notes && (
                                                    <div className="mt-3 p-2 rounded" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)' }}>
                                                        <p className="small text-muted mb-0 fst-italic"><i className="bi bi-chat-left-text me-2"></i>"{sale.notes}"</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="d-flex justify-content-end gap-2 px-4 pb-4">
                                                <button
                                                    className="btn btn-outline-danger btn-sm d-flex align-items-center"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#deleteSaleDetailModal"
                                                    onClick={(e) => { e.stopPropagation(); setSaleToDelete(sale); }}
                                                >
                                                    <i className="bi bi-trash me-2"></i>Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <div className="modal fade" id="deleteSaleDetailModal" tabIndex="-1" aria-labelledby="deleteSaleDetailModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header border-0 pb-0">
                            <h5 className="modal-title fw-bold d-flex align-items-center" id="deleteSaleDetailModalLabel">
                                <div className="rounded-3 d-flex align-items-center justify-content-center me-3"
                                    style={{ width: '40px', height: '40px', background: 'var(--color-danger-muted, rgba(220,53,69,0.15))' }}>
                                    <i className="bi bi-exclamation-triangle" style={{ color: 'var(--color-danger, #dc3545)' }}></i>
                                </div>
                                Eliminar Venta
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar" onClick={() => setSaleToDelete(null)}></button>
                        </div>
                        <div className="modal-body">
                            {saleToDelete && (
                                <>
                                    <p className="text-muted mb-3">
                                        ¿Estás seguro de que deseas eliminar esta venta? 
                                        {String(saleToDelete.payment_method) === '1' && (
                                            <strong className="d-block mt-1 text-warning">
                                                <i className="bi bi-info-circle me-1"></i>
                                                Se revertirá el ingreso en la caja registradora.
                                            </strong>
                                        )}
                                    </p>
                                    <div className="rounded-3 p-3" style={{ background: 'var(--color-accent-muted, rgba(255,255,255,0.05))' }}>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted">Venta</span>
                                            <span className="fw-bold">#{saleToDelete.id}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted">Fecha</span>
                                            <span>{formatDate(saleToDelete.created_at)} — {formatTime(saleToDelete.created_at)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted">Método de pago</span>
                                            <span className={`badge ${paymentLabel(saleToDelete.payment_method).cls}`}>
                                                <i className={`bi ${paymentLabel(saleToDelete.payment_method).icon} me-1`}></i>
                                                {paymentLabel(saleToDelete.payment_method).text}
                                            </span>
                                        </div>
                                        <hr className="my-2" style={{ borderColor: 'var(--color-border)' }} />
                                        <div className="d-flex justify-content-between">
                                            <span className="fw-bold">Total</span>
                                            <span className="fw-bold text-info fs-5">€ {Number(saleToDelete.total_amount).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="modal-footer border-0 pt-0">
                            <button type="button" className="btn btn-outline-light" data-bs-dismiss="modal" onClick={() => setSaleToDelete(null)}>
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger d-flex align-items-center"
                                disabled={deleting}
                                onClick={handleDeleteSale}
                            >
                                {deleting ? (
                                    <><span className="spinner-border spinner-border-sm me-2"></span>Eliminando...</>
                                ) : (
                                    <><i className="bi bi-trash me-2"></i>Eliminar Venta</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
