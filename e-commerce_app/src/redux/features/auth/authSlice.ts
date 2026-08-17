import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
    },

    setUser: (
      state,
      action: PayloadAction<User>
    ) => {
      state.user = action.payload;
    },
  },
});

export const { login, logout, setUser } =
  authSlice.actions;

export default authSlice.reducer;