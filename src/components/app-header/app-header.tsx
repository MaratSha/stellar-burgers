import { FC } from 'react';
import { useSelector } from '../../services/store';

import { AppHeaderUI } from '@ui';
import { selectUser } from '@selectors';

export const AppHeader: FC = () => {
  // Получаем данные пользователя из хранилища
  const user = useSelector(selectUser);
  const userName = user?.name || '';

  return <AppHeaderUI userName={userName} />;
};
