import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import service from "../appwrite/config"; // Adjust the path accordingly

// Asynchronous thunk for updating cart item quantity in the backend
export const updateCartItemQty = createAsyncThunk(
  "cart/updateCartItemQty",
  async ({ userId, productId, qty }, { rejectWithValue }) => {
    try {
      const response = await service.updateCartItem(userId, productId, qty);
      return { productId, qty }; // Return necessary data to be handled in the reducers
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  cart: [],
  totalAmount: 0,
  totalQty: 0,
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
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
        qty: 1, // Ensure qty is initialized as a number
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
        return total + item.qty;
      }, 0);
    },
    setTotal: (state) => {
      state.totalAmount = state.cart.reduce(
        (total, item) => total + item.price * item.qty,
        0
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateCartItemQty.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCartItemQty.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { productId, qty } = action.payload;
        const cartItem = state.cart.find(item => item.productId === productId);
        if (cartItem) {
          cartItem.qty = qty;
        }
      })
      .addCase(updateCartItemQty.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to update cart item';
      });
  },
});

export const { setCart, addToCart, removeFromCart, setTotalQty, setTotal } = cartSlice.actions;

export default cartSlice.reducer;
