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

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  admin: boolean;
};

type SignIn = {
  email: string;
  password: string;
};

interface AuthContextData {
  signIn: (data: SignIn) => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
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
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);
  const { push, asPath } = useRouter();

  const queryClient = useQueryClient();

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();

    const token = parseCookies()['flow.token'];

    if (token)
      api
        .get<User>('/users/me', {
          cancelToken: cancelToken.token,
        })
        .then(({ data }) => {
          setUser(data);
          push('/Home');
        })
        .catch(err => {
          if (err.response?.status === 401) {
            toast.error('Sessão expirada, faça login novamente');
            signOut();
          }
        });

    return () => {
      cancelToken.cancel();
    };
  }, [asPath]);

  const signOut = useCallback(async () => {
    destroyCookie(undefined, 'flow.token');

    await queryClient.invalidateQueries();
    queryClient.clear();

    await push('/Login');

    setUser(undefined);
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

      setUser(user);

      await push('/Home');
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
      signIn,
      signOut,
      user,
      isLoading,
    }),
    [signIn, signOut, user, isLoading],
  );
  return (
    <AuthContext.Provider value={authContextData}>
      {children}
    </AuthContext.Provider>
  );
}
