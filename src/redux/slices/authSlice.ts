import { IUser } from "@/models/IUser";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  user: IUser;
  isUserAuth: boolean;
}

const initialState: AuthState = {
  user: {} as IUser,
  isUserAuth: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      state.isUserAuth = true

      console.log('isUserAuth', state.isUserAuth)
    },
    logoutUser: (state) => {
      state.user = {} as IUser;
      state.isUserAuth = false;
    },
  },
});

export const {
  setUser, logoutUser
} = authSlice.actions;

export default authSlice.reducer;
