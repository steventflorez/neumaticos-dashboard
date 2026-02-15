import React, { useEffect, useState } from 'react'
import { getSalesByCreationDate, getCashRegister } from '../../data/products/Tire';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
    const [totalSales, setTotalSales] = useState(0);
    const [salesCount, setSalesCount] = useState(0);
    const [activeFilter, setActiveFilter] = useState('day');
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [customSales, setCustomSales] = useState([]);
    const [cashRegister, setCashRegister] = useState(null);

    const handleCustomDateFilter = async (startDate, endDate) => {
        try {
            if (!startDate || !endDate) return;
            const ventas = await getSalesByCreationDate(startDate, endDate);
            setCustomSales(ventas);
        } catch (error) {
            console.error('Error al obtener las ventas personalizadas:', error);
        }
    };

    useEffect(() => {
        const fetchTires = async () => {
            try {
                const today = new Date();
                const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
                const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

                const ventas = await getSalesByCreationDate(start, end);
                let total = 0;
                ventas.forEach(venta => { total += venta.total_amount; });
                setTotalSales(parseFloat(total.toFixed(2)));
                setSalesCount(ventas.length);
            } catch (error) {
                console.error('Error al obtener las ventas:', error);
            }
        };
        fetchTires();
    }, []);

    useEffect(() => {
        const fetchCashRegister = async () => {
            try {
                const cash = await getCashRegister();
                setCashRegister(cash.current_balance);
            } catch (error) {
                console.error('Error al obtener la caja registradora:', error);
            }
        };
        fetchCashRegister();
    }, []);

    const handleFilterClick = async (filterType) => {
        try {
            const today = new Date();
            let start, end;

            if (filterType === 'week') {
                const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
                start = new Date(firstDayOfWeek.getFullYear(), firstDayOfWeek.getMonth(), firstDayOfWeek.getDate()).toISOString();
                end = new Date(firstDayOfWeek.getFullYear(), firstDayOfWeek.getMonth(), firstDayOfWeek.getDate() + 7).toISOString();
            } else if (filterType === 'month') {
                start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
                end = new Date(today.getFullYear(), today.getMonth() + 1, 1).toISOString();
            } else {
                start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
                end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();
            }

            const ventas = await getSalesByCreationDate(start, end);
            let total = 0;
            ventas.forEach(venta => { total += venta.total_amount; });
            setTotalSales(parseFloat(total.toFixed(2)));
            setSalesCount(ventas.length);
            setActiveFilter(filterType);
        } catch (error) {
            console.error(`Error:`, error);
        }
    };

    const filterLabels = { day: 'Hoy', week: 'Esta Semana', month: 'Este Mes' };

    return (
        <>
            {/* Page Header */}
            <div className="row mb-5 align-items-center animate-fade-in">
                <div className="col-12">
                    <h1 className="fw-bold mb-1">Dashboard</h1>
                    <p className="text-muted fs-5 mb-0">Resumen de ventas y estado de la caja</p>
                </div>
            </div>

            {/* Stats Row */}
            <div className="row g-4 mb-5 stagger-children">
                {/* Sales Card */}
                <div className="col-12 col-lg-7 animate-fade-in">
                    <div className="premium-card card-static">
                        <div className="card-body">
                            {/* Period Filter */}
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h6 className="card-title mb-0 d-flex align-items-center">
                                    <i className="bi bi-graph-up-arrow text-info me-2"></i>
                                    Ventas
                                </h6>
                                <div className="btn-group btn-group-sm" role="group">
                                    {['day', 'week', 'month'].map(f => (
                                        <button
                                            key={f}
                                            className={`btn ${activeFilter === f ? 'btn-primary' : 'btn-outline-secondary'}`}
                                            onClick={() => handleFilterClick(f)}
                                        >
                                            {filterLabels[f]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sales Value */}
                            <div className="text-center py-4">
                                <div className="stat-label mb-2">Ingresos — {filterLabels[activeFilter]}</div>
                                <div className="stat-value text-info">€ {totalSales.toFixed(2)}</div>
                                <div className="text-muted small mt-2">
                                    <i className="bi bi-receipt me-1"></i>
                                    {salesCount} venta{salesCount !== 1 ? 's' : ''} registrada{salesCount !== 1 ? 's' : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cash Register Card */}
                <div className="col-12 col-lg-5 animate-fade-in">
                    <Link to="/caja" className="text-decoration-none">
                        <div className="premium-card h-100" style={{ cursor: 'pointer' }}>
                            <div className="card-body d-flex flex-column justify-content-center">
                                <div className="d-flex align-items-center mb-4">
                                    <div className="rounded-3 d-flex align-items-center justify-content-center me-3"
                                        style={{ width: '48px', height: '48px', background: 'var(--color-success-muted)' }}>
                                        <i className="bi bi-safe2 fs-4" style={{ color: 'var(--color-success)' }}></i>
                                    </div>
                                    <div>
                                        <h6 className="card-title mb-0">Caja Registradora</h6>
                                        <small className="text-muted">Saldo actual</small>
                                    </div>
                                </div>

                                <div className="stat-value mb-2" style={{ color: 'var(--color-success)' }}>
                                    € {cashRegister !== null ? cashRegister.toFixed(2) : '—'}
                                </div>
                                <div className="text-muted small d-flex align-items-center">
                                    <i className="bi bi-arrow-right-circle me-2"></i>
                                    Ver movimientos
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Date Range Filter */}
            <div className="premium-card card-static mb-4 animate-fade-in">
                <div className="card-body">
                    <h6 className="card-title mb-4 d-flex align-items-center">
                        <i className="bi bi-calendar-range text-info me-2"></i>
                        Consulta por Rango de Fechas
                    </h6>
                    <div className="row g-3 align-items-end">
                        <div className="col-12 col-md-4">
                            <label className="form-label">Fecha de inicio</label>
                            <input
                                type="date"
                                className="form-control"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="col-12 col-md-4">
                            <label className="form-label">Fecha de fin</label>
                            <input
                                type="date"
                                className="form-control"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        <div className="col-12 col-md-4">
                            <button
                                className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                                onClick={() => handleCustomDateFilter(startDate, endDate)}
                                disabled={!startDate || !endDate}
                            >
                                <i className="bi bi-funnel me-2"></i>
                                Filtrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sales Table */}
            {customSales.length > 0 && (
                <div className="premium-card card-static animate-fade-in">
                    <div className="card-body">
                        <h6 className="card-title mb-4 d-flex align-items-center">
                            <i className="bi bi-table text-info me-2"></i>
                            Resultados
                            <span className="badge bg-info bg-opacity-25 text-info ms-2">{customSales.length}</span>
                        </h6>
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Método de pago</th>
                                        <th>Subtotal</th>
                                        <th>IVA</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customSales.map((sale, index) => (
                                        <tr key={index}>
                                            <td className="fw-medium">#{sale.id}</td>
                                            <td>
                                                <span className={`badge ${sale.payment_method == 1 ? 'bg-success bg-opacity-25 text-success' : 'bg-info bg-opacity-25 text-info'}`}>
                                                    <i className={`bi ${sale.payment_method == 1 ? 'bi-cash' : 'bi-credit-card'} me-1`}></i>
                                                    {sale.payment_method == 1 ? 'Efectivo' : 'Tarjeta'}
                                                </span>
                                            </td>
                                            <td>€ {sale.sub_total_amount}</td>
                                            <td className="text-warning">€ {sale.tax_amount}</td>
                                            <td className="fw-bold text-info">€ {sale.total_amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
