import { useQuery } from 'react-query';

import { api } from '@contexts/AuthContext';

import { Button } from './useGetButtons';

export type Flow = {
  id: string;
  name: string;
  message: string;
  buttons: Button[];
};

export async function getFlows() {
  const { data } = await api.get<Flow[]>('/flows');

  return data;
}

export function useGetFlows() {
  return useQuery(['flows'], () => getFlows());
}
