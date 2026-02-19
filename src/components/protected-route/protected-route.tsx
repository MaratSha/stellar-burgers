import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

import { RootState } from '../../services/store';

// Режимы доступа к маршрутам
export enum AccessMode {
  AuthenticatedOnly, // Только для авторизованных
  UnauthenticatedOnly // Только для неавторизованных
}

type ProtectedRouteProps = {
  children: React.ReactElement;
  accessMode?: AccessMode;
};

// Селектор для получения состояния пользователя
const selectUserState = (state: RootState) => ({
  user: state.user.user,
  isAuthChecked: state.user.isAuthChecked
});

export const ProtectedRoute = ({
  children,
  accessMode = AccessMode.AuthenticatedOnly
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { user, isAuthChecked } = useSelector(selectUserState);

  // Пока проверяется авторизация - показываем загрузку
  if (!isAuthChecked) {
    return <p>Загрузка...</p>;
  }

  const isAuthenticated = !!user;

  // Если маршрут только для авторизованных, а пользователь не авторизован
  if (accessMode === AccessMode.AuthenticatedOnly && !isAuthenticated) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  // Если маршрут только для неавторизованных, а пользователь авторизован
  if (accessMode === AccessMode.UnauthenticatedOnly && isAuthenticated) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate replace to={from} />;
  }

  // Доступ разрешен
  return children;
};
