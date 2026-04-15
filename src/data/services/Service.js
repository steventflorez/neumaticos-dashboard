import { supabase } from "../../supabaseClient";

// Obtener todos los servicios activos
export const getAllServices = async () => {
    const { data, error } = await supabase
        .from("service")
        .select("*")
        .eq("is_active", true)
        .order("name");

    if (error) throw error;
    return data;
};

// Crear un nuevo servicio
export const createService = async (serviceData) => {
    const { data, error } = await supabase
        .from("service")
        .insert(serviceData)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Actualizar un servicio
export const updateService = async (serviceId, serviceData) => {
    const { data, error } = await supabase
        .from("service")
        .update(serviceData)
        .eq("id", serviceId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Eliminar un servicio (soft delete)
export const deleteService = async (serviceId) => {
    const { error } = await supabase
        .from("service")
        .update({ is_active: false })
        .eq("id", serviceId);

    if (error) throw error;
    return { success: true };
};
