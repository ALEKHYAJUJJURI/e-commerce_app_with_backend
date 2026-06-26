import React from "react";
import { AuthProvider } from "../src/context/AuthContext";
import AppNavigator from "../src/navigation/AppNavigator";
import { CartProvider } from "@/src/context/CartContext";
import { WishlistProvider } from "@/src/context/WishlistContext";

export default function Index() {
  return (
    <AuthProvider>
      <CartProvider>
      <WishlistProvider>
          <AppNavigator />
      </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
