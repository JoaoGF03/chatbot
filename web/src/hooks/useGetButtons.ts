import { useQuery } from 'react-query';
import { api } from '../contexts/AuthContext';

export type Button = {
  id: string;
  name: string;
}

export async function getButtons() {
  const { data } = await api.get<Button[]>('/buttons');

  return data
}

export function useGetButtons() {
  return useQuery(
    ['buttons'],
    () => getButtons()
  );
}
