import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';

import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';

import { getOrders } from '../../services/slices/order-slice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  // Получаем список заказов пользователя из хранилища
  const orders: TOrder[] = useSelector((state) => state.order.orders);

  // Загружаем заказы при монтировании компонента
  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
