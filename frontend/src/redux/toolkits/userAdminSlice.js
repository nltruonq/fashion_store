import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as userApi from "../../api/userApi";

export const getAllUser = createAsyncThunk(
  "users_admin/get_all_user",
  async (payload, thunkApi) => {
    const data = await userApi.getAllUser();
    return data;
  }
);

export const deleteSingleUser = createAsyncThunk(
  'users_admin/delete_single_user',
  async (payload, thunkApi) => {
    const data = await userApi.deleteSingleUser(payload);
    return data;
  }
)

export const deleteMutipleUser = createAsyncThunk(
  'users_admin/delete_mutiple_user',
  async (payload, thunkApi) => {
    const data = await userApi.deleteMutipleUser(payload);
    return data;
  }
)

export const getSingleUser = createAsyncThunk(
  'users_admin/get_single_user',
  async (payload, thunkApi) => {
    const data = await userApi.getSingleUser(payload)
    return data
  }
)

export const updateUserRole = createAsyncThunk(
  'users_admin/update_user_role',
  async (payload, thunkApi) => {
    const data = await userApi.updateUserRole(payload)
    return data
  }
)

const initialState = {
  data: [],
  loading: false,
  error: undefined,
  isAuthenticated: false,
};

const userAdminSlice = createSlice({
  name: "users_admin",
  initialState,
  reducers: {},
  extraReducers: (buidler) => {
    buidler
      .addMatcher(
        (action) => {
          return (
            action.type.startsWith("users_admin/") &&
            action.type.endsWith("/pending")
          );
        },
        (state, action) => {
          state.loading = true;
        }
      )
      .addMatcher(
        (action) => {
          return (
            action.type.startsWith("users_admin/") &&
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
            action.type.startsWith("users_admin/") &&
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

export default userAdminSlice.reducer