import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch } from '../../services/store';

import { LoginUI } from '@ui-pages';
import { loginUser } from '../../services/slices/user-slice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  // Обработчик отправки формы
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы

    // Проверяем, что поля заполнены
    if (!email || !password) {
      return;
    }

    // Отправляем данные для авторизации
    dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText='' // Здесь можно передать текст ошибки из стора
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
