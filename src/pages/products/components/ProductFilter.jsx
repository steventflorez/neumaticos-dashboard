import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { startGetTireByDiameter, startGetTireByRef } from '../../../store/products/thunks';

export const ProductFilter = () => {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        const length = value.length;

        if (length === 7) {
            dispatch(startGetTireByRef({
                width: value.slice(0, 3),
                height: value.slice(3, 5),
                diameter: value.slice(5, 7)
            }));
        } else if (length === 2) {
            dispatch(startGetTireByDiameter(value));
        }
    }

    return (
        <div className="premium-card card-static mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="card-body p-4">
                <div className="row align-items-center">
                    <div className="col-12 col-md-5 mb-3 mb-md-0">
                        <h6 className="card-title mb-0 d-flex align-items-center">
                            <i className="bi bi-search me-2 text-info"></i>
                            Búsqueda Rápida
                        </h6>
                    </div>
                    <div className="col-12 col-md-7">
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="bi bi-search small"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Referencia (ej. 2055516) o radio (ej. 16)"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
