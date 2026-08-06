import { AuthUser } from "@/services/auth.client";
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    setUser(state, action) {
      state.user = action.payload;
    },

    clearUser(state) {
      state.user = null;
    },

    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    
  },
});

export const { setUser, clearUser, setLoading } = authSlice.actions;

export default authSlice.reducer;
