import React from 'react'
import PropTypes from "prop-types";
import { useDispatch } from 'react-redux';
import { startSetEdit, startSetProductSlice } from '../store/products/thunks';

export const Add = ({ info }) => {

  const dispatch = useDispatch();
  const setState = () => {
    dispatch(startSetEdit(false))
    dispatch(startSetProductSlice(null))
  }
  return (
    <div className="row mb-5 align-items-center animate-fade-in">
      <div className="col-lg-8 col-12">
        <h1 className="fw-bold mb-1">{info.titulo}</h1>
        <p className="text-muted fs-5 mb-0">{info.subTirulo}</p>
      </div>
      <div className="col-lg-4 col-12 mt-3 mt-lg-0 d-flex justify-content-lg-end">
        <button
          type="button"
          className="btn btn-info shadow-sm d-flex align-items-center px-4 py-2"
          data-bs-toggle="modal"
          data-bs-target={info.modalId}
          onClick={setState}
        >
          <i className="bi bi-plus-lg me-2"></i>
          <span className="fw-semibold">{info.textButton}</span>
        </button>
      </div>
    </div>
  )
}

Add.propTypes = {
  info: PropTypes.node.isRequired,
};
