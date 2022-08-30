import axios from 'axios';
import Cookies from 'js-cookie';

import { removeTokenStorage } from '@/services/auth/auth.helper';
import { AuthService } from '@/services/auth/auth.service';

import { API_URL } from '@/config/api.config';

import { errorCatch, getContentType } from './api.helpers';

export const axiosBase = axios.create({
  baseURL: API_URL,
  headers: getContentType(),
});

export const instance = axios.create({
  baseURL: API_URL,
  headers: getContentType(),
});

instance.interceptors.request.use((config) => {
  const accessToken = Cookies.get('accessToken');
  if (config.headers && accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

instance.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originalRequest = error.config;
    if (
      (error.response.status === 401 ||
        errorCatch(error) === 'jwt expired' ||
        errorCatch(error) === 'jwt must be provided') &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest.config._isRetry = true;
      try {
        await AuthService.getNewToken();
        return instance.request(originalRequest);
      } catch (error) {
        if (errorCatch(error) === 'jwt expired') removeTokenStorage();
      }
    }
    throw error;
  }
);

export default instance;
