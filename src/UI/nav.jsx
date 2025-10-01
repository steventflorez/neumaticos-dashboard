import React from 'react'
import { Link } from 'react-router-dom'

export const Nav = () => {
  return (
    <>
    <nav className="navbar navbar-expand-lg bg-primary mb-5" data-bs-theme="dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">28 Ruedas</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarColor01">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link to={"/"} className="nav-link " href="#">Venta
                
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/inventario"} className="nav-link" href="#">Inventario</Link>
            </li>
            <li className="nav-item">
              <Link to={"/facturas"} className="nav-link" href="#">Facturas</Link>
            </li>
            <li className="nav-item">
              <Link to={"/dashboard"} className="nav-link" href="#">Dashboard</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    
    </>
  )
}
