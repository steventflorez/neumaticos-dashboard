import { startGetTireByDiameter, startGetTireByRef } from '../../store/products/thunks';
import { Add } from '../../UI/Add'
import { CardRueda } from './components/CardRueda';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { createTireWithProduct, updateTireWithProduct } from '../../data/products/Tire';
import { CarritoModal } from './components/CarritoModal';



export const Product = () => {

    
    const [product, setProduct] = useState({width:"", height:"", diameter:""});

    const infoModal = {
        titulo:"Inventario de Neumáticos",
        subTirulo:"Gestiona el inventario completo de neumáticos del taller",
        textButton:"Agregar Neumático",
        modalId:"#ruedaModal"
    };
    const dispatch = useDispatch();

    const Tires = useSelector((state) => state.products.items);
    const state = useSelector((state) => state.products.edit)
    
    const handleReferenciaChange = (e) => {
        let length = e.target.value.length;
        if(length === 7){
            dispatch(startGetTireByRef({width: e.target.value.slice(0, 3), height: e.target.value.slice(3, 5), diameter: e.target.value.slice(5, 7)}));
        }
        if(length === 2){
            dispatch(startGetTireByDiameter(e.target.value));
        }
    }
    const handlepercentageChange = (e) => {
        setProduct({...product,percentage: e.target.value});
    }

    const handleCrearRueda = async () => {
        // Capturar todos los valores del formulario del modal
        const ancho = document.getElementById('ancho').value;
        const alto = document.getElementById('alto').value;
        const radio = document.getElementById('radio').value;
        const marca = document.getElementById('marca').value;
        const indiceCarga = document.getElementById('indice_de_carga').value;
        const velocidad = document.getElementById('calidad').value;
        const coste = document.querySelector('input[aria-label="Amount (to the nearest dollar)"]').value;
        const precioSugerido = document.querySelectorAll('input[aria-label="Amount (to the nearest dollar)"]')[1].value;
        const stock = document.getElementById('stock').value;
        const isNew = document.getElementById('is_new').value;
        const percentage = document.getElementById('percentage').value;
        
        
        const formData = {
            ancho,
            alto,
            radio,
            marca,
            indiceCarga,
            velocidad,
            coste,
            precioSugerido,
            calidad: percentage,
            stock,
            isNew
        };
        console.log(isNew)
        const tireData = {
            width: ancho,
            height: alto,
            diameter: radio,
            load_index: indiceCarga,
            speed_rating_id: 27,
            is_new: isNew === "Si" ? true : false,
            percentaje: percentage,
        };

        const productData = {
            name: marca,
            model: `${ancho}/${alto}/R${radio}`,
            price: precioSugerido,
            stock,
            is_active: true
            
        };

        if (state) {
            if (!productEdit || !productEdit.id) {
                console.error("No se encontró el ID del producto para actualizar.");
                return;
            }

           

            try {
                const tireEdit = await updateTireWithProduct(productEdit.id, tireData, productData);
                console.log("Resultado de la actualización:", tireEdit);
                setProduct({
                    width: "",
                    height: "",
                    diameter: "",
                    brand: "",
                    load_index: "",
                    speed_index: "",
                    cost: "",
                    price: "",
                    stock: "",
                    is_new: "",
                    percentage: 100
                });

            } catch (error) {
                console.error("Error al actualizar el neumático:", error);
            }
        } else {
            console.log("Datos enviados para crear:", { tireData, productData });

            try {
                const tire = await createTireWithProduct(tireData, productData);
                console.log("Resultado de la creación:", tire);
            } catch (error) {
                console.error("Error al crear el neumático:", error);
            }
        }
        
        console.log('Datos del formulario:', formData);
        
    }
    const productEdit = useSelector((state) => state.products.productSlice);

    useEffect(() => {
        if (productEdit && state) {
            setProduct({
                width: productEdit.width || "",
                height: productEdit.height || "",
                diameter: productEdit.diameter || "",
                brand: productEdit.product?.name || "",
                load_index: productEdit.load_index || "",
                speed_index: productEdit.speed_index?.code || "",
                cost: productEdit.product?.cost || "",
                price: productEdit.product?.price || "",
                stock: productEdit.product?.stock || "",
                is_new: productEdit.is_new ? "Si" : "No",
                percentage: productEdit.percentaje || 100
            });
            
        } else {
            setProduct({
                width: "",
                height: "",
                diameter: "",
                brand: "",
                load_index: "",
                speed_index: "",
                cost: "",
                price: "",
                stock: "",
                is_new: "",
                percentage: 100
            });
        }
    }, [productEdit, state]);

    useEffect(() => {
        if (product) {
            document.getElementById('ancho').value = product.width;
            document.getElementById('alto').value = product.height;
            document.getElementById('radio').value = product.diameter;
            document.getElementById('marca').value = product.brand;
            document.getElementById('indice_de_carga').value = product.load_index;
            document.getElementById('calidad').value = product.speed_index;
            document.querySelector('input[aria-label="Amount (to the nearest dollar)"]').value = product.cost;
            document.querySelectorAll('input[aria-label="Amount (to the nearest dollar)"]')[1].value = product.price;
            document.getElementById('stock').value = product.stock;
            document.getElementById('is_new').value = product.is_new;
            document.getElementById('percentage').value = product.percentage;
        }
    }, [product]);

   

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
                                <input type="text" className="form-control" id="referencia" aria-describedby="referEjm"   placeholder="Ej. 2055516"  onChange={handleReferenciaChange} />

                            </div>
                            


                        </div>

                    </form>


                </div>
            </div>
            <div className="card border-light mb-3">
                <div className="card-body p-4">
                    <div className="row">
                        <div className="col-6">
                            <h5>Resultados ({Tires.length})</h5>
                        </div>
                        <div className="col-6 d-flex justify-content-end align-items-center">
                            <p>Total stick: 2 unidades</p>
                        </div>
                        {Tires.length === 0 && (
                            <div className="col-12">
                                <h6 className="text-danger">No se encontraron resultados...</h6>
                            </div>
                        )}
                        {Tires.map((tire) => (
                            <CardRueda key={tire.id} tire={tire} />
                        ))}
                       
                    </div>
                </div>
            </div>

            <div className="modal fade" id="ruedaModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">{state? "Editar":"Agregar"} Rueda</h1>
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
                                                <option>Pinchazo</option>

                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div>
                                            <label for="indice_de_carga" className="form-label mt-4">Indice de carga</label>
                                            <input type="number" className="form-control" id="indice_de_carga" aria-describedby="radio" placeholder="ej. 94" />

                                        </div>

                                    </div>
                                    <div className="col-6">
                                        <div>
                                            <label for="velocidad" className="form-label mt-4">Cod. velocidad</label>
                                            <select className="form-select" id="calidad">
                                                <option>Selecciona cod. velocidad</option>
                                                <option>V</option>
                                                <option>W</option>
                                                <option>Y</option>
                                            </select>
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
                                    <div className="col-12">
                                    <label for="percentage" class="form-label">Calidad</label>
                                    <h4 className='text-warning'>{product.percentage}%</h4>
                                    <input type="range" class="form-range" min="50" max="100" step="5" id="percentage" onChange={handlepercentageChange}/>
                                    </div>
                                    <div className="col-6">
                                        <div>
                                            <label for="stock" className="form-label mt-4">Stock</label>
                                            <input type="number" className="form-control" id="stock" aria-describedby="stock" placeholder="ej. 3"  />

                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div>
                                            <label for="is_new" className="form-label mt-4">¿Es Nueva?</label>
                                            <select className="form-select" id="is_new">
                                                <option>Selecciona una respuesta</option>
                                                <option>Si</option>
                                                <option>No</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-primary" onClick={handleCrearRueda}> {state? "Actualizar": "Crear"} Rueda</button>
                        </div>
                    </div>
                </div>
            </div>

            <CarritoModal />

        </>
    )
}
