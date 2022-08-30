import { FC } from 'react';
import { FormState, UseFormRegister } from 'react-hook-form';

import { IAuthInput } from '@/components/screens/auth/auth.interface';

import { validEmail } from '@/shared/regex';

import { Field } from './Field';

interface IAuthFields<T> {
  register: UseFormRegister<any>;
  formState: FormState<T>;
  isPasswordRequired?: boolean;
}
export const AuthFields: FC<IAuthFields<IAuthInput>> = ({
  register,
  formState: { errors },
  isPasswordRequired = false,
}) => {
  return (
    <>
      <Field
        {...register('email', {
          required: 'Поле электронного адреса необходимо',
          pattern: {
            value: validEmail,
            message: 'Введите корректную электронную почту',
          },
        })}
        placeholder="Электронная почта"
        error={errors.email}
      />
      <Field
        {...register(
          'password',
          isPasswordRequired
            ? {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Минимальная длина пароля 6 символов',
                },
              }
            : {}
        )}
        placeholder="Пароль"
        type="password"
        error={errors.password}
      />
    </>
  );
};
