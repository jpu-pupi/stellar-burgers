import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrderByNumberApi } from '@api';
import { RootState } from '../store';

type OrderDetailsState = {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: OrderDetailsState = {
  order: null,
  isLoading: false,
  error: null
};

export const fetchOrderDetails = createAsyncThunk(
  'orderDetails/fetchOrderNumber',
  async (number: number) => getOrderByNumberApi(number)
);

const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState,
  reducers: {
    clearOrderDetails: (state) => {
      state.order = null;
      state.isLoading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload.orders[0];
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки';
      });
  }
});

export const selectOrderDetails = (state: RootState) =>
  state.orderDetails.order;

export const selectOrderDetailsLoading = (state: RootState) =>
  state.orderDetails.isLoading;

export const selectDetailsInfoError = (state: RootState) =>
  state.orderDetails.error;

export const { clearOrderDetails } = orderDetailsSlice.actions;

export const orderDetailsReducer = orderDetailsSlice.reducer;
