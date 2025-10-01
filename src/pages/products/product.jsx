
import { Add } from '../../UI/Add'
import { CardRueda } from './components/CardRueda';

export const Product = () => {
    const infoModal = {
        titulo:"Inventario de Neumáticos",
        subTirulo:"Gestiona el inventario completo de neumáticos del taller",
        textButton:"Agregar Neumático",
        modalId:"#ruedaModal"
    };
    return (
        <>
           <Add info={infoModal}/>
          
            <div className="card border-light mb-3" >

                <div className="card-body p-4">
                    <div className="row">
                        <div className="col-6">
                            <h4 className="card-title"><i className="bi bi-funnel"></i> Filtro de Búsqueda</h4>
                        </div>

                    </div>
                    <form action="">
                        <div className="row">
                            <div className="col-6">
                                <input type="text" className="form-control" id="referencia" aria-describedby="referEjm" placeholder="Ej. 2055516" />

                            </div>
                            <div className="col-6 justify-content-start d-flex align-items-center">
                                <div className="div">
                                    <button type="submit" className="btn btn-success ">Filtrar</button>

                                </div>

                            </div>


                        </div>

                    </form>


                </div>
            </div>
            <div className="card border-light mb-3">
                <div className="card-body p-4">
                    <div className="row">
                        <div className="col-6">
                            <h5>Resultados (1)</h5>
                        </div>
                        <div className="col-6 d-flex justify-content-end align-items-center">
                            <p>Total stick: 2 unidades</p>
                        </div>
                        <CardRueda/>
                        <CardRueda/>
                        <CardRueda/>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="ruedaModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Agregar Rueda</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form action="">
                                <div className="row mt-3">
                                    <div className="col-6">
                                        <div>
                                            <label for="ancho" className="form-label mt-4">Ancho</label>
                                            <input type="number" className="form-control" id="ancho" aria-describedby="ancho" placeholder="ej. 205" />

                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div>
                                            <label for="alto" className="form-label mt-4">Alto</label>
                                            <input type="number" className="form-control" id="alto" aria-describedby="alto" placeholder="ej. 55" />

                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div>
                                            <label for="radio" className="form-label mt-4">Radio</label>
                                            <input type="number" className="form-control" id="radio" aria-describedby="radio" placeholder="ej. 16" />

                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div>
                                            <label for="marca" className="form-label mt-4">Marca</label>
                                            <select className="form-select" id="marca">
                                                <option>Todas las Marcas</option>
                                                <option>Michelin</option>
                                                <option>Pirelly</option>
                                                <option>GodYear</option>

                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div>
                                            <label for="Indice_de_carga" className="form-label mt-4">Indice de carga</label>
                                            <input type="number" className="form-control" id="radio" aria-describedby="radio" placeholder="ej. 94" />

                                        </div>

                                    </div>

                                    <div className="col-6">
                                        <div>
                                            <label for="cod_Velocidad" className="form-label mt-4">Cod. Velocidad</label>
                                            <input type="text" className="form-control" id="cod_velocidad" aria-describedby="radio" placeholder="ej. V" />
                                        </div>

                                    </div>
                                    <div className="col-6">
                                    <label for="coste" className="form-label mt-4">Coste</label>
                                        <div className="input-group mb-3">
                                            <span className="input-group-text">€</span>
                                            <input type="number" className="form-control" aria-label="Amount (to the nearest dollar)"/>
                                                <span className="input-group-text">.00</span>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                    <label for="coste" className="form-label mt-4">Precio sugerido</label>
                                        <div className="input-group mb-3">
                                            <span className="input-group-text">€</span>
                                            <input type="number" className="form-control" aria-label="Amount (to the nearest dollar)"/>
                                                <span className="input-group-text">.00</span>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div>
                                            <label for="calidad" className="form-label mt-4">Calidad</label>
                                            <select className="form-select" id="calidad">
                                                <option>Selecciona la calidad</option>
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>

                                            </select>
                                            <small>Selecciona 1 para estado bajo o 3 para muy buen estado</small>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-primary">Crear Rueda</button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
