import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';

import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

import {
  getOrderByNumber,
  clearCurrentOrder
} from '../../services/slices/order-slice';

type TIngredientsWithCount = {
  [key: string]: TIngredient & { count: number };
};

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  // Получаем данные из хранилища
  const orderData = useSelector((state) => state.order.currentOrder);
  const ingredients: TIngredient[] = useSelector(
    (state) => state.ingredients.ingredients
  );

  // Загружаем данные о заказе при монтировании
  useEffect(() => {
    if (number) {
      dispatch(getOrderByNumber(Number(number)));
    }

    // Очищаем данные при размонтировании
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [number, dispatch]);

  /**
   * Подготавливаем данные для отображения:
   * - группируем ингредиенты по ID с подсчетом количества
   * - вычисляем общую стоимость
   * - форматируем дату
   */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    // Группируем ингредиенты и считаем их количество
    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    // Общая стоимость заказа
    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
