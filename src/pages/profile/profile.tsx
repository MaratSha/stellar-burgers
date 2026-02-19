import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';

import { ProfileUI } from '@ui-pages';
import { selectUser } from '@selectors';
import { updateUser } from '../../services/slices/user-slice';

export const Profile: FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  // Состояние формы профиля
  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  // Обновляем форму при изменении данных пользователя
  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  }, [user]);

  // Проверяем, были ли изменения в форме
  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  // Обработчик отправки формы
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (isFormChanged) {
      // Формируем данные для обновления
      const userData: { name: string; email: string; password?: string } = {
        name: formValue.name,
        email: formValue.email
      };

      // Добавляем пароль только если он был изменен
      if (formValue.password) {
        userData.password = formValue.password;
      }

      dispatch(updateUser(userData));
    }
  };

  // Обработчик отмены изменений
  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  // Обработчик изменения полей формы
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
