import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../../types/constants";

export interface WishlistItem {
  _id: string;
  title: string;
  image: string;
  price: number;
}

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

// ─────────────────────────────────────────────
// Fetch Wishlist
// ─────────────────────────────────────────────
export const fetchWishlist = createAsyncThunk<
  WishlistItem[],
  void,
  { rejectValue: string }
>(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        return rejectWithValue("User is not authenticated");
      }

      const response = await axios.get(
        `${API_BASE_URL}/api/wishlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.log(
        "Wishlist Error:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch wishlist"
      );
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",

  initialState,

  reducers: {
    // Set wishlist
    setWishlist: (
      state,
      action: PayloadAction<WishlistItem[]>
    ) => {
      state.items = action.payload;
    },

    // Add item
    addToWishlist: (
      state,
      action: PayloadAction<WishlistItem>
    ) => {
      const exists = state.items.find(
        item => item._id === action.payload._id
      );

      if (!exists) {
        state.items.push(action.payload);
      }
    },

    // Remove item
    removeFromWishlist: (
      state,
      action: PayloadAction<string>
    ) => {
      state.items = state.items.filter(
        item => item._id !== action.payload
      );
    },

    // Clear wishlist
    clearWishlist: state => {
      state.items = [];
    },
  },

  // ─────────────────────────────────────────────
  // Async reducers
  // ─────────────────────────────────────────────
  extraReducers: builder => {
    builder

      // Fetch started
      .addCase(fetchWishlist.pending, state => {
        state.loading = true;
        state.error = null;
      })

      // Fetch successful
      .addCase(
        fetchWishlist.fulfilled,
        (state, action) => {
          state.loading = false;
          state.items = action.payload;
        }
      )

      // Fetch failed
      .addCase(
        fetchWishlist.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload || "Failed to fetch wishlist";
        }
      );
  },
});

export const {
  setWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;