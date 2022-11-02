import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { useGetMe, User } from '@hooks/useGetMe';

type SignIn = {
  email: string;
  password: string;
};

interface AuthContextData {
  signIn: (data: SignIn) => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | undefined;
}

type AuthProviderProps = {
  children: ReactNode;
};

export let api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3333',
  headers: {
    Authorization: `Bearer ${parseCookies()['flow.token']}`,
  },
});

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [loggedUser, setLoggedUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);
  const isAuthenticated = !!loggedUser;
  const { push, asPath } = useRouter();

  const { data, refetch } = useGetMe();
  const queryClient = useQueryClient();

  useEffect(() => {
    setLoggedUser(data);
  }, [data]);

  useEffect(() => {
    const exec = async () => {
      const { 'flow.token': token } = parseCookies();

      if (token) {
        await refetch();
      } else {
        if (asPath !== '/Login') signOut();
      }
    };
    exec();
  }, []);

  const signOut = useCallback(async () => {
    destroyCookie(undefined, 'flow.token');

    await queryClient.invalidateQueries();
    queryClient.clear();

    await push('/Login');

    setLoggedUser(undefined);
  }, []);

  const signIn = useCallback(async ({ email, password }: SignIn) => {
    try {
      setIsLoading(true);

      const response = await api.post('auth', { email, password });

      const { user, token } = response.data;

      setCookie(undefined, 'flow.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });

      api = axios.create({
        baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3333',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTimeout(() => {
        setLoggedUser(user);
        push('/Home');
      }, 500);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          toast.error('Email ou senha incorretos');
        }
      } else {
        toast.error('Ocorreu um erro ao fazer login');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const authContextData: AuthContextData = useMemo(
    () => ({
      isAuthenticated,
      signIn,
      signOut,
      user: loggedUser,
      isLoading,
    }),
    [isAuthenticated, signIn, signOut, loggedUser, isLoading],
  );
  return (
    <AuthContext.Provider value={authContextData}>
      {children}
    </AuthContext.Provider>
  );
}
