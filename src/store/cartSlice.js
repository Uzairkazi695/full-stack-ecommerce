import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  totalAmount: 0,
  itemAmount: 0,
  totalQty: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const cartItem = {
        ...action.payload,
        qty: 1,
        id: nanoid(),
      };
      state.cart.push(cartItem);
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => {
        return item.id !== action.payload;
      });
    },
    clearCart: (state) => {
      state.cart = [];
      state.totalAmount = 0;
      state.itemAmount = 0;
      state.totalQty = 0;
    },
    incrementQty: (state, action) => {
      state.cart = state.cart.map((item) =>
        item.id === action.payload ? { ...item, qty: item.qty + 1 } : item
      );
    },
    decrementQty: (state, action) => {
      state.cart = state.cart
        .map((item) =>
          item.id === action.payload ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0);
    },
    setTotal: (state) => {
      state.totalAmount = state.cart.reduce(
        (total, item) => total + item.price * item.qty,
        0
      );
    },
    setItemAmount: (state, action) => {
      const { id } = action.payload;
      const item = state.cart.find((item) => item.id === id);
      if (item) {
        state.itemAmount = item.price * item.qty;
      }
    },
    setTotalQty: (state) => {
      console.log(state.totalQty);

      state.totalQty = state.cart.reduce((total, item) => total + item.qty, 0);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  incrementQty,
  decrementQty,
  setTotal,
  setItemAmount,
  setTotalQty,
} = cartSlice.actions;

export default cartSlice.reducer;
