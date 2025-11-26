import React from 'react'
import { startSetSale } from '../../store/products/thunks'
import { useDispatch, useSelector } from 'react-redux'
import { createSaleWithItems } from '../../data/products/Tire'

export const MosalVenta = () => {

    const sale = useSelector((state) => state.products.sale)
    const dispatch = useDispatch()


    const handleConfirmSale = async() => {   
        const payment_method = document.getElementById('payment_method').value
        const notes = document.getElementById('notes').value
        const nombre_cliente = document.getElementById('nombre_cliente').value
        const telefono_cliente = document.getElementById('telefono_cliente').value
        const email_cliente = document.getElementById('email_cliente').value
        const matricula_vehiculo = document.getElementById('matricula_vehiculo').value

        const items = JSON.parse(localStorage.getItem('productsCar'))



       const salePayload = {
        ...(sale ?? {}),
        payment_method,
        name_cliente: nombre_cliente,
        number_client: telefono_cliente,
        email_client: email_cliente,
        matricula_car: matricula_vehiculo,
        sub_total_amount: sale.sub_total_amount,
        total_amount: sale.total_amount,
        tax_amount: sale.tax_amount,
        tax: sale.tax,
        notes: notes,

      }
console.log('salePayload', salePayload)
      const response = await createSaleWithItems(salePayload, items)
      //console.log('response', response)
      localStorage.setItem('productsCar',"[]")
      
      dispatch(startSetSale(salePayload))
      if (response.error) {
        console.error('Error al crear la venta:', response.error)
      } else {
        console.log('Venta creada correctamente:', response.data)
        window.location.reload();
      }
    }
    return (
        <div className="modal fade" id="venta_modal" tabIndex="-1" aria-labelledby="ventaModal" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" >Confirmar Venta</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form action="">
                            <div className="row mt-3">
                                <div className="col-6">
                                    <div>
                                        <label htmlFor="nombre_cliente" className="form-label mt-4">Nombre del cliente</label>
                                        <input type="text" className='form-control' id='nombre_cliente' />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div>
                                        <label htmlFor="telefono_cliente" className="form-label mt-4">Telefono del cliente</label>
                                        <input type="number" className='form-control' id='telefono_cliente' />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div>
                                        <label htmlFor="email_cliente" className="form-label mt-4">Correo del cliente</label>
                                        <input type="text" className='form-control' id='email_cliente' />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div>
                                        <label htmlFor="matricula_vehiculo" className="form-label mt-4">Matricula del vehiculo</label>
                                        <input type="text" className='form-control' id='matricula_vehiculo' />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div>
                                        <label htmlFor="payment_method" className="form-label mt-4">Metodo de pago</label>
                                        <select className='form-select' id='payment_method'>
                                            <option value="1">Efectivo</option>
                                            <option value="2">Tarjeta</option>
                                            <option value="3">Transferencia</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div>
                                        <label htmlFor="notes" className="form-label mt-4">Notas</label>
                                        <textarea className='form-control' id='notes' rows="3"></textarea>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" className="btn btn-primary" onClick={handleConfirmSale}> Confirmar Venta</button>

                    </div>
                </div>
            </div>
        </div>
    )
}
