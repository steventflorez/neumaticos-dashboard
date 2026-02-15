import React, { useEffect, useState } from 'react'
import { createNegativeTransaction, getAllCashTransactions, getCashRegister } from '../../data/products/Tire';

import { useAuth } from '../../context/AuthContextCore';

export const Caja = () => {
    const { isAdmin } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [cashRegister, setCashRegister] = useState(null);
    const [amount, setAmount] = useState('');
    const [concepto, setConcepto] = useState('');
    const [buttonConfirm, setButtonConfirm] = useState(false);

    useEffect(() => {
        const fetchTransactions = async () => {
            const transactionsDB = await getAllCashTransactions();
            const sorted = transactionsDB.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setTransactions(sorted);
        };
        fetchTransactions();
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

    const handleAmountChange = (e) => {
        const val = e.target.value;
        setAmount(val);
        setButtonConfirm(val > 0 && val <= cashRegister);
    };

    const retirar = async () => {
        await createNegativeTransaction(parseFloat(amount), concepto);
        window.location.reload();
    }

    return (
        <>
            {/* Page Header */}
            <div className="row mb-5 align-items-center animate-fade-in">
                <div className="col-lg-8 col-12">
                    <h1 className="fw-bold mb-1">Caja Registradora</h1>
                    <p className="text-muted fs-5 mb-0">Historial de movimientos y retiros</p>
                </div>
                <div className="col-lg-4 col-12 mt-3 mt-lg-0 d-flex justify-content-lg-end gap-2 align-items-center">
                    {/* Balance badge */}
                    <div className="d-flex align-items-center gap-2 me-3">
                        <span className="stat-label">Saldo</span>
                        <span className="fw-bold fs-4" style={{ color: 'var(--color-success)' }}>
                            € {cashRegister !== null ? cashRegister.toFixed(2) : '—'}
                        </span>
                    </div>
                    {isAdmin() && (
                        <button
                            type="button"
                            className="btn btn-danger d-flex align-items-center"
                            data-bs-toggle="modal"
                            data-bs-target="#cajaModal"
                        >
                            <i className="bi bi-arrow-down-circle me-2"></i>
                            Retirar
                        </button>
                    )}
                </div>
            </div>

            {/* Transactions Table */}
            <div className="premium-card card-static animate-fade-in">
                <div className="card-body">
                    <h6 className="card-title mb-4 d-flex align-items-center">
                        <i className="bi bi-clock-history text-info me-2"></i>
                        Movimientos
                        <span className="badge bg-info bg-opacity-25 text-info ms-2">{transactions.length}</span>
                    </h6>

                    {transactions.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="bi bi-inbox display-3 text-muted d-block mb-3" style={{ opacity: 0.3 }}></i>
                            <p className="text-muted">No hay movimientos registrados</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>Tipo</th>
                                        <th>Valor</th>
                                        <th>Fecha y hora</th>
                                        <th>Concepto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((transaction) => (
                                        <tr key={transaction.id}>
                                            <td>
                                                {(() => {
                                                    const isIncome = transaction.type === 'income';
                                                    const badgeClass = isIncome
                                                        ? 'bg-success bg-opacity-25 text-success'
                                                        : 'bg-danger bg-opacity-25 text-danger';
                                                    const iconClass = isIncome
                                                        ? 'bi-arrow-up-right'
                                                        : 'bi-arrow-down-left';
                                                    const label = isIncome ? 'Ingreso' : 'Retiro';

                                                    return (
                                                        <span className={`badge ${badgeClass}`}>
                                                            <i className={`bi ${iconClass} me-1`}></i>
                                                            {label}
                                                        </span>
                                                    );
                                                })()}
                                            </td>
                                            <td className={`fw-bold ${transaction.amount > 0 ? '' : 'text-danger'}`}>
                                                € {transaction.amount}
                                            </td>
                                            <td className="text-muted">
                                                {new Date(transaction.created_at).toLocaleDateString('es-ES', {
                                                    day: '2-digit', month: 'short', year: 'numeric'
                                                })} · {new Date(transaction.created_at).toLocaleTimeString('es-ES', {
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </td>
                                            <td>{transaction.description || '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Retiro */}
            <div className="modal fade" id="cajaModal" tabIndex="-1" aria-labelledby="cajaModal" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title fw-bold d-flex align-items-center">
                                <i className="bi bi-arrow-down-circle text-danger me-2"></i>
                                Confirmar Retiro
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row g-3">
                                <div className="col-12">
                                    <label htmlFor="cantidad" className="form-label">Cantidad a retirar (€)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="cantidad"
                                        placeholder="ej. 30"
                                        value={amount}
                                        onChange={handleAmountChange}
                                    />
                                    {amount && amount > cashRegister && (
                                        <small className="text-danger mt-1 d-block">
                                            <i className="bi bi-exclamation-triangle me-1"></i>
                                            La cantidad supera el saldo disponible
                                        </small>
                                    )}
                                </div>
                                <div className="col-12">
                                    <label htmlFor="concepto" className="form-label">Concepto</label>
                                    <textarea
                                        className="form-control"
                                        id="concepto"
                                        rows="3"
                                        placeholder="Describe el motivo del retiro..."
                                        value={concepto}
                                        onChange={(e) => setConcepto(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-light" data-bs-dismiss="modal">Cancelar</button>
                            {buttonConfirm && (
                                <button
                                    type="button"
                                    className="btn btn-danger d-flex align-items-center"
                                    onClick={retirar}
                                >
                                    <i className="bi bi-check-circle me-2"></i>
                                    Confirmar Retiro
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
