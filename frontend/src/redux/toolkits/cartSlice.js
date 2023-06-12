import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import * as cartApi from '../../api/cartApi'

export const getMyCarts = createAsyncThunk(
    'carts/get_my_carts',
    async () => {
        const data = cartApi.getMyCarts()
        return data
    }
)
export const addCartUser = createAsyncThunk(
  'carts/add_cart_user',
  async (payload, thunkApi) => {
      const data = cartApi.addCartUser(payload)
      return data
  }
)
export const deleteCartUser = createAsyncThunk(
    'carts/delete_cart_user',
    async (payload, thunkApi) => {
        const data = cartApi.deleteCartUser(payload)
        return data
    }
)


const initialState = {
    data: [],
    loading: false,
    error: undefined
  };

const cartSlice = createSlice({
    name: "carts",
    initialState,
    reducers: {},
    extraReducers: (buidler) => {
      buidler
        .addMatcher(
          (action) => {
            return (
              action.type.startsWith("carts/") && action.type.endsWith("/pending")
            );
          },
          (state, action) => {
            state.loading = true;
          }
        )
        .addMatcher(
          (action) => {
            return (
              action.type.startsWith("carts/") &&
              action.type.endsWith("/fulfilled")
            );
          },
          (state, action) => {
            state.loading = false;
            state.data = action.payload;
          }
        )
        .addMatcher(
          (action) => {
            return (
              action.type.startsWith("carts/") &&
              action.type.endsWith("/rejected")
            );
          },
          (state, action) => {
            state.data = []
            state.loading = false;
            state.error = action.error;
          }
        );
    },
  });
  
  export default cartSlice.reducer;