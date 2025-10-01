import React from 'react'

export const CardRueda = () => {
  return (
    <div className="col-12 col-lg-4 mt-3">
    <div className="card border-light" >
        <div className="card-body p-4">
            <div className="row">
                <div className="col-6">
                    <h5><strong>michelline</strong></h5>
                    <p>plus</p>
                </div>
                <div className="col-6 d-flex justify-content-end">
                    <div>
                        <span className="badge rounded-pill bg-warning"><i className="bi bi-exclamation-circle"></i> Stock bajo</span>
                    </div>

                </div>
                <div className="col-6">
                    Medidas:
                </div>
                <div className="col-6 d-flex justify-content-end"><strong>205/55/16</strong></div>
                <div className="col-6 mt-2">
                    Carga/velocidad:
                </div>
                <div className="col-6 mt-2 d-flex justify-content-end"><strong>91V</strong></div>
                <div className="col-6 mt-2">
                    <i className="bi bi-box-seam"></i> Stock:
                </div>
                <div className="col-6 mt-2 d-flex justify-content-end"><p className="text-warning">2 unidades</p></div>
                <div className="col-6">
                    <i className="bi bi-currency-euro"></i> Precio:
                </div>
                <div className="col-6 d-flex justify-content-end"><h6><p className="text-info">€ 60.00</p></h6></div>
                <div className="col-6"><i className="bi bi-calendar-date"></i> Ingreso</div>
                <div className="col-6 d-flex justify-content-end">21/09/2025</div>
                <div className="d-flex mt-3">
                    <button type="button" className="btn btn-danger  w-100"><i className="bi bi-trash"></i> Eliminar</button>

                </div>


            </div>
        </div>

    </div>

</div>
  )
}
