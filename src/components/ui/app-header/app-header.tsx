import React, { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';

import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';

import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();

  // Проверяет, активен ли маршрут
  const isActive = (path: string): boolean => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        {/* Левая часть меню */}
        <div className={styles.menu_part_left}>
          {/* Ссылка на конструктор */}
          <Link
            to='/'
            className={`${styles.link} ${
              location.pathname === '/' && styles.link_active
            }`}
          >
            <BurgerIcon type={isActive('/') ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </Link>

          {/* Ссылка на ленту заказов */}
          <Link
            to='/feed'
            className={`${styles.link} ${
              isActive('/feed') && styles.link_active
            }`}
          >
            <ListIcon type={isActive('/feed') ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </Link>
        </div>

        {/* Логотип по центру */}
        <div className={styles.logo}>
          <Link to='/'>
            <Logo className='' />
          </Link>
        </div>

        {/* Правая часть меню - профиль */}
        <div className={styles.link_position_last}>
          <Link
            to='/profile'
            className={`${styles.link} ${
              isActive('/profile') && styles.link_active
            }`}
          >
            <ProfileIcon
              type={isActive('/profile') ? 'primary' : 'secondary'}
            />
            <p className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </p>
          </Link>
        </div>
      </nav>
    </header>
  );
};
