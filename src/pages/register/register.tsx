import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';

import { RegisterUI } from '@ui-pages';
import { registerUser } from '../../services/slices/user-slice';

export const Register: FC = () => {
  // Состояния полей формы
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Обработчик отправки формы
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    // Отправляем данные для регистрации
    dispatch(registerUser({ name: userName, email, password }));

    // После успешной регистрации перенаправляем на страницу входа
    navigate('/login');
  };

  return (
    <RegisterUI
      errorText='' // Здесь можно передать текст ошибки из стора
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
