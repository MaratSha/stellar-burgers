import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';

import { OrderCardUI } from '../ui/order-card';
import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { selectIngredients } from '@selectors';

// Максимальное количество ингредиентов для отображения в карточке
const maxIngredients = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const ingredients: TIngredient[] = useSelector(selectIngredients);

  /**
   * Подготавливаем информацию о заказе для отображения:
   * - находим полные данные ингредиентов по их ID
   * - вычисляем общую стоимость
   * - определяем, какие ингредиенты показывать и сколько осталось
   * - форматируем дату
   */
  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;

    // Получаем полную информацию об ингредиентах заказа
    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], item: string) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) return [...acc, ingredient];
        return acc;
      },
      []
    );

    // Общая стоимость заказа
    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

    // Ингредиенты для отображения (первые maxIngredients)
    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

    // Количество скрытых ингредиентов
    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;

    // Форматирование даты
    const date = new Date(order.createdAt);

    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };
  }, [order, ingredients]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});
