import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';

import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';

import { getFeeds } from '../../services/slices/order-slice';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  // Получаем список заказов из хранилища
  const orders: TOrder[] = useSelector((state) => state.order.orders);

  // Загружаем ленту заказов при монтировании компонента
  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  // Показываем прелоадер, пока заказы не загрузились
  if (!orders.length) {
    return <Preloader />;
  }

  // Обработчик для обновления ленты
  const handleGetFeeds = () => {
    dispatch(getFeeds());
  };

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
