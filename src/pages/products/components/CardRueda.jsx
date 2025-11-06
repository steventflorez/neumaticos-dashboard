import React from 'react'
import PropTypes from "prop-types"; 
import { useDispatch } from 'react-redux';
import { startSetAddProduct, startSetEdit, startSetProductSlice } from '../../../store/products/thunks';

export const CardRueda = ({tire}) => {
    const dispatch = useDispatch();
    const setState = ()=>{
      dispatch(startSetEdit(true))
      dispatch(startSetProductSlice(tire))
    }

    const setAddProduct = ()=>{
        dispatch(startSetAddProduct(tire))

    }

  return (
    <div className="col-12 col-lg-4 mt-3">
    <div className="card border-light" >
        <div className="card-body p-4">
            <div className="row">
                <div className="col-6">
                    <h5><strong>{tire.product.name}</strong></h5>
                    <p>plus</p>
                </div>
                <div className="col-6 d-flex justify-content-end">
                    <div>
                        
                        {tire.is_new ? <span className="badge rounded-pill bg-success">Nueva {tire.percentaje} %</span>:<span className="badge rounded-pill bg-dark">Ocación {tire.percentaje} %</span>}
                    </div>

                </div>
                <div className="col-6">
                    Medidas:
                </div>
                <div className="col-6 d-flex justify-content-end"><strong>{tire.width}/{tire.height}/{tire.diameter}</strong></div>
                <div className="col-6 mt-2">
                    Carga/velocidad:
                </div>
                <div className="col-6 mt-2 d-flex justify-content-end"><strong>{tire.load_index}{tire.speed_index.code}</strong></div>
                <div className="col-6 mt-2">
                    <i className="bi bi-box-seam"></i> Stock:
                </div>
                <div className="col-6 mt-2 d-flex justify-content-end"><p className="text-warning">{tire.product.stock} unidades</p></div>
                <div className="col-6">
                    <i className="bi bi-currency-euro"></i> Precio:
                </div>
                <div className="col-6 d-flex justify-content-end"><h6><p className="text-info">€ {tire.product.price}</p></h6></div>
                <div className="col-6"><i className="bi bi-calendar-date"></i> Ingreso</div>
                <div className="col-6 d-flex justify-content-end">{new Date (tire.created_at).toISOString().split('T')[0]}</div>
                <div className="col-6 mt-3"><button type="button"  data-bs-toggle="modal" data-bs-target="#ruedaModal" class="btn btn-success" onClick={setState}><i class="bi bi-pencil"></i> Editar</button></div>
                <div className="col-6 mt-3"><button type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#confirmacionModal" onClick={setAddProduct}><i class="bi bi-basket3"></i> Agregar</button></div>
                <div className="d-flex mt-3">
                    <button type="button" className="btn btn-danger  w-100"><i className="bi bi-trash"></i> Eliminar</button>
                </div>


            </div>
        </div>

    </div>

</div>
  )
}

CardRueda.propTypes = {
  tire: PropTypes.object.isRequired,
}