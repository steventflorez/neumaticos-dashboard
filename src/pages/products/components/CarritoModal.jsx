import React, { useState } from 'react'
import { useSelector } from 'react-redux';

export const CarritoModal = () => {
    const [leableStock, setLeableStock] = useState(false)
    const [buttonConfirm, setButtonConfirm] = useState(false)
    const [errorStockSuma, setErrorStockSuma] = useState(false)
    const [cantidad, setCantidad] = useState('')

    const tire = useSelector((state) => state.products.addProduct);

    const verificarStock = (e) => {
        const pedido = e.target.value
        setCantidad(pedido)
        setButtonConfirm(true)
        setErrorStockSuma(false)
        setLeableStock(false)

        if (pedido > tire.product.stock) {
            setLeableStock(true)
            setButtonConfirm(false)
        }
        if (pedido.trim() === "") {
            setLeableStock(false)
            setButtonConfirm(false)
            setErrorStockSuma(false)
        }
    }

    const addTire = () => {
        const products = JSON.parse(localStorage.getItem('productsCar'));

        if (products === null) {
            const updatedTire = [{ tire, count: cantidad }]
            localStorage.setItem('productsCar', JSON.stringify(updatedTire))
            setCantidad('')
            setErrorStockSuma(false)
        } else {
            verificateTireExisting()
        }
    }

    const verificateTireExisting = () => {
        const products = JSON.parse(localStorage.getItem('productsCar'));
        const existe = products.some(item => item.tire.id == tire.id)

        if (!existe) {
            const newProduct = { tire, count: cantidad }
            products.push(newProduct)
            localStorage.setItem('productsCar', JSON.stringify(products))
            setCantidad('')
            setErrorStockSuma(false)
        } else {
            const productoExistente = products.find(item => item.tire.id == tire.id)
            if (productoExistente) {
                const countActual = parseInt(productoExistente.count)
                const countNuevo = parseInt(cantidad)
                const stockDisponible = productoExistente.tire.product.stock

                if ((countActual + countNuevo) > stockDisponible) {
                    setErrorStockSuma(true)
                    setButtonConfirm(false)
                    return
                }

                setErrorStockSuma(false)
                products.map(item => {
                    if (item.tire.id == tire.id) {
                        item.count = countActual + countNuevo
                    }
                    return item
                })
                localStorage.setItem('productsCar', JSON.stringify(products))
                setCantidad('')
            }
        }
    }

    return (
        <div className="modal fade" id="confirmacionModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fw-bold d-flex align-items-center">
                            <i className="bi bi-cart-plus text-info me-2"></i>
                            Añadir al Carrito
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {tire && (
                            <div className="rounded-3 p-3 mb-3" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)' }}>
                                <div className="d-flex align-items-center">
                                    <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                        style={{ width: '40px', height: '40px', background: 'var(--color-accent-muted)' }}>
                                        <i className="bi bi-circle text-info small"></i>
                                    </div>
                                    <div>
                                        <h6 className="mb-0 fw-bold">{tire.product?.name}</h6>
                                        <small className="text-muted">
                                            {tire.width}/{tire.height}/R{tire.diameter} · Stock: {tire.product?.stock}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="cantidad" className="form-label">Cantidad</label>
                            <input
                                type="number"
                                className="form-control"
                                id="cantidad"
                                placeholder="ej. 2"
                                value={cantidad}
                                onChange={verificarStock}
                            />
                            {leableStock && (
                                <small className="text-danger mt-2 d-block">
                                    <i className="bi bi-exclamation-triangle me-1"></i>
                                    La cantidad supera el stock disponible
                                </small>
                            )}
                            {errorStockSuma && (
                                <small className="text-danger mt-2 d-block">
                                    <i className="bi bi-exclamation-triangle me-1"></i>
                                    La cantidad sumada supera el stock disponible
                                </small>
                            )}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline-light" data-bs-dismiss="modal">Cancelar</button>
                        {buttonConfirm && (
                            <button
                                type="button"
                                className="btn btn-primary d-flex align-items-center"
                                onClick={addTire}
                            >
                                <i className="bi bi-cart-check me-2"></i>
                                Confirmar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
