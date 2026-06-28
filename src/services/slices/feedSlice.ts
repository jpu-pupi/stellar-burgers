import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

type FeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk('feed/fetchFeeds', getFeedsApi);

const selectFeed = (state: RootState) => state.feedReducer;

const feedSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;

        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })

      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки';
      });
  }
});

export const selectFeedIsLoading = (state: RootState) =>
  selectFeed(state).isLoading;

export const selectFeedError = (state: RootState) => selectFeed(state).error;

export const selectOrders = (state: RootState) => selectFeed(state).orders;

export const selectTotal = (state: RootState) => selectFeed(state).total;

export const selectTotalToday = (state: RootState) =>
  selectFeed(state).totalToday;

export const feedReducer = feedSlice.reducer;
