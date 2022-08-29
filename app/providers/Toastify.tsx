import { FC } from 'react';
import { ToastContainer } from 'react-toastify';

export const Toastify: FC = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={4000}
      newestOnTop={false}
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
  );
};
