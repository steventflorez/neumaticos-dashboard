import React, { useState } from 'react'
import { preconnect } from 'react-dom';
import { useSelector } from 'react-redux';

export const CarritoModal = () => {
    const [leableStock, setLeableStock] = useState(false)
    const [buttonConfitm, setButtonConfirm] = useState(false)
    const [errorStockSuma, setErrorStockSuma] = useState(false)


    const tire = useSelector((state) => state.products.addProduct);
    

    const verificarStock =(e)=>{
        const pedido = e.target.value
        setButtonConfirm(true)
        setErrorStockSuma(false)
        if(pedido > tire.product.stock ){
            setLeableStock(true)
            setButtonConfirm(false)
        }
        if(pedido.trim() === ""){
            setLeableStock(false)
            setButtonConfirm(false)
            setErrorStockSuma(false)
        }
    }


    const addTire = ()=>{
        const products = JSON.parse(localStorage.getItem('productsCar'));
      
        
        if(products === null){
            const value = document.getElementById('cantidad').value
           
            const updatedTire = [{
                tire,count:value
            }]
            localStorage.setItem('productsCar',JSON.stringify(updatedTire))
            document.getElementById('cantidad').value = ""
            setErrorStockSuma(false)
            
        }else{
            console.log('aqui')
                verificateTireExisting()
        }

        
    }

    const verificateTireExisting =()=>{
        const products = JSON.parse(localStorage.getItem('productsCar'));
        console.log(products[0],tire.id)


        const existe = products.some(item => item.tire.id == tire.id)
        if(!existe){
            const value = document.getElementById('cantidad').value
            const newProduct = {
                tire,count:value
            }

            products.push(newProduct)
            localStorage.setItem('productsCar',JSON.stringify(products))
            document.getElementById('cantidad').value = "";
            setErrorStockSuma(false)
        }
        else{
            const value = document.getElementById('cantidad').value
            const productoExistente = products.find(item => item.tire.id == tire.id)
            
            if(productoExistente){
                const countActual = parseInt(productoExistente.count)
                const countNuevo = parseInt(value)
                const stockDisponible = productoExistente.tire.product.stock
                
                if((countActual + countNuevo) > stockDisponible){
                    setErrorStockSuma(true)
                    setButtonConfirm(false)
                    return
                }
                
                setErrorStockSuma(false)
                products.map(item => {
                    if(item.tire.id == tire.id){
                        item.count = countActual + countNuevo
                    }
                    return item
                })
                localStorage.setItem('productsCar',JSON.stringify(products))
                document.getElementById('cantidad').value = "";
            }
        }

    }




    return (
        <div className="modal fade" id="confirmacionModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Confirmar Rueda</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form action="">
                            <div className="row mt-3">

                                <div className="col-6">
                                    <div>
                                        <label for="cantidad" className="form-label mt-4">Cantidad</label>
                                        <input type="number" className="form-control" id="cantidad" aria-describedby="cantidad" placeholder="ej. 2" onChange={verificarStock}/>
                                        {leableStock && (
                                            <label for="cantidad" className="form-label mt-4 text-danger" >La cantidad es superior al numero de stock</label>

                                        )}
                                        {errorStockSuma && (
                                            <label for="cantidad" className="form-label mt-4 text-danger" >La cantidad sumada supera el stock disponible</label>
                                        )}

                                    </div>
                                </div>

                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        {buttonConfitm && (
                            <button type="button" className="btn btn-primary"  onClick={addTire}> Confirmar Rueda</button>

                        )}
                        
                    </div>
                </div>
            </div>
        </div>
    )
}
