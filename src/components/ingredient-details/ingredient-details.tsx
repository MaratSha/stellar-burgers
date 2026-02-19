import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';

import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { selectIngredients } from '@selectors';
import { TIngredient } from '@utils-types';

export const IngredientDetails: FC = () => {
  // Получаем список ингредиентов из хранилища
  const ingredients: TIngredient[] = useSelector(selectIngredients);

  // Получаем ID ингредиента из параметров маршрута
  const { id } = useParams<{ id: string }>();

  // Ищем ингредиент по ID
  const ingredientData =
    ingredients.find((ingredient) => ingredient._id === id) || null;

  // Показываем прелоадер, пока ингредиент не найден
  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
