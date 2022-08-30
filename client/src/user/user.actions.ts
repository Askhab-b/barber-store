// register
import { createAsyncThunk } from '@reduxjs/toolkit';
import { errorCatch } from 'api/api.helpers';
import { toast } from 'react-toastify';

import { AuthService } from '@/services/auth/auth.service';

import { toastError } from '@/utils/toast-error';

import { IAuthResponse, IEmailPassword } from './user.interface';

export const register = createAsyncThunk<IAuthResponse, IEmailPassword>(
  'auth/register',
  async ({ email, password }, thunkApi) => {
    try {
      const response = await AuthService.register(email, password);
      toast.success('Successful registration');
      return response.data;
    } catch (error) {
      toastError(error);
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const login = createAsyncThunk<IAuthResponse, IEmailPassword>(
  'auth/login',
  async ({ email, password }, thunkApi) => {
    try {
      const response = await AuthService.login(email, password);
      toast.success('Successful authentication');
      return response.data;
    } catch (error) {
      toastError(error);
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  AuthService.logout();
});

export const checkAuth = createAsyncThunk<IAuthResponse>('auth/check-auth', async (_, thunkApi) => {
  try {
    const response = await AuthService.getNewToken();
    return response.data;
  } catch (error) {
    if (errorCatch(error) === 'jwt expired') {
      toast.error('Your auth expired, plz login again');
      thunkApi.dispatch(logout());
    }
    return thunkApi.rejectWithValue(error);
  }
});
