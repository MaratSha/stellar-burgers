import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { rootReducer } from './root-reducer';

// Настройка Redux store
const store = configureStore({
  reducer: rootReducer,

  // Включаем Redux DevTools только в режиме разработки
  devTools: process.env.NODE_ENV !== 'production',

  // Настройка middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Отключаем проверку на сериализуемость
      // (нужно для работы с несериализуемыми данными)
      serializableCheck: false
    })
});

// Типизация для RootState и AppDispatch
export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

// Типизированные хуки для использования в компонентах
export const useDispatch = () => dispatchHook<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
