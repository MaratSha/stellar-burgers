import React, { FC } from 'react';

import { OrderStatusUI } from '@ui';
import { OrderStatusProps } from './type';

// Отображение статуса заказа на русском языке
const statusText: { [key: string]: string } = {
  pending: 'Готовится',
  done: 'Выполнен',
  created: 'Создан'
};

// Цвета для разных статусов
const statusColors: { [key: string]: string } = {
  pending: '#E52B1A', // красный
  done: '#00CCCC', // бирюзовый
  created: '#F2F2F3' // серый
};

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  // Получаем цвет для текущего статуса или цвет по умолчанию
  const textStyle = statusColors[status] || statusColors.created;

  return <OrderStatusUI textStyle={textStyle} text={statusText[status]} />;
};
