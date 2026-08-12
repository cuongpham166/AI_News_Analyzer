import { publicApi, privateApi } from '@/api/config.ts';
import type Response from '@/shared/types/Response.ts';


export const getUsers = async () => {
  const { data } = await publicApi.get('/users');
  return data;
};

export const getUsersDetail = async () => {
  const { data } = await privateApi.get('/users');
  return data;
};

export const createUser = async () => {
  const { data } = await privateApi.post('/users');
  return data;
};

export const getUser = async (id:string) => {
  const { data } = await privateApi.post('/user');
  return data;
};