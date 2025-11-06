import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../supabaseClient";



// Thunks para llamadas a Supabase
export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  const { data, error } = await supabase.from("products").select("*");
  if (error) throw error;
  return data;
});

export const addProduct = createAsyncThunk("products/add", async (newProduct) => {
  const { data, error } = await supabase.from("products").insert([newProduct]).select();
  if (error) throw error;
  return data[0];
});

export const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false,
    error: null,
    edit: false,
    productSlice: null,
    addProduct: null
  },
  reducers: {
    setTire: (state, action) => {
      state.items = action.payload;
    },
    setEdit: (state, action) =>{
      state.edit = action.payload
    },
    setProductSlice: (state, action) =>{
      state.productSlice = action.payload
    },
    setAddProduct: (state,action) => {
      state.addProduct = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export const { setTire , setEdit, setProductSlice, setAddProduct} = productSlice.actions;