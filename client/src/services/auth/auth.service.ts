import { axiosBase } from 'api/interceptors';
import Cookies from 'js-cookie';

import { getAuthUrl } from '@/config/api.config';

import { IAuthResponse } from '@/store/user/user.interface';

import { removeTokenStorage, saveToStorage } from './auth.helper';

export const AuthService = {
  async register(email: string, password: string) {
    const response = await axiosBase.post<IAuthResponse>(getAuthUrl('/register'), {
      email,
      password,
    });
    if (response.data.accessToken) saveToStorage(response.data);
    return response;
  },

  async login(email: string, password: string) {
    const response = await axiosBase.post<IAuthResponse>(getAuthUrl('/login'), {
      email,
      password,
    });
    if (response.data.accessToken) saveToStorage(response.data);
    return response;
  },

  logout() {
    removeTokenStorage();
    localStorage.removeItem('user');
  },

  async getNewToken() {
    const refreshToken = Cookies.get('refreshToken');
    const response = await axiosBase.post<IAuthResponse>(getAuthUrl('/login/access-token'), {
      refreshToken,
    });
    if (response.data.accessToken) saveToStorage(response.data);
    return response;
  },
};
