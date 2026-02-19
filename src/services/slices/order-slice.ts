import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

// ===== Типы =====
type TCreateOrderState = {
  orderData: TOrder | null;
  orderNumber: number | null;
  loading: boolean;
  error: string | null;
};

type TFeedOrdersState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  currentOrder: TOrder | null;
};

type TOrderState = TCreateOrderState & TFeedOrdersState;

// ===== Начальное состояние =====
const initialState: TOrderState = {
  // Состояние создания заказа
  orderData: null,
  orderNumber: null,
  loading: false,
  error: null,

  // Состояние ленты заказов
  orders: [],
  total: 0,
  totalToday: 0,
  currentOrder: null
};

// ===== Асинхронные действия =====

// Создание нового заказа
export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('order/create', async (ingredients, { rejectWithValue }) => {
  try {
    const response = await orderBurgerApi(ingredients);
    if (!response.success) {
      return rejectWithValue('Failed to create order');
    }
    return response.order;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message || 'Network error');
    }
    return rejectWithValue('Network error');
  }
});

// Получение ленты заказов (все заказы)
export const getFeeds = createAsyncThunk(
  'feeds',
  async () => await getFeedsApi()
);

// Получение заказов текущего пользователя
export const getOrders = createAsyncThunk(
  'user/orders',
  async () => await getOrdersApi()
);

// Получение заказа по номеру
export const getOrderByNumber = createAsyncThunk(
  'user/orderbyNumber',
  async (number: number) => await getOrderByNumberApi(number)
);

// ===== Слайс =====
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // Очистка данных созданного заказа
    clearOrder: (state) => {
      state.orderData = null;
      state.orderNumber = null;
      state.error = null;
    },
    // Очистка текущего просматриваемого заказа
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // ===== Создание заказа =====
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderData = action.payload;
        state.orderNumber = action.payload.number;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        state.error =
          typeof payload === 'string' ? payload : 'Error creating order';
      })

      // ===== Получение ленты заказов =====
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })

      // ===== Получение заказов пользователя =====
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })

      // ===== Получение заказа по номеру =====
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        if (action.payload.orders.length > 0) {
          state.currentOrder = action.payload.orders[0];
        }
      });
  }
});

// ===== Экспорты =====
export const { clearOrder, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
