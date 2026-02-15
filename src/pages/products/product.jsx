import { React, useState } from 'react';
import { Add } from '../../UI/Add'
import { SuccessFeedback } from '../../UI/SuccessFeedback';
import { useSelector } from 'react-redux';
import { createTireWithProduct, updateTireWithProduct } from '../../data/products/Tire';
import { CarritoModal } from './components/CarritoModal';
import { ProductFilter } from './components/ProductFilter';
import { ProductList } from './components/ProductList';
import { ProductModal } from './components/ProductModal';



export const Product = () => {


    const infoModal = {
        titulo: "Inventario de Neumáticos",
        subTirulo: "Gestiona el inventario completo de neumáticos del taller",
        textButton: "Agregar Neumático",
        modalId: "#ruedaModal"
    };
    // const dispatch = useDispatch();

    const Tires = useSelector((state) => state.products.items);
    const isEditMode = useSelector((state) => state.products.edit);
    const productEdit = useSelector((state) => state.products.productSlice);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');


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
                handleSuccess();
            } catch (error) {
                console.error("Error al actualizar el neumático:", error);
            }
        } else {
            try {
                await createTireWithProduct(tireData, productData);
                setSuccessMessage("¡Rueda creada correctamente!");
                handleSuccess();
            } catch (error) {
                console.error("Error al crear el neumático:", error);
            }
        }

    }

    const handleSuccess = () => {
        // Cerrar modal del formulario
        const modalEl = document.getElementById('ruedaModal');
        // eslint-disable-next-line no-undef
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) {
            modalInstance.hide();
        }

        // Mostrar feedback
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            window.location.reload(); // Para refrescar la lista, ya que Redux no parece estar conectado reactivamente
        }, 2000);
    };

    return (
        <>
            <Add info={infoModal} />

            <ProductFilter />

            <ProductList tires={Tires} />

            <ProductModal
                isEditMode={isEditMode}
                initialData={productEdit}
                onSubmit={handleSubmit}
            />

            <SuccessFeedback
                show={showSuccess}
                message={successMessage}
            />

            <CarritoModal />

        </>
    )
}
