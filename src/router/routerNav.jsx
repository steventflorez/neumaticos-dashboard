import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Venta } from '../pages/venta/venta'
import { Product } from '../pages/products/product'
import { Proximamente } from '../pages/Proximamente'

export const RouterNav = () => {
  return (
    <>
    <Routes>
        <Route path='/*' element={<Venta/>}/>
        <Route path='/inventario' element={<Product/>}/>
        <Route path='/facturas' element={<Proximamente/>}/>
        <Route path='/dashboard' element={<Proximamente/>}/>

    </Routes>
    
    </>
  )
}
