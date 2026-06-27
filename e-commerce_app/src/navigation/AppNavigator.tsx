import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Colors } from "../types/theme";

import AdminScreen from "../screens/AdminScreen";
import CartScreen from "../screens/CartScree";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ProductDetailsScreen from "../screens/ProductDetailsScreen";
import UserScreen from "../screens/UserScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ProductsScreen from "../screens/admin/ProductsScreen";
import ReviewsScreen from "../screens/admin/ReviewsScreen";
import UsersScreen from "../screens/admin/UsersScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import MyOrdersScreen from "../screens/MyOrdersScreen";
import OrderDetailsScreen from "../screens/Orderdetailsscreen";
import WishlistScreen from "../screens/WishlistScreen";
import TermsPrivacyScreen from "../screens/TermsPrivacyScreen";
import HelpSupportScreen from "../screens/HelpSupportScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const { cart } = useCart();
  const cartCount = cart.reduce(
    (n: number, i: any) => n + (i.quantity || 1),
    0,
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.surface }}
      edges={["bottom"]}
    >
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: Colors.accent,
          tabBarInactiveTintColor: Colors.inkLight,
          tabBarStyle: {
            height: 64,
            paddingTop: 8,
            paddingBottom: 10,
            backgroundColor: Colors.surface,
            borderTopWidth: 0,
            elevation: 16,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: -4 },
            shadowRadius: 12,
          },
          tabBarLabelStyle: { fontSize: 11, fontWeight: "700", marginTop: 2 },
          tabBarIcon: ({ color, focused }) => {
            let icon: any = "home-outline";
            if (route.name === "Home") icon = focused ? "home" : "home-outline";
            if (route.name === "Cart") icon = focused ? "bag" : "bag-outline";
            if (route.name === "Profile")
              icon = focused ? "person-circle" : "person-circle-outline";
            return <Ionicons name={icon} size={24} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={UserScreen} />
        <Tab.Screen
          name="Cart"
          component={CartScreen}
          options={{ tabBarBadge: cartCount > 0 ? cartCount : undefined }}
        />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const AppNavigator = () => {
  const { user } = useAuth();

  if (user?.role === "admin") {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Admin" component={AdminScreen} />
        <Stack.Screen name="Users" component={UsersScreen} />
        <Stack.Screen name="Products" component={ProductsScreen} />
        <Stack.Screen name="Reviews" component={ReviewsScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
      <Stack.Screen name="Wishlist" component={WishlistScreen} />
      <Stack.Screen
  name="HelpSupport"
  component={HelpSupportScreen}
/>

<Stack.Screen
  name="TermsPrivacy"
  component={TermsPrivacyScreen}
/>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ presentation: "modal" }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
