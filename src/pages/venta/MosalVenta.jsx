import React, { useState } from 'react'
import { startSetSale } from '../../store/products/thunks'
import { useDispatch, useSelector } from 'react-redux'
import { createSaleWithItems } from '../../data/products/Tire'

export const MosalVenta = () => {
    const sale = useSelector((state) => state.products.sale)
    const dispatch = useDispatch()

    const [formData, setFormData] = useState({
        nombre_cliente: '',
        telefono_cliente: '',
        email_cliente: '',
        matricula_vehiculo: '',
        payment_method: '1',
        notes: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleConfirmSale = async () => {
        const items = JSON.parse(localStorage.getItem('productsCar'))

        const salePayload = {
            ...(sale ?? {}),
            payment_method: formData.payment_method,
            name_cliente: formData.nombre_cliente,
            number_client: formData.telefono_cliente,
            email_client: formData.email_cliente,
            matricula_car: formData.matricula_vehiculo,
            sub_total_amount: sale.sub_total_amount,
            total_amount: sale.total_amount,
            tax_amount: sale.tax_amount,
            tax: sale.tax,
            notes: formData.notes,
        }

        const response = await createSaleWithItems(salePayload, items)
        localStorage.setItem('productsCar', "[]")
        dispatch(startSetSale(salePayload))

        if (response.error) {
            console.error('Error al crear la venta:', response.error)
        } else {
            window.location.reload();
        }
    }

    return (
        <div className="modal fade" id="venta_modal" tabIndex="-1" aria-labelledby="ventaModal" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fw-bold d-flex align-items-center">
                            <i className="bi bi-bag-check text-info me-2"></i>
                            Confirmar Venta
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="row g-3">
                            <div className="col-12 col-md-6">
                                <label htmlFor="nombre_cliente" className="form-label">Nombre del cliente</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="nombre_cliente"
                                    value={formData.nombre_cliente}
                                    onChange={handleChange}
                                    placeholder="Nombre completo"
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <label htmlFor="telefono_cliente" className="form-label">Teléfono</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    name="telefono_cliente"
                                    value={formData.telefono_cliente}
                                    onChange={handleChange}
                                    placeholder="+34 600 000 000"
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <label htmlFor="email_cliente" className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email_cliente"
                                    value={formData.email_cliente}
                                    onChange={handleChange}
                                    placeholder="correo@ejemplo.com"
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <label htmlFor="matricula_vehiculo" className="form-label">Matrícula del vehículo</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="matricula_vehiculo"
                                    value={formData.matricula_vehiculo}
                                    onChange={handleChange}
                                    placeholder="1234 ABC"
                                />
                            </div>
                            <div className="col-12">
                                <label htmlFor="payment_method" className="form-label">Método de pago</label>
                                <select
                                    className="form-select"
                                    name="payment_method"
                                    value={formData.payment_method}
                                    onChange={handleChange}
                                >
                                    <option value="1">💵 Efectivo</option>
                                    <option value="2">💳 Tarjeta</option>
                                    <option value="3">🏦 Transferencia</option>
                                </select>
                            </div>
                            <div className="col-12">
                                <label htmlFor="notes" className="form-label">Notas</label>
                                <textarea
                                    className="form-control"
                                    name="notes"
                                    rows="3"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    placeholder="Notas adicionales sobre la venta..."
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline-light" data-bs-dismiss="modal">Cancelar</button>
                        <button
                            type="button"
                            className="btn btn-primary d-flex align-items-center"
                            onClick={handleConfirmSale}
                        >
                            <i className="bi bi-check-circle me-2"></i>
                            <span className="fw-bold">Confirmar Venta</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
