import { FC, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { AuthFields } from '@/ui/field-elements/AuthFields';
import { Button } from '@/ui/field-elements/Button';

import { useActions } from '@/hooks/useActions';
import { useAuth } from '@/hooks/useAuth';

import { Meta } from '@/utils/meta/Meta';

import styles from './Auth.module.scss';
import { IAuthInput } from './auth.interface';
import { useAuthRedirect } from './useAuthRedirect';

export const Auth: FC = () => {
  useAuthRedirect();
  const { isLoading } = useAuth();
  const [type, setType] = useState<'login' | 'register'>('login');

  const {
    register: registerInput,
    handleSubmit,
    formState,
    reset,
  } = useForm<IAuthInput>({ mode: 'onChange' });

  const { login, register } = useActions();

  const onSubmit: SubmitHandler<IAuthInput> = (data) => {
    if (type === 'login') login(data);
    else if (type === 'register') register(data);
    reset();
  };

  return (
    <Meta title="Auth">
      <section className={styles.wrapper}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <AuthFields register={registerInput} formState={formState} isPasswordRequired />
          <div className={styles.buttons}>
            <Button type="submit" disabled={isLoading} onClick={() => setType('login')}>
              Войти
            </Button>
            <Button type="submit" disabled={isLoading} onClick={() => setType('register')}>
              Зарегистрироваться
            </Button>
          </div>
        </form>
      </section>
    </Meta>
  );
};
