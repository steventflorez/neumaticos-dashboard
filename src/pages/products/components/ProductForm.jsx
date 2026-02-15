import React, { useState, useEffect } from 'react';

export const ProductForm = ({ initialData, isEditMode, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        width: "",
        height: "",
        diameter: "",
        brand: "",
        load_index: "",
        speed_index: "",
        cost: "",
        price: "",
        stock: "",
        is_new: "No",
        percentage: 100,
        description: "",
        year: "",
        snow: "No",
        cargo: "No"
    });

    useEffect(() => {
        if (initialData && isEditMode) {
            setFormData({
                width: initialData.width || "",
                height: initialData.height || "",
                diameter: initialData.diameter || "",
                brand: initialData.product?.name || "",
                load_index: initialData.load_index || "",
                speed_index: initialData.speed_index?.code || "",
                cost: initialData.product?.cost || "",
                price: initialData.product?.price || "",
                stock: initialData.product?.stock || "",
                is_new: initialData.is_new ? "Si" : "No",
                percentage: initialData.percentaje || 100,
                description: initialData.description || "",
                year: initialData.year || "",
                snow: initialData.is_snow ? "Si" : "No",
                cargo: initialData.is_cargo ? "Si" : "No"
            });
        } else {
            setFormData({
                width: "",
                height: "",
                diameter: "",
                brand: "",
                load_index: "",
                speed_index: "",
                cost: "",
                price: "",
                stock: "",
                is_new: "No",
                percentage: 100,
                description: "",
                year: "",
                snow: "No",
                cargo: "No"
            });
        }
    }, [initialData, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row mt-3">
                <div className="col-6">
                    <label htmlFor="width" className="form-label mt-4">Ancho</label>
                    <input type="number" className="form-control" name="width" value={formData.width} onChange={handleChange} placeholder="ej. 205" />
                </div>
                <div className="col-6">
                    <label htmlFor="height" className="form-label mt-4">Alto</label>
                    <input type="number" className="form-control" name="height" value={formData.height} onChange={handleChange} placeholder="ej. 55" />
                </div>
                <div className="col-6">
                    <label htmlFor="diameter" className="form-label mt-4">Radio</label>
                    <input type="number" className="form-control" name="diameter" value={formData.diameter} onChange={handleChange} placeholder="ej. 16" />
                </div>
                <div className="col-6">
                    <label htmlFor="brand" className="form-label mt-4">Marca</label>
                    <select className="form-select" name="brand" value={formData.brand} onChange={handleChange}>
                        <option value="">Todas las Marcas</option>
                        <option value="Michelin">Michelin</option>
                        <option value="Pirelly">Pirelly</option>
                        <option value="GodYear">GodYear</option>
                        <option value="Pinchazo">Pinchazo</option>
                    </select>
                </div>
                <div className="col-6">
                    <label htmlFor="load_index" className="form-label mt-4">Indice de carga</label>
                    <input type="number" className="form-control" name="load_index" value={formData.load_index} onChange={handleChange} placeholder="ej. 94" />
                </div>
                <div className="col-6">
                    <label htmlFor="speed_index" className="form-label mt-4">Cod. velocidad</label>
                    <select className="form-select" name="speed_index" value={formData.speed_index} onChange={handleChange}>
                        <option value="">Selecciona cod. velocidad</option>
                        <option value="V">V</option>
                        <option value="W">W</option>
                        <option value="Y">Y</option>
                    </select>
                </div>
                <div className="col-6">
                    <label htmlFor="year" className="form-label mt-4">Año</label>
                    <select className="form-select" name="year" value={formData.year} onChange={handleChange}>
                        <option value="">Selecciona el año</option>
                        {(() => {
                            const currentYear = new Date().getFullYear();
                            const startYear = 2010;
                            const years = [];
                            for (let y = currentYear; y >= startYear; y--) {
                                years.push(y);
                            }
                            return years.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ));
                        })()}
                    </select>
                </div>
                <div className="col-6">
                    <label htmlFor="snow" className="form-label mt-4">¿Es de Nieve?</label>
                    <select className="form-select" name="snow" value={formData.snow} onChange={handleChange}>
                        <option value="No">No</option>
                        <option value="Si">Si</option>
                    </select>
                </div>
                <div className="col-6">
                    <label htmlFor="cargo" className="form-label mt-4">¿Es de Carga?</label>
                    <select className="form-select" name="cargo" value={formData.cargo} onChange={handleChange}>
                        <option value="No">No</option>
                        <option value="Si">Si</option>
                    </select>
                </div>
                <div className="col-6">
                    <label htmlFor="cost" className="form-label mt-4">Coste</label>
                    <div className="input-group mb-3">
                        <span className="input-group-text">€</span>
                        <input type="number" className="form-control" name="cost" value={formData.cost} onChange={handleChange} />
                        <span className="input-group-text">.00</span>
                    </div>
                </div>
                <div className="col-6">
                    <label htmlFor="price" className="form-label mt-4">Precio sugerido</label>
                    <div className="input-group mb-3">
                        <span className="input-group-text">€</span>
                        <input type="number" className="form-control" name="price" value={formData.price} onChange={handleChange} />
                        <span className="input-group-text">.00</span>
                    </div>
                </div>
                <div className="col-12">
                    <label htmlFor="percentage" className="form-label">Calidad</label>
                    <h4 className='text-warning'>{formData.percentage}%</h4>
                    <input type="range" className="form-range" min="50" max="100" step="5" name="percentage" value={formData.percentage} onChange={handleChange} />
                </div>
                <div className="col-6">
                    <label htmlFor="stock" className="form-label mt-4">Stock</label>
                    <input type="number" className="form-control" name="stock" value={formData.stock} onChange={handleChange} placeholder="ej. 3" />
                </div>
                <div className="col-6">
                    <label htmlFor="is_new" className="form-label mt-4">¿Es Nueva?</label>
                    <select className="form-select" name="is_new" value={formData.is_new} onChange={handleChange}>
                        <option value="">Selecciona una respuesta</option>
                        <option value="Si">Si</option>
                        <option value="No">No</option>
                    </select>
                </div>
                <div className="col-6">
                    <label htmlFor="description" className="form-label mt-4">Apunte</label>
                    <input type="text" className="form-control" name="description" value={formData.description} onChange={handleChange} />
                </div>
            </div>
            <div className="modal-footer mt-3">
                <button type="button" className="btn btn-secondary" onClick={onCancel} data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" className="btn btn-primary"> {isEditMode ? "Actualizar" : "Crear"} Rueda</button>
            </div>
        </form>
    );
};
