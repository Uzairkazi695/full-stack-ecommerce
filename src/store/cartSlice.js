import { createSlice } from "@reduxjs/toolkit";
import service from "@/appwrite/config"; // Adjust the path accordingly
import useLocalStorage from "@/hooks/useLocalStorage";

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
      console.log("setCart", state.cart);

      useLocalStorage(state.cart);
    },
    addToCart: (state, action) => {
      const cartItem = {
        ...action.payload,
        qty: 1,
      };
      state.cart.push(cartItem);
      useLocalStorage(state.cart);
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(
        (item) => item.productId !== action.payload
      );
      useLocalStorage(state.cart);
    },
    incrementQty: (state, action) => {
      const productId = action.payload;
      console.log(productId);
      
      const cartItem = state.cart.find((item) => item.productId === productId);
      console.log(cartItem);
      
      if (cartItem) {
        cartItem.quantity = cartItem.quantity || 0;
        cartItem.quantity += 1;
        useLocalStorage(state.cart);
        console.log("incrementing");

        const updateCartQty = async () => {
          await service.updateCartItem(
            cartItem.userId,
            cartItem.$id,
            cartItem.quantity
          );
        };
        updateCartQty();
      }
      useLocalStorage(state.cart);
    },
    decrementQty: (state, action) => {
      const productId = action.payload;
      const cartItem = state.cart.find((item) => item.productId === productId);
      if (cartItem && cartItem.quantity > 1) {
        cartItem.quantity -= 1;
        useLocalStorage(state.cart);

        const updateCartQty = async () => {
          await service.updateCartItem(
            cartItem.userId,
            cartItem.$id,
            cartItem.quantity
          );
        };
        updateCartQty();
      } else if (cartItem && cartItem.quantity === 1) {
        state.cart = state.cart.filter((item) => item.productId !== productId);
        useLocalStorage(state.cart);

        const deleteCartItem = async () => {
          await service.deleteCartItem(cartItem.$id);
        };
        deleteCartItem();
      }
      useLocalStorage(state.cart);
    },
    setTotalQty: (state) => {
      state.totalQty = state.cart.reduce((total, item) => {
        return total + item.quantity; // Ensure qty is used properly here
      }, 0);
    },
    setTotal: (state) => {
      state.totalAmount = state.cart.reduce(
        (total, item) => total + item.price * item.qty,
        0
      );
    },
  },
});

export const {
  setCart,
  addToCart,
  removeFromCart,
  setTotalQty,
  setTotal,
  incrementQty,
  decrementQty,
} = cartSlice.actions;

export default cartSlice.reducer;
