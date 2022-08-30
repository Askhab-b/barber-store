import { errorCatch } from 'api/api.helpers';
import { toast } from 'react-toastify';

export const toastError = (error: any, title?: string) => {
  const message = errorCatch(error);
  toast.error(String(message));
  throw message;
};
