import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import * as orderApi from '../../api/orderApi'

export const getOrderUser = createAsyncThunk(
    'orders/get_order_user',
    async () => {
        const data = orderApi.getMyOrders()
        return data 
    }
)

export const getSingleOrder = createAsyncThunk(
  'orders/get_single_order',
  async (payload, thunkApi) => {
      const data = orderApi.getSingleOrder(payload)
      return data 
  }
)


export const createNewOrder = createAsyncThunk(
    'orders/create_new_order',
    async (payload, thunkApi) => {
        const data = orderApi.createNewOrder(payload)
        return data 
    }
)

export const getAllOrders = createAsyncThunk(
  'orders/get_all_orders',
  async (payload, thunkApi) => {
      const data = orderApi.getAllOrders()
      return data 
  }
)

export const deleteSingleOrder = createAsyncThunk(
  'orders/delete_orders',
  async (payload, thunkApi) => {
      const data = orderApi.deleteSingleOrder(payload)
      return data 
  }
)

export const deleteMutipleOrder = createAsyncThunk(
  'orders/delete_orders',
  async (payload, thunkApi) => {
      const data = orderApi.deleteMutipleOrder(payload)
      return data 
  }
)

export const updateOrder = createAsyncThunk(
  'orders/update_order',
  async (payload, thunkApi) => {
      const data = orderApi.updateOrder(payload)
      return data 
  }
)

const initialState = {
    data: [],
    loading: false,
    error: undefined
  };
  
  const orderSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {},
    extraReducers: (buidler) => {
      buidler
        .addMatcher(
          (action) => {
            return (
              action.type.startsWith("orders/") && action.type.endsWith("/pending")
            );
          },
          (state, action) => {
            state.loading = true;
          }
        )
        .addMatcher(
          (action) => {
            return (
              action.type.startsWith("orders/") &&
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
              action.type.startsWith("orders/") &&
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
  
  export default orderSlice.reducer;
  