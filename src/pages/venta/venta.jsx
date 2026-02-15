import React, { useEffect, useState, useRef } from 'react';
import { MosalVenta } from './MosalVenta.jsx'
import { startSetSale } from '../../store/products/thunks.js';
import { useDispatch } from 'react-redux';

export const Venta = () => {
  const [productos, setProductos] = useState([]);
  const [aplicarIva, setAplicarIva] = useState(false);
  const isFirstRender = useRef(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const productsLocal = JSON.parse(localStorage.getItem('productsCar'));
    if (productsLocal) {
      setProductos(productsLocal);
    }
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem('productsCar', JSON.stringify(productos));
  }, [productos]);

  const handlePriceChange = (index, newPrice) => {
    setProductos(prevProductos =>
      prevProductos.map((item, i) =>
        i === index
          ? {
            ...item,
            tire: {
              ...item.tire,
              product: {
                ...item.tire.product,
                price: newPrice
              }
            }
          }
          : item
      )
    );
  };

  const handleDelete = (index) => {
    setProductos(prevProductos => prevProductos.filter((_, i) => i !== index));
  };

  const handleConfirmSale = () => {
    const sale = {
      name_cliente: '',
      number_client: '',
      email_client: '',
      matricula_car: '',
      sub_total_amount: subtotal,
      payment_method: '',
      total_amount: total,
      tax_amount: aplicarIva ? iva : 0,
      tax: aplicarIva ? 21 : 0,
      notes: '',
    }
    dispatch(startSetSale(sale))
  };

  const subtotal = productos.reduce((acc, item) => acc + (Number(item.count) * Number(item.tire.product.price)), 0);
  const iva = aplicarIva ? +(subtotal * 0.21).toFixed(2) : 0;
  const total = +(subtotal + iva).toFixed(2);

  return (
    <>
      {/* Page Header */}
      <div className="row mb-5 align-items-center animate-fade-in">
        <div className="col-lg-8 col-12">
          <h1 className="fw-bold mb-1">Punto de Venta</h1>
          <p className="text-muted fs-5 mb-0">Gestiona los productos del carrito y confirma la venta</p>
        </div>
        <div className="col-lg-4 col-12 mt-3 mt-lg-0 text-lg-end">
          <span className="badge bg-info bg-opacity-25 text-info fs-6 py-2 px-3">
            <i className="bi bi-cart3 me-2"></i>
            {productos.length} producto{productos.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Products Grid */}
      {productos.length === 0 ? (
        <div className="premium-card card-static glass-effect animate-fade-in">
          <div className="card-body text-center py-5">
            <i className="bi bi-cart-x display-1 text-muted mb-3 d-block" style={{ opacity: 0.3 }}></i>
            <h5 className="text-muted fw-normal">El carrito está vacío</h5>
            <p className="text-muted small mb-0">Añade productos desde el <strong>Inventario</strong> para comenzar una venta</p>
          </div>
        </div>
      ) : (
        <div className="row g-4 stagger-children" style={{ marginBottom: '140px' }}>
          {productos.map((item, index) => (
            <div key={index} className="col-12 col-md-6 col-xl-4 animate-fade-in">
              <div className="premium-card h-100">
                {/* Card Header */}
                <div className="d-flex justify-content-between align-items-center p-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: '40px', height: '40px', background: 'var(--color-accent-muted)' }}>
                      <i className="bi bi-circle text-info small"></i>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold">{item.tire.product.name}</h6>
                      <small className="text-muted">{item.tire.width}/{item.tire.height}/R{item.tire.diameter}</small>
                    </div>
                  </div>
                  <span className={`badge ${item.tire.is_new ? 'bg-success bg-opacity-25 text-success' : 'bg-warning bg-opacity-25 text-warning'}`}>
                    {item.tire.is_new ? 'Nueva' : 'Ocasión'}
                  </span>
                </div>

                <div className="card-body">
                  {/* Speed/Load info */}
                  <div className="d-flex gap-3 mb-3">
                    <div className="d-flex align-items-center text-muted small">
                      <i className="bi bi-speedometer2 me-1"></i>
                      <span>{item.tire.load_index}{item.tire.speed_index?.code || ''}</span>
                    </div>
                    <div className="d-flex align-items-center text-muted small">
                      <i className="bi bi-stack me-1"></i>
                      <span>Cantidad: <strong className="text-white">{item.count}</strong></span>
                    </div>
                  </div>

                  {/* Price Input */}
                  <label className="form-label small text-muted">Precio unitario</label>
                  <div className="input-group mb-3">
                    <span className="input-group-text">€</span>
                    <input
                      type="number"
                      className="form-control"
                      value={item.tire.product.price}
                      onChange={(e) => handlePriceChange(index, e.target.value)}
                    />
                  </div>

                  {/* Line Total */}
                  <div className="d-flex justify-content-between align-items-center p-2 rounded"
                    style={{ background: 'var(--color-accent-muted)' }}>
                    <span className="small fw-medium text-muted">Subtotal línea</span>
                    <span className="fw-bold text-info fs-5">
                      € {(Number(item.count) * Number(item.tire.product.price)).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Delete Action */}
                <div className="px-3 pb-3">
                  <button
                    type="button"
                    className="btn btn-outline-light btn-sm w-100 d-flex align-items-center justify-content-center"
                    onClick={() => handleDelete(index)}
                    style={{ borderColor: 'var(--color-danger-muted)', color: 'var(--color-danger)' }}
                  >
                    <i className="bi bi-trash me-2"></i> Quitar del carrito
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fixed Bottom Bar */}
      {productos.length > 0 && (
        <div className="fixed-bottom bottom-bar">
          <div className="container py-3">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
              {/* IVA toggle */}
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="checkIva"
                  checked={aplicarIva}
                  onChange={(e) => setAplicarIva(e.target.checked)}
                />
                <label className="form-check-label text-muted" htmlFor="checkIva">
                  Aplicar IVA 21%
                </label>
              </div>

              {/* Totals */}
              <div className="d-flex align-items-center gap-4">
                <div className="text-end">
                  <div className="small text-muted">
                    Subtotal: <span className="text-white fw-medium">€ {subtotal.toFixed(2)}</span>
                  </div>
                  {aplicarIva && (
                    <div className="small text-muted">
                      IVA (21%): <span className="text-warning fw-medium">€ {iva.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                <div className="text-end" style={{ minWidth: '100px' }}>
                  <div className="stat-label mb-0">Total</div>
                  <div className="stat-value text-info" style={{ fontSize: '1.6rem' }}>€ {total.toFixed(2)}</div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary px-4 py-2 d-flex align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#venta_modal"
                  disabled={total <= 0}
                  onClick={handleConfirmSale}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  <span className="fw-bold">Confirmar Venta</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <MosalVenta />
    </>
  );
};