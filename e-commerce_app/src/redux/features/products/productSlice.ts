import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "./productTypes";

interface ProductState {
  products: Product[];
  loading: boolean;
}

const initialState: ProductState = {
  products: [],
  loading: false,
};

const productSlice = createSlice({
  name: "products",

  initialState,

  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) {
      state.products = action.payload;
    },

    addProduct(state, action: PayloadAction<Product>) {
      state.products.push(action.payload);
    },

    deleteProduct(state, action: PayloadAction<string>) {
      state.products = state.products.filter(
        product => product._id !== action.payload
      );
    },

    updateProduct(state, action: PayloadAction<Product>) {
      const index = state.products.findIndex(
        p => p._id === action.payload._id
      );

      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
  },
});

export const {
  setProducts,
  addProduct,
  deleteProduct,
  updateProduct,
} = productSlice.actions;

export default productSlice.reducer;