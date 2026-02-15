import React from 'react';
import { ProductForm } from './ProductForm';

export const ProductModal = ({ isEditMode, initialData, onSubmit }) => {
    return (
        <div className="modal fade" id="ruedaModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fw-bold d-flex align-items-center">
                            <i className={`bi ${isEditMode ? 'bi-pencil-square' : 'bi-plus-circle'} text-info me-2`}></i>
                            {isEditMode ? "Editar" : "Agregar"} Neumático
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <ProductForm
                            isEditMode={isEditMode}
                            initialData={initialData}
                            onSubmit={onSubmit}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
