import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { queryClient } from '../service/query';
import axios, { AxiosError } from 'axios';
import { useGetMe, User } from '../hooks/useGetMe';

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

export const AuthContext = createContext({} as AuthContextData);

export let api = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    Authorization: `Bearer ${parseCookies()['dta.token']}`,
  },
});

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [loggedUser, setLoggedUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);
  const isAuthenticated = !!loggedUser;
  const navigate = useNavigate();

  const { data, refetch } = useGetMe()

  useEffect(() => {
    setLoggedUser(data)
  }, [data])

  useEffect(() => {
    const exec = async () => {
      const { 'dta.token': token } = parseCookies();

      if (token) {
        await refetch()
      } else {
        signOut();
      }
    }
    exec()
  }, []);

  const signOut = useCallback(async () => {
    await queryClient.invalidateQueries(['flows', 'buttons', 'user']);

    destroyCookie(undefined, 'dta.token');

    navigate('/');
  }, []);

  const signIn = useCallback(async ({ email, password }: SignIn) => {
    try {
      setIsLoading(true);

      const response = await api.post('auth', { email, password });

      const { user, token } = response.data;

      setCookie(undefined, 'dta.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });

      setLoggedUser(user);

      api = axios.create({
        baseURL: 'http://localhost:3333',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate('/home');

    } catch (error: any) {
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
    [isAuthenticated, signIn, loggedUser, isLoading],
  );
  return (
    <AuthContext.Provider value={authContextData}>
      {children}
    </AuthContext.Provider>
  );
}
