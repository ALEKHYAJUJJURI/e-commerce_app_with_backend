// app/store.ts

import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./features/products/productSlice";
import cartReducer from "./features/cart/cartSlice";
import authReducer from "./features/auth/authSlice";
import wishlistReducer from "./features/wishlist/wishlistSlice";
import usersReducer from "./features/user/userSlice";
export const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    auth: authReducer,
      wishlist: wishlistReducer,
       users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;