import { Provider } from "react-redux";
import { store } from "../src/redux/store";
import AppNavigator from "@/src/navigation/AppNavigator";
import { AuthProvider } from "@/src/context/AuthContext";
import { CartProvider } from "@/src/context/CartContext";
import { WishlistProvider } from "@/src/context/WishlistContext";

export default function Index() {
  return (
    // <Provider store={store}>
  <AuthProvider>
    <CartProvider>
      <WishlistProvider>
          
             <AppNavigator/>
     
      </WishlistProvider>
    </CartProvider>
  </AuthProvider>
    // </Provider>
  );
}