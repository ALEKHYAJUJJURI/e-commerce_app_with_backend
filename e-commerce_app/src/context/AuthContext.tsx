// import AsyncStorage from "@react-native-async-storage/async-storage";
// import React, { createContext, useContext, useEffect, useState } from "react";

// import { users } from "../data/users";
// import { User } from "../types/auth";
// import axios from "axios";

// interface AuthContextType {
//   user: User | null;
//   login: (email: string, password: string) => Promise<boolean>;
//   logout: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     restoreUser();
//   }, []);

//   const restoreUser = async () => {
//     const storedUser = await AsyncStorage.getItem("user");

//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   };
// // 
// const login = async (email: string, password: string) => {
//   try {
//     const response = await axios.post(
//       "http://10.132.180.129:5000/api/auth/login",
//       {
//         email,
//         password,
//       }
//     );

//     const { user, token } = response.data;

//     setUser(user);

//     await AsyncStorage.setItem(
//       "user",
//       JSON.stringify(user)
//     );

//     await AsyncStorage.setItem(
//       "token",
//       token
//     );

//     return true;
//   } catch (error) {
//     return false;
//   }
// };

//   const logout = async () => {
//     await AsyncStorage.removeItem("user");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         login,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<boolean>;
  logout: () => Promise<void>;
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

  const login = async (
    email: string,
    password: string
  ) => {
    try {
      const response = await axios.post(
        "http://10.132.180.129:5000/api/auth/login",
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

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");

      setUser(null);
    } catch (error) {
      console.log("Logout Error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);