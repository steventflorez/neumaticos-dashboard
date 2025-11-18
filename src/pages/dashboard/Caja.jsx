import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { createNegativeTransaction, getAllCashTransactions, getCashRegister } from '../../data/products/Tire';

export const Caja = () => {
    const [transactions, setTransactions] = useState([]);
    const [cashRegister, setCashRegister] = useState(null);
    const [buttonConfitm, setButtonConfitm] = useState(false);

    useEffect(() => {
        const fetchTransactions = async () => {
            const transactiosDB = await getAllCashTransactions();
            setTransactions(transactiosDB);
        };

        fetchTransactions();
    }, []);

    useEffect(() => {
        const fetchCashRegister = async () => {
            try {
                const cashRegister = await getCashRegister();
                setCashRegister(cashRegister.current_balance);
                console.log('Información de la caja registradora:', cashRegister);
            } catch (error) {
                console.error('Error al obtener la información de la caja registradora:', error);
            }
        };

        fetchCashRegister();
    }, []);

    const verificarValor = () => {
        const cantidad = document.getElementById('cantidad').value;
        if (cantidad <= cashRegister && cantidad > 0) {
            setButtonConfitm(true);
        } else {
            setButtonConfitm(false);
        }
    }

    const retirar = async () => {
        const amount = parseFloat(document.getElementById('cantidad').value);
        const description = document.getElementById('concepto').value;
        await createNegativeTransaction(amount, description);
        window.location.reload();
    }

    return (
        <>
            <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#cajaModal">Retirar</button>

            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Tipo</th>
                        <th scope="col">Valor</th>
                        <th scope="col">Fecha y hora</th>
                        <th scope="col"> Concepto</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                            <th scope="row">{transaction.type}</th>
                            <td>€ {transaction.amount}</td>
                            <td>{new Date(transaction.created_at).toLocaleDateString()} {new Date(transaction.created_at).toLocaleTimeString()}</td>
                            <td>{transaction.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="modal fade" id="cajaModal" tabIndex="-1" aria-labelledby="cajaModal" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" >Confirmar Retiro</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form action="">
                                <div className="row mt-3">

                                    <div className="col-6">
                                        <div>
                                            <label for="cantidad" className="form-label mt-4">Cantidad €</label>
                                            <input type="number" className="form-control" id="cantidad" aria-describedby="cantidad" placeholder="ej. 30" onChange={verificarValor} />


                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div>
                                            <label for="concepto" className="form-label mt-4">Concepto</label>
                                            <textarea class="form-control" id="concepto" rows="3"></textarea>
                                        </div>
                                    </div>

                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            {buttonConfitm && (
                                <button type="button" className="btn btn-primary" onClick={retirar}> Confirmar Retiro</button>

                            )}

                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}
