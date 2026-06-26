import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { API_BASE_URL } from "../types/constants";

export type WishlistItem = {
  _id: string; // wishlist document id
  product: {
    _id: string;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
  };
};

type WishlistContextType = {
  wishlist: WishlistItem[];
  wishlistIds: string[];
  loading: boolean;
  fetchWishlist: () => Promise<void>;
  toggleWishlist: (product: WishlistItem["product"]) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => void;
};

const WishlistContext =
  createContext<WishlistContextType | null>(null);

export const WishlistProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [wishlist, setWishlist] = useState<
    WishlistItem[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);

      const token =
        await AsyncStorage.getItem("token");

      if (!token) return;

      const res = await axios.get(
        `${API_BASE_URL}/api/wishlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWishlist(res.data);
    } catch (error) {
      console.log("Wishlist Error:", error);
    } finally {
      setLoading(false);
    }
  };

const toggleWishlist = async (product: WishlistItem["product"]) => {
  try {
    const token = await AsyncStorage.getItem("token");

    await axios.post(
      `${API_BASE_URL}/api/wishlist`,
      {
        productId: product._id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Refresh wishlist from server
    await fetchWishlist();
  } catch (error) {
    console.log(error);
  }
};

  const removeFromWishlist = async (
    productId: string
  ) => {
    try {
      const token =
        await AsyncStorage.getItem("token");

      await axios.delete(
        `${API_BASE_URL}/api/wishlist/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    setWishlist(prev =>
    prev.filter(item => item.product._id !== productId)
);
    } catch (error) {
      console.log(error);
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
       wishlistIds: wishlist.map(item => item.product._id),
        loading,
        fetchWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used within WishlistProvider"
    );
  }

  return context;
};