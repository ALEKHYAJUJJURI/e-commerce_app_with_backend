import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { useAuth } from "../context/AuthContext";
import AdminScreen from "../screens/AdminScreen";
import CartScreen from "../screens/CartScree";
import LoginScreen from "../screens/LoginScreen";
import ProductDetailsScreen from "../screens/ProductDetailsScreen";
import UserScreen from "../screens/UserScreen";
import ProductsScreen from "../screens/admin/ProductsScreen";
import ReviewsScreen from "../screens/admin/ReviewsScreen";
import UsersScreen from "../screens/admin/UsersScreen";
import RegisterScreen from "../screens/RegisterScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen
  name="Register"
  component={RegisterScreen}
/>
</>
      ) : user.role === "admin" ? (
        // 🔴 ADMIN FLOW
        <>
          <Stack.Screen name="Admin" component={AdminScreen} />
          <Stack.Screen name="Users" component={UsersScreen} />
          <Stack.Screen name="Products" component={ProductsScreen} />
          <Stack.Screen name="Reviews" component={ReviewsScreen} />
        </>
      ) : (
        // 🔵 USER FLOW
        <>
          <Stack.Screen name="User" component={UserScreen} />
          <Stack.Screen
            name="ProductDetails"
            component={ProductDetailsScreen}
          />
          <Stack.Screen name="Cart" component={CartScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
