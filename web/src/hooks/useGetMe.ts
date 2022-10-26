import { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { api } from '../contexts/AuthContext';

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  admin: boolean;
};

export async function getMe() {
  const { data } = await api.get<User>('/users/me');

  return data
}

export function useGetMe() {
  return useQuery(
    ['user'],
    () => getMe()
  );
}
