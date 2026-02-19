import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  createSelector
} from '@reduxjs/toolkit';
import { nanoid } from '@reduxjs/toolkit';

import { TIngredient, TConstructorIngredient, TOrder } from '../../utils/types';
import { orderBurgerApi } from '../../utils/burger-api';
import { RootState } from '../../services/store';

// ===== Типы =====
type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

// ===== Начальное состояние =====
export const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
  error: null
};

// ===== Асинхронные действия =====
export const makeOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('constructor/makeOrder', async (ingredientsIds, { rejectWithValue }) => {
  try {
    const response = await orderBurgerApi(ingredientsIds);
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

// ===== Слайс =====
const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    // Добавление ингредиента с уникальным id
    addIngredient: {
      prepare: (item: TIngredient) => {
        const id = nanoid();
        return { payload: { id, ...item } };
      },
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload; // Булка заменяется
        } else {
          state.ingredients.push(action.payload); // Остальные ингредиенты добавляются
        }
      }
    },

    // Удаление ингредиента по id
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },

    // Перемещение ингредиента внутри списка
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const items = [...state.ingredients];
      const [movedItem] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, movedItem);
      state.ingredients = items;
    },

    // Очистка конструктора
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },

    // Закрытие модального окна заказа
    clearOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработка создания заказа
      .addCase(makeOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(makeOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        // Очищаем конструктор после успешного заказа
        state.bun = null;
        state.ingredients = [];
      })
      .addCase(makeOrder.rejected, (state, action) => {
        state.orderRequest = false;
        const payload = action.payload;
        state.error =
          typeof payload === 'string' ? payload : 'Failed to create order';
      });
  }
});

// ===== Селекторы =====
const selectConstructorState = (state: RootState) => state.burgerConstructor;

export const selectConstructorItems = createSelector(
  [selectConstructorState],
  (state) => ({
    bun: state.bun,
    ingredients: state.ingredients
  })
);

export const selectOrderRequest = (state: RootState) =>
  state.burgerConstructor.orderRequest;

export const selectOrderModalData = (state: RootState) =>
  state.burgerConstructor.orderModalData;

export const selectOrderError = (state: RootState) =>
  state.burgerConstructor.error;

// ===== Экспорты =====
export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  clearOrderModal
} = constructorSlice.actions;

export default constructorSlice.reducer;
