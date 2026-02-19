import { forwardRef, useMemo } from 'react';
import { useSelector } from '../../services/store';

import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';

import { selectConstructorBun, selectConstructorIngredients } from '@selectors';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  // Получаем данные конструктора из хранилища
  const bun = useSelector(selectConstructorBun);
  const constructorIngredients = useSelector(selectConstructorIngredients);

  /**
   * Подсчет количества каждого ингредиента в конструкторе
   * Булочка считается как 2 (верх и низ)
   */
  const ingredientsCounters = useMemo(() => {
    const counters: { [key: string]: number } = {};

    // Считаем ингредиенты (не булки)
    constructorIngredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });

    // Добавляем булку (счетчик +2)
    if (bun) {
      counters[bun._id] = (counters[bun._id] || 0) + 2;
    }

    return counters;
  }, [constructorIngredients, bun]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
