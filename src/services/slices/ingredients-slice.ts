import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';

import { TIngredient } from '../../utils/types';
import { RootState } from '../store';

// ===== Типы =====
type TIngredientsState = {
  ingredients: TIngredient[];
  isIngredientsLoading: boolean;
  error: string | null;
};

// ===== Начальное состояние =====
export const initialState: TIngredientsState = {
  ingredients: [],
  isIngredientsLoading: false,
  error: null
};

// ===== Асинхронные действия =====
export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const data = await getIngredientsApi();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message || 'Failed to load ingredients');
    }
    return rejectWithValue('Failed to load ingredients');
  }
});

// ===== Слайс =====
const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {}, // Нет синхронных редьюсеров
  extraReducers: (builder) => {
    builder
      // Загрузка началась
      .addCase(fetchIngredients.pending, (state) => {
        state.isIngredientsLoading = true;
        state.error = null;
      })
      // Загрузка успешно завершена
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isIngredientsLoading = false;
        state.ingredients = action.payload;
      })
      // Ошибка при загрузке
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isIngredientsLoading = false;
        const payload = action.payload;
        state.error =
          typeof payload === 'string' ? payload : 'Failed to load ingredients';
      });
  }
});

// ===== Селекторы =====
export const getIngredientState = (state: RootState): TIngredientsState =>
  state.ingredients;

// ===== Экспорт редьюсера =====
export default ingredientsSlice.reducer;
