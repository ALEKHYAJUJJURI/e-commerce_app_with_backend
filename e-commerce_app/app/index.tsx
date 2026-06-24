import React from "react";
import { AuthProvider } from "../src/context/AuthContext";
import AppNavigator from "../src/navigation/AppNavigator";
import { CartProvider } from "@/src/context/CartContext";

export default function Index() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppNavigator />
      </CartProvider>
    </AuthProvider>
  );
}
