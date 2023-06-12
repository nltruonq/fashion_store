import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as productApi from "../../api/productApi";

export const getProductRedux = createAsyncThunk(
    'products/get_products',
    async (payload, thunkApi) => {
        const data = productApi.getProduct(payload)
        return data
    }
)

export const getSingleProduct = createAsyncThunk(
  'products/get_single_product',
  async (payload, thunkApi) => {
      const data = productApi.getSingleProduct(payload)
      return data
  }
)


export const deleteSingleProduct = createAsyncThunk(
    'products/delete_single_product',
    async (payload, thunkApi) => {
      const data = productApi.deleteSingleProduct(payload)
      return data
    }
)


export const deleteMutipleProduct = createAsyncThunk(
  'products/delete_mutiple_product',
  async (payload, thunkApi) => {
    const data = productApi.deleteMutipleProduct(payload)
    return data
  }
)


export const getReviews = createAsyncThunk(
  'products/get_product_reviews',
  async (payload, thunkApi) => {
    const data = productApi.getReviews(payload)
    return data
  }
)


export const updateProduct = createAsyncThunk(
  'products/update_product',
  async (payload, thunkApi) => {
    const data = productApi.updateProduct(payload)
    return data
  }
)

export const createProduct = createAsyncThunk(
  'products/create_product',
  async (payload, thunkApi) => {
    const data = productApi.createProduct(payload)
    return data
  }
)

const initialState = {
  data: [],
  loading: false,
  error: undefined,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (buidler) => {
    buidler
      .addMatcher(
        (action) => {
          return (
            action.type.startsWith("products/") && action.type.endsWith("/pending")
          );
        },
        (state, action) => {
          state.loading = true;
        }
      )
      .addMatcher(
        (action) => {
          return (
            action.type.startsWith("products/") &&
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
            action.type.startsWith("products/") &&
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


export default productSlice.reducer