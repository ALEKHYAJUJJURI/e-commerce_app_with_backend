


import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { API_BASE_URL } from "../types/constants";
import { signInWithGoogle } from "@/services/firebaseAuth";

import { firebaseAuth } from "../../config/firebase";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { signOut as firebaseSignOut } from "firebase/auth";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  googleId?: string | null;
  provider?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  googleLogin: () => Promise<boolean>;
  setUser: React.Dispatch<
    React.SetStateAction<User | null>
  >;
}

const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  // --------------------------------
  // RESTORE USER
  // --------------------------------

  useEffect(() => {
    restoreUser();
  }, []);

  const restoreUser = async () => {
    try {
      const storedUser =
        await AsyncStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log("Restore User Error:", error);
    } finally {
      setLoading(false);
    }
  };
  // --------------------------------
  // NORMAL LOGIN
  // --------------------------------
  const login = async (
    email: string,
    password: string
  ) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );

      const { token, user } = response.data;

      await AsyncStorage.setItem(
        "token",
        token
      );

      await AsyncStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      setUser(user);

      return true;
    } catch (error) {
      console.log("Login Error:", error);
      return false;
    }
  };
// --------------------------------
  // GOOGLE LOGIN
  // --------------------------------

  const googleLogin = async (): Promise<boolean> => {
    try {
      // 1. Sign in with Firebase Google
      const { idToken } =
        await signInWithGoogle();

      if (!idToken) {
        console.log(
          "Google Login Error: Firebase ID token missing"
        );

        return false;
      }

      console.log(
        "Firebase ID Token received"
      );

      // 2. Send Firebase token to YOUR backend
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/google`,
        {
          idToken,
        }
      );

      // 3. Get YOUR backend JWT + user
      const { token, user } =
        response.data;

      console.log(
        "Google Backend Response:",
        response.data
      );

      // 4. Store YOUR backend JWT
      await AsyncStorage.setItem(
        "token",
        token
      );

      // 5. Store user
      await AsyncStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      // 6. Update AuthContext
      setUser(user);

      console.log(
        "Google Login Successful:",
        user
      );

      return true;
    } catch (error: any) {
      console.log(
        "Google Login Error:",
        error?.response?.data ||
          error?.message ||
          error
      );

      return false;
    }
  };
const logout = async () => {
  try {
    // 1. Sign out from Firebase
    if (firebaseAuth.currentUser) {
      await firebaseSignOut(firebaseAuth);
      console.log("Firebase signed out");
    }

    // 2. Sign out from Google
    try {
      const isSignedIn = await GoogleSignin.hasPreviousSignIn();

      if (isSignedIn) {
        await GoogleSignin.signOut();
        console.log("Google signed out");
      }
    } catch (googleError) {
      console.log(
        "Google Sign-Out Error:",
        googleError
      );
    }

    // 3. Remove backend JWT
    await AsyncStorage.removeItem("token");

    // 4. Remove stored user
    await AsyncStorage.removeItem("user");

    // 5. Clear AuthContext
    setUser(null);

    console.log("Logged out successfully");
  } catch (error) {
    console.log(
      "Logout Error:",
      error
    );
  }
};

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        googleLogin,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);