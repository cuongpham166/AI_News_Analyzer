import axios from 'axios';

const baseConfig = {
  //baseURL: import.meta.env.VITE_API_URL,
  baseURL:"https://localhost/api/",
  timeout: 10000,
};

export const publicApi = axios.create(baseConfig);

export const privateApi = axios.create(baseConfig);
