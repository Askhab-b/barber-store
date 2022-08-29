export const API_URL = `${process.env.NEXT_PUBLIC_APP_API_URL}/api`;

export const getAuthUrl = (s: string) => `/auth${s}`;
export const getMongo = (s: string) => `/connect${s}`;
