import axios from 'axios';

import { getToken } from './auth';

export const api = axios.create({
  baseURL: 'http://10.173.27.34:8080/api',
});

api.interceptors.request.use(
  async (config) => {

    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);