import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UserData {
  id: string | null;
  email: string | null;
  username: string | null;
  avatar?: string | null;
  bio?: string | null;
  phone: string | null;
}

export interface UserState {
  isAuthenticated: boolean;
  user: UserData | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  user: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserData>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    updateAvatar: (state, action: PayloadAction<string | null>) => {
      if (state.user) {
        state.user.avatar = action.payload;
      }
    },
    updateUser: (state, action: PayloadAction<Partial<UserData>>) => {
      if (state.user) {
        state.user.bio = action.payload.bio;
        state.user.username = action.payload.username||'';
        state.user.phone = action.payload.phone || ''
      }
    }
  },
});

export const { login, logout, updateAvatar, updateUser } = userSlice.actions;

export default userSlice.reducer;