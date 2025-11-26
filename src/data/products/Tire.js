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
        .eq("diameter", diameter)
        .gt("product_id.stock", 0); // ✅ Usar el nombre de la columna FK, no el alias
    
    if (error) throw error;
    return data;
}

export const getSalesByCreationDate = async (startDate, endDate) => {
    if (!startDate || !endDate) {
        console.warn('[getSalesByCreationDate] Parámetros incompletos:', { startDate, endDate });
        return [];
    }

    const { data, error } = await supabase
        .from("sale")
        .select(`
            *,
            client:client_id(*),
            list_sale(
                *,
                product:product_id(*)
            )
        `)
        .gte("created_at", startDate)
        .lte("created_at", endDate)
        .is("deleted_at", null); // Excluir ventas eliminadas

    if (error) throw error;
    return data;
};
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
           
            throw new Error(`Tire con ID ${tireId} no encontrado.`);
        }

        const productId = currentTire.product_id;

        // 2. Actualizar el producto
        let updatedProduct = null;
        if (productData && Object.keys(productData).length > 0) {
           
            updatedProduct = await updateProduct(productId, productData);
        }

        // 3. Actualizar el tire (sin el product_id ya que es inmutable)
        const tireToUpdate = { ...tireData };
        delete tireToUpdate.product_id; // Evitar intentar actualizar foreign key

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

const normaliseItem = (rawItem = {}) => {
    const tire = rawItem.tire ?? null;

    const product = tire?.product ?? null;
    const productId = product?.id ?? rawItem.product_id ?? rawItem.id ?? null;
    const quantity = Number(rawItem.count ?? rawItem.cantidad ?? rawItem.quantity ?? 0);
    const unitPrice = Number(product?.price ?? rawItem.precio_unitario ?? rawItem.unit_price ?? 0);
    const name = product?.name ?? rawItem.product_name ?? rawItem.nombre_producto ?? "";

    return {
        tire,
        product,
        productId,
        quantity,
        unitPrice,
        name
    };
};

export const createSaleWithItems = async (saleData = {}, items = []) => {
    try {
        if (!Array.isArray(items) || items.length === 0) {
            throw new Error("No hay productos para procesar la venta.");
        }

        const normalisedItems = items.map(normaliseItem);

        // Validar items básicos
        for (const item of normalisedItems) {
            if (!item.productId) {
                throw new Error("Uno de los productos no tiene un ID válido.");
            }
            if (!item.quantity || item.quantity <= 0) {
                throw new Error("La cantidad solicitada debe ser mayor a cero.");
            }
        }

        // Verificar stock de todos los productos
        const productIds = normalisedItems.map(item => item.productId);
        const { data: products, error: productsError } = await supabase
            .from("Product")
            .select("id, stock, name")
            .in("id", productIds);

        if (productsError) throw productsError;

        // Crear mapa de productos para acceso rápido
        const productMap = new Map(products.map(p => [p.id, p]));

        // Verificar stock suficiente
        for (const item of normalisedItems) {
            const product = productMap.get(item.productId);
            if (!product) {
                throw new Error(`Producto con ID ${item.productId} no encontrado.`);
            }
            if (product.stock < item.quantity) {
                throw new Error(
                    `Stock insuficiente para ${product.name}. Disponible: ${product.stock}, Solicitado: ${item.quantity}`
                );
            }
        }

        // Calcular totales
        const subTotal = normalisedItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
        const taxRate = Number(saleData.tax ?? 21);
        const taxAmount = subTotal * (taxRate / 100);
        const total = subTotal + taxAmount;

        // Crear la venta
        const { data: sale, error: saleError } = await supabase
            .from("sale")
            .insert([{ 
                name_cliente: saleData.name_cliente || "",
                number_client: saleData.number_client || "",
                email_client: saleData.email_client || "",
                matricula_car: saleData.matricula_car || "",
                sub_total_amount: subTotal,
                tax: taxRate,
                tax_amount: taxAmount,
                total_amount: total,
                payment_method: saleData.payment_method || "",
                notes: saleData.notes || ""
            }])
            .select()
            .single();

        if (saleError) {
            console.error('[createSaleWithItems] Error al crear venta:', saleError);
            throw saleError;
        }

        // CORREGIDO: Usar los nombres de columna correctos
        const saleItems = normalisedItems.map(item => ({
            sale_id: sale.id,
            product_id: item.productId,
            count: item.quantity,              // ✅ count en lugar de quantity
            price: item.unitPrice,             // ✅ price en lugar de unit_price
            total_price: item.unitPrice * item.quantity  // ✅ total_price en lugar de subtotal
        }));

        const { data: insertedItems, error: itemsError } = await supabase
            .from("list_sale")
            .insert(saleItems)
            .select();

        if (itemsError) {
            console.error('[createSaleWithItems] Error al crear items:', itemsError);
            // Intentar rollback manual de la venta
            await supabase.from("sale").delete().eq("id", sale.id);
            throw itemsError;
        }

        // Actualizar stock de productos
        for (const item of normalisedItems) {
            const { data: currentProduct, error: currentProductError } = await supabase
                .from("Product")
                .select("stock")
                .eq("id", item.productId)
                .single();

            if (currentProductError) throw currentProductError;

            const newStock = Number(currentProduct?.stock ?? 0) - item.quantity;

            const { error: updateError } = await supabase
                .from("Product")
                .update({ stock: newStock })
                .eq("id", item.productId);

            if (updateError) {
                console.error(`[createSaleWithItems] Error al actualizar stock del producto ${item.productId}:`, updateError);
                throw updateError;
            }
        }

        // Registrar transacción en efectivo y actualizar caja registradora
        if (saleData.payment_method === "1") {
            const { data: cashRegister, error: cashRegisterError } = await supabase
                .from("cash_register")
                .select("id, current_balance")
                .single();

            if (cashRegisterError) {
                console.error('[createSaleWithItems] Error al obtener caja registradora:', cashRegisterError);
                throw cashRegisterError;
            }

            const newBalance = Number(cashRegister.current_balance) + total;

            const { error: cashTransactionError } = await supabase
                .from("cash_transactions")
                .insert({
                    type: "income",
                    amount: total,
                    balance_after: newBalance,
                    sale_id: sale.id,
                    description: `Venta ID ${sale.id}`
                });

            if (cashTransactionError) {
                console.error('[createSaleWithItems] Error al registrar transacción en efectivo:', cashTransactionError);
                throw cashTransactionError;
            }

            const { error: updateCashRegisterError } = await supabase
                .from("cash_register")
                .update({ current_balance: newBalance })
                .eq("id", cashRegister.id);

            if (updateCashRegisterError) {
                console.error('[createSaleWithItems] Error al actualizar caja registradora:', updateCashRegisterError);
                throw updateCashRegisterError;
            }
        }

        return {
            sale,
            items: insertedItems,
            totals: {
                subTotal,
                taxAmount,
                total
            }
        };

    } catch (error) {
        console.error('[createSaleWithItems] Error:', error);
        throw error;
    }
};

