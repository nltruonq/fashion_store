import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


import * as userApi from "../../api/userApi";

const initialState = {
  data: [],
  loading: false,
  error: undefined,
  isAuthenticated: false,
};

export const login = createAsyncThunk(
  "users/login",
  async (payload, thunkApi) => {
    const data = await userApi.login(payload);
    return data;
  }
);

export const logout = createAsyncThunk(
  'users/logout',
  async (payload, thunkApi) => {
    const data = await userApi.logout()
    return data
  }
)

export const register = createAsyncThunk(
  "users/register",
  async (payload, thunkApi) => {
    const data = await userApi.register(payload);
    return data;
  }
);

export const resetPassword = createAsyncThunk(
  "users/reset_password",
  async (payload, thunkApi) => {
    const data = await userApi.resetPassword(payload);
    return data;
  }
);

export const forgotPassword = createAsyncThunk(
  "users/forgot_password",
  async (payload, thunkApi) => {
    const data = await userApi.forgotPassword(payload);
    return data;
  }
);

export const updatePassword = createAsyncThunk(
  "users/update_password",
  async (payload, thunkApi) => {
    const data = await userApi.updatePassword(payload);
    return data;
  }
);

export const getUser = createAsyncThunk(
  "users/getUser",
  async (payload, thunkApi) => {
    const data = await userApi.getUser();
    return data;
  }
);


export const updateUser = createAsyncThunk(
  'users/updateuser',
  async (payload, thunkApi) => {
    const data = await userApi.updateUser(payload);
    return data;
  }
)

export const deleteAddress = createAsyncThunk(
  'user/delete_address',
  async (payload, thunkApi) => {
    const data = await userApi.deleteAddress(payload);
    return data;
  }
)


export const updateAddress = createAsyncThunk(
  'user/update_address',
  async (payload, thunkApi) => {
    const data = await userApi.updateAddress(payload);
    return data;
  }
)



const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (buidler) => {
    buidler
      .addMatcher(
        (action) => {
          return (
            action.type.startsWith("users/") && action.type.endsWith("/pending")
          );
        },
        (state, action) => {
          state.loading = true;
        }
      )
      .addMatcher(
        (action) => {
          return (
            action.type.startsWith("users/") &&
            action.type.endsWith("/fulfilled")
          );
        },
        (state, action) => {
          state.loading = false;
          state.data = action.payload;
          state.isAuthenticated = true;
        }
      )
      .addMatcher(
        (action) => {
          return (
            action.type.startsWith("users/") &&
            action.type.endsWith("/rejected")
          );
        },
        (state, action) => {
          state.loading = false;
          state.error = action.error;
        }
      );
  },
});

export default userSlice.reducer;
