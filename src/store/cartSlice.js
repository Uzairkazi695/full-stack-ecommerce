import { createSlice } from "@reduxjs/toolkit";
import service from "../appwrite/config";

const initialState = {
  cart: [],
  totalAmount: 0,
  totalQty: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.cart = action.payload;
    },
    addToCart: (state, action) => {
      const cartItem = {
        ...action.payload,
        qty: 1,
      };
      state.cart.push(cartItem);
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(
        (item) => item.productId !== action.payload
      );
    },
    setTotalQty: (state) => {
      state.totalQty = state.cart.reduce((total, item) => {
        return total + item.quantity;
      }, 0);
      console.log("Total Qty:", state.totalQty);
    },
    setTotal: (state) => {
      state.totalAmount = state.cart.reduce(
        (total, item) => total + item.price * item.qty,
        0
      );
    },
  },
});

export const { setCart, addToCart, removeFromCart, setTotalQty, setTotal } =
  cartSlice.actions;

export default cartSlice.reducer;
