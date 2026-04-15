import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Venta } from '../pages/venta/venta'
import { Product } from '../pages/products/product'
import { Proximamente } from '../pages/Proximamente'
import { Dashboard } from '../pages/dashboard/Dashboard'
import { Caja } from '../pages/dashboard/Caja'
import { SalesDetail } from '../pages/dashboard/SalesDetail'
import { ProtectedRoute } from '../components/ProtectedRoute'

export const RouterNav = () => {
  return (
    <>
      <Routes>
        <Route path='/*' element={<Venta />} />
        <Route path='/inventario' element={<Product />} />
        <Route path='/facturas' element={<Proximamente />} />
        <Route path='/dashboard' element={
          <ProtectedRoute allowedRoles={['administrador']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path='/ventas/:period' element={
          <ProtectedRoute allowedRoles={['administrador']}>
            <SalesDetail />
          </ProtectedRoute>
        } />
        <Route path='/caja' element={
          <ProtectedRoute allowedRoles={['administrador', 'trabajador']}>
            <Caja />
          </ProtectedRoute>
        } />
      </Routes>

    </>
  )
}
