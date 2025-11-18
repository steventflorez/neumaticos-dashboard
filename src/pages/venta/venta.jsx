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
      isFirstRender.current = false; // Evitar guardar en el primer render
      return;
    }

    console.log('productos actualizados:', productos);
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
    // Implementar lógica de confirmación de venta aquí
    const sale = {
      name_cliente: '',
      number_client: '',
      email_client: '',
      matricula_car: '',
      sub_total_amount: subtotal,
      payment_method:'',
      total_amount: total,
      tax_amount: aplicarIva? iva:0,
      tax:aplicarIva?21:0,
      notes:'',
    }

    dispatch(startSetSale(sale))
  };

  const subtotal = productos.reduce((acc, item) => acc + (Number(item.count) * Number(item.tire.product.price)), 0);
  const iva = aplicarIva ? +(subtotal * 0.21).toFixed(2) : 0;
  const total = +(subtotal + iva).toFixed(2);

  return (
    <>
      {productos.map((item, index) => (
        <div key={index} className="card border-primary mb-3" style={{ maxWidth: '20rem' }}>
          <div className="card-header">{item.tire.product.name}</div>
          <div className="card-body">
            <h4 className="card-title">
              {item.tire.width}/{item.tire.height}/R{item.tire.diameter}/{item.tire.load_index}
              {item.tire.speed_index.code}
            </h4>
            <span className={item.is_new ? 'badge bg-success' : 'badge bg-dark'}>
              {item.is_new ? 'Nueva' : 'Ocación'}
            </span>
            <br />
            <div className="input-group mt-3 mb-3">
              <span className="input-group-text">€</span>
              <input
                type="number"
                className="form-control"
                value={item.tire.product.price}
                onChange={(e) => handlePriceChange(index, e.target.value)}
              />
              <span className="input-group-text">.00</span>
            </div>
            <span>
              Cantidad: {item.count} | Total: € {Number(item.count) * Number(item.tire.product.price)}
            </span>
            <div className="d-grid mt-3">
              <button type="button" className="btn btn-danger" onClick={() => handleDelete(index)}>
                <i className="bi bi-trash"></i> Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="fixed-bottom bg-light border-top">
        <div className="container py-3 d-flex flex-column gap-2">
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="checkIva" checked={aplicarIva} onChange={(e) => setAplicarIva(e.target.checked)} />
            <label className="form-check-label" htmlFor="checkIva">
              Agregar IVA 21%
            </label>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <div><strong>Sub total:</strong> € {subtotal.toFixed(2)}</div>
              {aplicarIva && <div><strong>IVA (21%):</strong> € {iva.toFixed(2)}</div>}
              <div><strong>Total:</strong> € {total.toFixed(2)}</div>
            </div>
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#venta_modal" disabled={total <= 0} onClick={handleConfirmSale}>
              Confirmar venta
            </button>
          </div>
        </div>
      </div>

      <MosalVenta />
    </>
  );
};