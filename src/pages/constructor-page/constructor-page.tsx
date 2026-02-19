import { FC } from 'react';
import { useSelector } from '../../services/store';

import styles from './constructor-page.module.css';

import { BurgerIngredients, BurgerConstructor } from '@components';
import { Preloader } from '../../components/ui';

export const ConstructorPage: FC = () => {
  // Получаем состояние загрузки ингредиентов
  const { isIngredientsLoading } = useSelector((state) => state.ingredients);

  // Показываем прелоадер во время загрузки
  if (isIngredientsLoading) {
    return <Preloader />;
  }

  return (
    <main className={styles.containerMain}>
      <h1
        className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
      >
        Соберите бургер
      </h1>

      <div className={`${styles.main} pl-5 pr-5`}>
        {/* Левая часть - список ингредиентов */}
        <BurgerIngredients />

        {/* Правая часть - конструктор бургера */}
        <BurgerConstructor />
      </div>
    </main>
  );
};
