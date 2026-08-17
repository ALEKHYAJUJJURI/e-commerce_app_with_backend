import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "@/src/types/constants";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async () => {
    const response = await axios.get(`${API_BASE_URL}/api/users`);
    return response.data;
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id: string) => {
    await axios.delete(`${API_BASE_URL}/api/users/${id}`);
    return id;
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},

  extraReducers: builder => {
    builder

      // Fetch
      .addCase(fetchUsers.pending, state => {
        state.loading = true;
      })

      .addCase(
        fetchUsers.fulfilled,
        (state, action: PayloadAction<User[]>) => {
          state.loading = false;
          state.users = action.payload;
        }
      )

      .addCase(fetchUsers.rejected, state => {
        state.loading = false;
      })

      // Delete
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(
          user => user._id !== action.payload
        );
      });
  },
});

export default userSlice.reducer;