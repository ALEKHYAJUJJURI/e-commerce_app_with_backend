import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface WishlistItem {
  _id: string;
  title: string;
  image: string;
  price: number;
}

interface WishlistState {
  items: WishlistItem[];
}

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // Set wishlist
    setWishlist: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = action.payload;
    },

    // Add item
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const exists = state.items.find(
        item => item._id === action.payload._id
      );

      if (!exists) {
        state.items.push(action.payload);
      }
    },

    // Remove item
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        item => item._id !== action.payload
      );
    },

    // Clear wishlist
    clearWishlist: state => {
      state.items = [];
    },
  },
});

export const {
  setWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;