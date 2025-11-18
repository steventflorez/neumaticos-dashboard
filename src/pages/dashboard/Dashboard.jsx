import React from 'react'
import { useEffect } from 'react'
import { getSalesByCreationDate, getCashRegister } from '../../data/products/Tire';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
    const [totalSales, setTotalSales] = useState(0);
    const [activeFilter, setActiveFilter] = useState('day');
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [customSales, setCustomSales] = useState([]);
    const [cashRegister, setCashRegister] = useState(null);

    const handleCustomDateFilter = async (startDate, endDate) => {
        try {
            if (!startDate || !endDate) {
                console.warn('Fechas incompletas:', { startDate, endDate });
                return;
            }

            const ventas = await getSalesByCreationDate(startDate, endDate);
            setCustomSales(ventas);
            console.log('Ventas personalizadas:', ventas);
        } catch (error) {
            console.error('Error al obtener las ventas personalizadas:', error);
        }
    };

    useEffect(() => {
        const fetchTires = async () => {
            try {
                const today = new Date();
                const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
                const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

                const ventas = await getSalesByCreationDate(startDate, endDate);
                let total = 0;
                ventas.forEach(venta => {
                    total += venta.total_amount;
                });
                const totalSale = parseFloat(total.toFixed(2));
                setTotalSales(totalSale);
                console.log('Ventas de hoy:', ventas, 'Total:', totalSale);

            } catch (error) {
                console.error('Error al obtener las ventas:', error);
            }
        };

        fetchTires();
    }, []);

    useEffect(() => {
        const fetchCashRegister = async () => {
            try {
                const cashRegister = await getCashRegister();
                setCashRegister(cashRegister.current_balance );
                console.log('Información de la caja registradora:', cashRegister);
            } catch (error) {
                console.error('Error al obtener la información de la caja registradora:', error);
            }
        };

        fetchCashRegister();
    }, []);

    const handleFilterClick = async (filterType) => {
        try {
            const today = new Date();
            let startDate, endDate;

            if (filterType === 'week') {
                const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
                startDate = new Date(firstDayOfWeek.getFullYear(), firstDayOfWeek.getMonth(), firstDayOfWeek.getDate()).toISOString();
                endDate = new Date(firstDayOfWeek.getFullYear(), firstDayOfWeek.getMonth(), firstDayOfWeek.getDate() + 7).toISOString();
            } else if (filterType === 'month') {
                startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
                endDate = new Date(today.getFullYear(), today.getMonth() + 1, 1).toISOString();
            } else {
                startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
                endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();
            }

            const ventas = await getSalesByCreationDate(startDate, endDate);
            let total = 0;
            ventas.forEach(venta => {
                total += venta.total_amount;
            });
            const totalSale = parseFloat(total.toFixed(2));
            setTotalSales(totalSale);
            setActiveFilter(filterType);
            console.log(`Ventas de ${filterType}:`, ventas, 'Total:', totalSale);
        } catch (error) {
            console.error(`Error al obtener las ventas de ${filterType}:`, error);
        }
    };

    return (
        <>
            <div class="card shadow-sm p-3" >
                <div class="d-flex justify-content-between border-bottom pb-2">
                    <button class={activeFilter == 'day' ? "btn btn-primary btn-sm" : "btn btn-outline-secondary btn-sm"} onClick={() => handleFilterClick('day')}>Hoy</button>
                    <button class={activeFilter == 'week' ? "btn btn-primary btn-sm" : "btn btn-outline-secondary btn-sm"} onClick={() => handleFilterClick('week')}>Semana</button>
                    <button class={activeFilter == 'month' ? "btn btn-primary btn-sm" : "btn btn-outline-secondary btn-sm"} onClick={() => handleFilterClick('month')}>Mes</button>

                </div>

                <div class="row">
                    <div class="col-12 col-lg-4 text-center mt-3">
                        <h3>€ {totalSales}</h3>
                    </div>
                </div>


            </div>
            <Link to="/caja" class="text-decoration-none">
            <div class="card shadow-sm p-3 mt-5" >
                <div class="d-flex justify-content-centerz border-bottom pb-2">
                    <h5>En Caja</h5>

                </div>

                <div class="row">
                    <div class="col-12 col-lg-4 text-center mt-3">
                        <h3>€ {cashRegister}</h3>
                    </div>
                </div>


            </div>
            
            </Link>
           

            <h4 className="mb-3 text-center mt-5">Seleccionar Rango de Fechas</h4>

            <div className="mb-3">
                <label className="form-label">Fecha de inicio</label>
                <input
                    type="date"
                    className="form-control"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Fecha de fin</label>
                <input
                    type="date"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>

            <button
                className="btn btn-primary mt-3"
                onClick={() => handleCustomDateFilter(startDate, endDate)}
            >
                Filtrar por rango de fechas
            </button>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Metodo de pago</th>
                        <th scope="col">Sub Total</th>
                        <th scope="col">Iva</th>
                        <th scope="col">Total</th>
                    </tr>
                </thead>
                <tbody>
                  {  customSales.map((sale, index) => (
                        <tr key={index}>
                            <th scope="row">{sale.id}</th>
                            <th scope="row">{sale.payment_method == 1?'Efectivo':'tarjeta'}</th>
                            <td>€ {sale.sub_total_amount}</td>
                            <td>€ {sale.tax_amount}</td>
                            <td>€ {sale.total_amount}</td>
                        </tr>
                    ))}
                   
                </tbody>
            </table>

        </>
    )
}
