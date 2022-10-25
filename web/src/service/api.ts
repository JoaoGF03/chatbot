import axios, { AxiosInstance } from 'axios';
import { parseCookies } from 'nookies';

export function setupAPIClient(ctx = undefined): AxiosInstance {
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
      Authorization: `Bearer ${cookies['dta.token']}`,
    },
  });

  return api;
}
