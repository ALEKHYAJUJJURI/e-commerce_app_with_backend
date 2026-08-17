import {
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

export interface CartItem {
  _id: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (
      state,
      action: PayloadAction<CartItem[]>
    ) => {
      state.items = action.payload;
    },

    addToCart: (
      state,
      action: PayloadAction<CartItem>
    ) => {
      const existing = state.items.find(
        (item) => item._id === action.payload._id
      );

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1,
        });
      }
    },

    removeFromCart: (
      state,
      action: PayloadAction<string>
    ) => {
      state.items = state.items.filter(
        (item) => item._id !== action.payload
      );
    },

    increaseQty: (
      state,
      action: PayloadAction<string>
    ) => {
      const item = state.items.find(
        (i) => i._id === action.payload
      );

      if (item) item.quantity++;
    },

    decreaseQty: (
      state,
      action: PayloadAction<string>
    ) => {
      const item = state.items.find(
        (i) => i._id === action.payload
      );

      if (item && item.quantity > 1) {
        item.quantity--;
      }
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  setCart,
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;