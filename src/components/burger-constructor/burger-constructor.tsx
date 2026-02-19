import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';

import { BurgerConstructorUI } from '@ui';
import { getUserState } from '@selectors';

import {
  selectConstructorItems,
  selectOrderRequest,
  selectOrderModalData,
  makeOrder,
  clearOrderModal
} from '../../services/slices/constructor-slice';

import { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Селекторы состояния
  const { bun, ingredients } = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const isAuthenticated = useSelector(getUserState).isAuthenticated;

  // Мемоизированные значения
  const ingredientIds = useMemo(
    () => ingredients.map((item: TConstructorIngredient) => item._id),
    [ingredients]
  );

  const orderIngredientIds = useMemo(() => {
    if (!bun) return null;
    return [bun._id, ...ingredientIds, bun._id];
  }, [bun, ingredientIds]);

  const price = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (sum: number, item: TConstructorIngredient) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  // Обработчики событий
  const onOrderClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!orderIngredientIds || orderRequest) {
      return;
    }

    dispatch(makeOrder(orderIngredientIds));
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModal());
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
