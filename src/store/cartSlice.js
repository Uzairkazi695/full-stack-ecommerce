import { createSlice } from "@reduxjs/toolkit";
import service from "@/appwrite/config";

const loadCartFromLocalStorage = () => {
  try {
    const serializedCart = localStorage.getItem("cart");
    return serializedCart ? JSON.parse(serializedCart) : [];
  } catch (e) {
    console.warn("Failed to load cart from localStorage", e);
    return [];
  }
};

const initialState = {
  cart: loadCartFromLocalStorage(),
  totalAmount: 0,
  totalQty: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.cart = action.payload;

      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    addToCart: (state, action) => {
      const cartItem = {
        ...action.payload,
        quantity: 1,
      };
      state.cart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(
        (item) => item.productId !== action.payload
      );
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    incrementQty: (state, action) => {
      const productId = action.payload;

      const cartItem = state.cart.find((item) => item.productId === productId);

      if (cartItem) {
        cartItem.quantity += 1;
        localStorage.setItem("cart", JSON.stringify(state.cart));

        const updateCartQty = async () => {
          await service.updateCartItem(
            cartItem.userId,
            cartItem.$id,
            cartItem.quantity
          );
        };
        updateCartQty();
      }
    },
    decrementQty: (state, action) => {
      const productId = action.payload;
      const cartItem = state.cart.find((item) => item.productId === productId);
      if (cartItem && cartItem.quantity > 1) {
        cartItem.quantity -= 1;
        localStorage.setItem("cart", JSON.stringify(state.cart));

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
        localStorage.setItem("cart", JSON.stringify(state.cart));

        const deleteCartItem = async () => {
          await service.deleteCartItem(cartItem.$id);
        };
        deleteCartItem();
      }
    },
    setTotalQty: (state) => {
      state.totalQty = state.cart.reduce((total, item) => {
        return total + item.quantity;
      }, 0);
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    setTotal: (state) => {
      state.totalAmount = state.cart.reduce(
        (total, item) => total + parseInt(item.price) * parseInt(item.quantity),
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
