import { FC } from 'react';
import { useSelector } from '../../services/store';

import { FeedInfoUI } from '../ui/feed-info';
import { selectOrder } from '@selectors';
import { TOrder } from '@utils-types';

/**
 * Вспомогательная функция для получения номеров заказов по статусу
 * Возвращает первые 20 номеров заказов с указанным статусом
 */
const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  // Получаем данные о заказах из хранилища
  const orderState = useSelector(selectOrder);

  const orders: TOrder[] = orderState.orders;
  const feed = {
    total: orderState.total,
    totalToday: orderState.totalToday
  };

  // Фильтруем заказы по статусам
  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
