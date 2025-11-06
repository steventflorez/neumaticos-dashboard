import { supabase } from "../../supabaseClient";



export const getTireByRef = async (ref) => {
    const { width, height, diameter } = ref || {}
    if (!width || !height || !diameter) {
        console.warn('[getTireByRef] Parámetros incompletos:', { width, height, diameter })
        return []
    }
    const { data, error } = await supabase
        .from("tire")
        .select("*,product:product_id(*),speed_index:speed_rating_id(*)")
        .eq("width", width)
        .eq("height", height)
        .eq("diameter", diameter);
    if (error) throw error;
    return data;
}

export const getTireByDiameter = async (diameter) => {
    const { data, error } = await supabase
        .from("tire")
        .select("*,product:product_id(*),speed_index:speed_rating_id(*)")
        .eq("diameter", diameter);
    if (error) throw error;
    return data;
}

// Función para crear un producto
export const createProduct = async (product) => {
    const { data, error } = await supabase
        .from("Product")
        .insert(product)
        .select()
        .single();
    
    if (error) throw error;
    return data;
}

// Función para crear un tire con su producto
export const createTireWithProduct = async (tireData, productData) => {
    try {
        // 1. Primero crear el producto
        const product = await createProduct(productData);
        
        // 2. Crear el tire con el product_id
        const tireToInsert = {
            ...tireData,
            product_id: product.id
        };
        
        const { data: tire, error: tireError } = await supabase
            .from("tire")
            .insert(tireToInsert)
            .select("*, product:product_id(*), speed_index:speed_rating_id(*)")
            .single();
        
        if (tireError) throw tireError;
        
        return tire;
    } catch (error) {
        console.error('[createTireWithProduct] Error:', error);
        throw error;
    }
}


// Función para actualizar un producto
export const updateProduct = async (productId, productData) => {
    const { data, error } = await supabase
        .from("Product")
        .update(productData)
        .eq("id", productId)
        .select()
        .single();

    if (error) throw error;
    if (!data) throw new Error(`Producto con ID ${productId} no encontrado`);
    return data;
}

// Función para actualizar un tire
export const updateTire = async (tireId, tireData) => {
    const { data, error } = await supabase
        .from("tire")
        .update(tireData)
        .eq("id", tireId)
        .select("*, product:product_id(*), speed_index:speed_rating_id(*)")
        .single();

    if (error) throw error;
    if (!data) throw new Error(`Tire con ID ${tireId} no encontrado`);
    return data;
}

// Función para actualizar un tire con su producto en una sola transacción
export const updateTireWithProduct = async (tireId, tireData, productData) => {
    try {
      

        // 1. Obtener el tire actual para validar que existe
        const { data: currentTire, error: getTireError } = await supabase
            .from("tire")
            .select("product_id")
            .eq("id", tireId)
            .single();

        if (getTireError) {
            console.error("[updateTireWithProduct] Error al obtener el tire:", getTireError);
            throw getTireError;
        }
        if (!currentTire) {
            console.error(`[updateTireWithProduct] Tire con ID ${tireId} no encontrado.`);
            throw new Error(`Tire con ID ${tireId} no encontrado.`);
        }

        const productId = currentTire.product_id;

        // 2. Actualizar el producto
        let updatedProduct = null;
        if (productData && Object.keys(productData).length > 0) {
            console.log("[updateTireWithProduct] Actualizando producto con ID:", productId);
            updatedProduct = await updateProduct(productId, productData);
        }

        // 3. Actualizar el tire (sin el product_id ya que es inmutable)
        const tireToUpdate = { ...tireData };
        delete tireToUpdate.product_id; // Evitar intentar actualizar foreign key

        console.log("[updateTireWithProduct] Actualizando tire con ID:", tireId);
        const updatedTire = await updateTire(tireId, tireToUpdate);

        return {
            tire: updatedTire,
            product: updatedProduct
        };
    } catch (error) {
        console.error('[updateTireWithProduct] Error:', error);
        throw error;
    }
}

// Función para actualizar solo ciertos campos
export const partialUpdateTireWithProduct = async (tireId, tireData = {}, productData = {}) => {
    try {
        // 1. Obtener el tire actual
        const { data: currentTire, error: getTireError } = await supabase
            .from("tire")
            .select("*, product:product_id(*)")
            .eq("id", tireId)
            .single();
        
        if (getTireError) throw getTireError;
        if (!currentTire) throw new Error('Tire no encontrado');

        const productId = currentTire.product_id;

        // 2. Actualizar producto solo si hay datos
        let updatedProduct = currentTire.product;
        if (Object.keys(productData).length > 0) {
            updatedProduct = await updateProduct(productId, productData);
        }

        // 3. Actualizar tire solo si hay datos
        let updatedTire = currentTire;
        if (Object.keys(tireData).length > 0) {
            const cleanTireData = { ...tireData };
            delete cleanTireData.product_id;
            updatedTire = await updateTire(tireId, cleanTireData);
        }

        return {
            tire: updatedTire,
            product: updatedProduct
        };
    } catch (error) {
        console.error('[partialUpdateTireWithProduct] Error:', error);
        throw error;
    }
}