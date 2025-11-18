import { getTireByDiameter, getTireByRef } from "../../data/products/Tire";
import { setAddProduct, setEdit, setProductSlice, setSale, setTire } from "./productSlice";


export const startGetTireByRef = (ref) => {

    return async (dispatch) => {
        const data = await getTireByRef(ref);
        dispatch(setTire(data));
        
    }
}

export const startGetTireByDiameter = (diameter) => {
    return async (dispatch) => {
        const data = await getTireByDiameter(diameter);
        dispatch(setTire(data));
    }
}

export const startSetEdit= (state)=>{
    return async (dispatch) => {
        dispatch(setEdit(state))
    }
}

export const startSetProductSlice= (product)=>{
    return async (dispatch) => {
        dispatch(setProductSlice(product))
    }
}

export const startSetAddProduct = (product)=>{
    return async (dispatch) => {
        dispatch(setAddProduct(product))
    }
}

export const startSetSale = (sale)=>{
    console.log('sale', sale)
    return async (dispatch) => {
        dispatch(setSale(sale))
    }
}