export const getCashRegister = async () => {
    try {
        const { data, error } = await supabase
            .from("cash_register")
            .select("*")
            .single();

        if (error) {
            console.error('[getCashRegister] Error al obtener la información de la caja registradora:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('[getCashRegister] Error:', error);
        throw error;
    }
};

export const getAllCashTransactions = async () => {
    try {
        const { data, error } = await supabase
            .from("cash_transactions")
            .select("*");

        if (error) {
            console.error('[getAllCashTransactions] Error al obtener las transacciones de efectivo:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('[getAllCashTransactions] Error:', error);
        throw error;
    }
};
export const createNegativeTransaction = async (amount, description) => {
    try {
        // Validar que el monto sea un número y positivo
        if (isNaN(amount) || amount <= 0) {
            throw new Error("El monto debe ser un número positivo.");
        }

        // Usar el monto positivo
        const positiveAmount = Math.abs(amount);

        // Obtener la información actual de la caja registradora
        const { data: cashRegister, error: cashRegisterError } = await supabase
            .from("cash_register")
            .select("id, current_balance")
            .single();

        if (cashRegisterError) {
            console.error('[createNegativeTransaction] Error al obtener la caja registradora:', cashRegisterError);
            throw cashRegisterError;
        }

        const newBalance = Number(cashRegister.current_balance) - positiveAmount; // RESTAR en lugar de sumar negativo

        if (newBalance < 0) {
            throw new Error("El saldo en la caja registradora no puede ser negativo.");
        }

        // Registrar la transacción en efectivo
        const { error: cashTransactionError } = await supabase
            .from("cash_transactions")
            .insert({
                type: "expense",
                amount: positiveAmount, // GUARDAR SIEMPRE POSITIVO
                balance_after: newBalance,
                description
            });

        if (cashTransactionError) {
            console.error('[createNegativeTransaction] Error al registrar la transacción en efectivo:', cashTransactionError);
            throw cashTransactionError;
        }

        // Actualizar el saldo de la caja registradora
        const { error: updateCashRegisterError } = await supabase
            .from("cash_register")
            .update({ current_balance: newBalance })
            .eq("id", cashRegister.id);

        if (updateCashRegisterError) {
            console.error('[createNegativeTransaction] Error al actualizar la caja registradora:', updateCashRegisterError);
            throw updateCashRegisterError;
        }

        return {
            message: "Transacción negativa registrada exitosamente.",
            newBalance
        };
    } catch (error) {
        console.error('[createNegativeTransaction] Error:', error);
        throw error;
    }
};