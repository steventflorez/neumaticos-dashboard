import { React, useState, useEffect } from 'react';
import { SuccessFeedback } from '../../UI/SuccessFeedback';
import { useSelector, useDispatch } from 'react-redux';
import { createTireWithProduct, updateTireWithProduct } from '../../data/products/Tire';
import { getAllServices, createService, updateService } from '../../data/services/Service';
import { startSetEdit, startSetProductSlice } from '../../store/products/thunks';
import { CarritoModal } from './components/CarritoModal';
import { ProductFilter } from './components/ProductFilter';
import { ProductList } from './components/ProductList';
import { ProductModal } from './components/ProductModal';
import { ServiceList } from './components/ServiceList';
import { ServiceModal } from './components/ServiceModal';



export const Product = () => {
    const dispatch = useDispatch();
    const Tires = useSelector((state) => state.products.items);
    const isEditMode = useSelector((state) => state.products.edit);
    const productEdit = useSelector((state) => state.products.productSlice);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [activeTab, setActiveTab] = useState('neumaticos');

    // Services state
    const [services, setServices] = useState([]);
    const [serviceEditMode, setServiceEditMode] = useState(false);
    const [serviceToEdit, setServiceToEdit] = useState(null);

    // Fetch services on mount
    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const data = await getAllServices();
            setServices(data);
        } catch (error) {
            console.error('Error al obtener servicios:', error);
        }
    };

    const handleSubmit = async (formData) => {

        const tireData = {
            width: formData.width,
            height: formData.height,
            diameter: formData.diameter,
            load_index: formData.load_index,
            speed_rating_id: 27,
            is_new: formData.is_new === "Si",
            percentaje: formData.percentage,
            year: formData.year,
            is_snow: formData.snow === "Si",
            is_cargo: formData.cargo === "Si",
            description: formData.description
        };

        const productData = {
            name: formData.brand,
            model: `${formData.width}/${formData.height}/R${formData.diameter}`,
            price: formData.price,
            stock: formData.stock,
            is_active: true

        };

        if (isEditMode) {
            if (!productEdit || !productEdit.id) {
                console.error("No se encontró el ID del producto para actualizar.");
                return;
            }

            try {
                await updateTireWithProduct(productEdit.id, tireData, productData);
                setSuccessMessage("¡Rueda actualizada correctamente!");
                handleSuccess('ruedaModal');
            } catch (error) {
                console.error("Error al actualizar el neumático:", error);
            }
        } else {
            try {
                await createTireWithProduct(tireData, productData);
                setSuccessMessage("¡Rueda creada correctamente!");
                handleSuccess('ruedaModal');
            } catch (error) {
                console.error("Error al crear el neumático:", error);
            }
        }

    }

    // Service submit handler
    const handleServiceSubmit = async (formData) => {
        try {
            if (serviceEditMode && serviceToEdit) {
                await updateService(serviceToEdit.id, formData);
                setSuccessMessage("¡Servicio actualizado correctamente!");
            } else {
                await createService(formData);
                setSuccessMessage("¡Servicio creado correctamente!");
            }
            handleSuccess('servicioModal');
            fetchServices();
        } catch (error) {
            console.error("Error con el servicio:", error);
        }
    };

    const handleEditService = (service) => {
        setServiceEditMode(true);
        setServiceToEdit(service);
        // eslint-disable-next-line no-undef
        const modal = new bootstrap.Modal(document.getElementById('servicioModal'));
        modal.show();
    };

    const handleNewService = () => {
        setServiceEditMode(false);
        setServiceToEdit(null);
    };

    const handleSuccess = (modalId) => {
        // Cerrar modal del formulario
        const modalEl = document.getElementById(modalId);
        // eslint-disable-next-line no-undef
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) {
            modalInstance.hide();
        }

        // Mostrar feedback
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            window.location.reload();
        }, 2000);
    };

    const handleNewTire = () => {
        dispatch(startSetEdit(false));
        dispatch(startSetProductSlice(null));
    };

    return (
        <>
            {/* Page Header */}
            <div className="row mb-4 align-items-center animate-fade-in">
                <div className="col-lg-8 col-12">
                    <h1 className="fw-bold mb-1">Inventario</h1>
                    <p className="text-muted fs-5 mb-0">Gestiona neumáticos y servicios del taller</p>
                </div>
                <div className="col-lg-4 col-12 mt-3 mt-lg-0 d-flex justify-content-lg-end">
                    {activeTab === 'neumaticos' ? (
                        <button
                            type="button"
                            className="btn btn-info shadow-sm d-flex align-items-center px-4 py-2"
                            data-bs-toggle="modal"
                            data-bs-target="#ruedaModal"
                            onClick={handleNewTire}
                        >
                            <i className="bi bi-plus-lg me-2"></i>
                            <span className="fw-semibold">Agregar Neumático</span>
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="btn shadow-sm d-flex align-items-center px-4 py-2"
                            style={{ background: 'linear-gradient(135deg, #a855f7, #8b5cf6)', color: '#fff' }}
                            data-bs-toggle="modal"
                            data-bs-target="#servicioModal"
                            onClick={handleNewService}
                        >
                            <i className="bi bi-plus-lg me-2"></i>
                            <span className="fw-semibold">Agregar Servicio</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="premium-card card-static mb-4 animate-fade-in">
                <div className="card-body p-2">
                    <div className="d-flex" role="tablist" style={{ gap: '4px' }}>
                        <button
                            className="border-0 px-3 py-3 d-flex align-items-center justify-content-center fw-medium flex-fill"
                            onClick={() => setActiveTab('neumaticos')}
                            type="button"
                            role="tab"
                            style={{
                                background: activeTab === 'neumaticos' ? 'var(--color-accent-muted)' : 'transparent',
                                color: activeTab === 'neumaticos' ? 'var(--color-info)' : 'var(--color-text-muted)',
                                borderBottom: activeTab === 'neumaticos' ? '2px solid var(--color-info)' : '2px solid transparent',
                                borderRadius: '8px 8px 0 0',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <i className="bi bi-circle me-2"></i>
                            Neumáticos
                            <span className="badge bg-info bg-opacity-25 text-info ms-2">{Tires.length}</span>
                        </button>
                        <button
                            className="border-0 px-3 py-3 d-flex align-items-center justify-content-center fw-medium flex-fill"
                            onClick={() => setActiveTab('servicios')}
                            type="button"
                            role="tab"
                            style={{
                                background: activeTab === 'servicios' ? 'rgba(168,85,247,0.1)' : 'transparent',
                                color: activeTab === 'servicios' ? '#a855f7' : 'var(--color-text-muted)',
                                borderBottom: activeTab === 'servicios' ? '2px solid #a855f7' : '2px solid transparent',
                                borderRadius: '8px 8px 0 0',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <i className="bi bi-wrench me-2"></i>
                            Servicios
                            <span className="badge ms-2" style={{
                                background: activeTab === 'servicios' ? 'rgba(168,85,247,0.2)' : 'rgba(168,85,247,0.1)',
                                color: '#a855f7'
                            }}>{services.length}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'neumaticos' ? (
                <>
                    <ProductFilter />
                    <ProductList tires={Tires} />
                </>
            ) : (
                <ServiceList services={services} onEdit={handleEditService} onRefresh={fetchServices} />
            )}

            {/* Modals */}
            <ProductModal
                isEditMode={isEditMode}
                initialData={productEdit}
                onSubmit={handleSubmit}
            />

            <ServiceModal
                isEditMode={serviceEditMode}
                initialData={serviceToEdit}
                onSubmit={handleServiceSubmit}
            />

            <SuccessFeedback
                show={showSuccess}
                message={successMessage}
            />

            <CarritoModal />

        </>
    )
}
