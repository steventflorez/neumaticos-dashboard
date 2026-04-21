import React, { useState } from 'react';

export const QuickProductModal = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: 1,
    price: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.price || formData.quantity <= 0) return;

    const quickProduct = {
      isQuickProduct: true,
      isService: true, // Bypass inventory checks
      count: Number(formData.quantity),
      tire: { // Mocked tire object to match existing render structure
        product: {
          name: formData.name,
          description: formData.description,
          price: Number(formData.price)
        }
      }
    };

    onAdd(quickProduct);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      quantity: 1,
      price: ''
    });

    // Close modal using Bootstrap's API or let data-bs-dismiss handle it
  };

  return (
    <div className="modal fade" id="quick_product_modal" tabIndex="-1" aria-labelledby="quickProductModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content premium-card border-0">
          <div className="modal-header border-bottom border-light border-opacity-10">
            <h5 className="modal-title fw-bold" id="quickProductModalLabel">
              <i className="bi bi-lightning-charge text-warning me-2"></i>
              Agregar Producto Rápido
            </h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body p-4">
            <div className="mb-3">
              <label className="form-label text-muted small">Nombre del Producto *</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej. Rueda Usada Michelin"
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label text-muted small">Descripción</label>
              <textarea
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Opcional..."
                rows="2"
              ></textarea>
            </div>

            <div className="row">
              <div className="col-6 mb-3">
                <label className="form-label text-muted small">Cantidad *</label>
                <input
                  type="number"
                  className="form-control"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
              <div className="col-6 mb-3">
                <label className="form-label text-muted small">Valor Unitario (€) *</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>
          <div className="modal-footer border-top border-light border-opacity-10 justify-content-between">
            <button type="button" className="btn btn-outline-light" data-bs-dismiss="modal">Cancelar</button>
            <button 
              type="button" 
              className="btn btn-primary px-4" 
              onClick={handleSave}
              data-bs-dismiss="modal"
              disabled={!formData.name || !formData.price || formData.quantity <= 0}
            >
              <i className="bi bi-plus-circle me-2"></i>Agregar al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
