import React from 'react'
import PropTypes from "prop-types"; 

export const Add = ({info}) => {
  return (
    <div className="row mb-3">
    <div className="col-lg-6 col-12">
        <h3>{info.titulo}</h3>
        <p>{info.subTirulo}</p>
    </div>
    <div className="col-lg-6 col-12 justify-content-center d-flex align-items-center">
        <div>
            <button type="button" className="btn btn-info" data-bs-toggle="modal" data-bs-target={info.modalId} ><i className="bi bi-plus"></i> {info.textButton}</button>
        </div>

    </div>
</div>
  )
}

Add.propTypes = {
    info: PropTypes.node.isRequired,
  };
