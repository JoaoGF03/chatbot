import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import { setupAPIClient } from '../service/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

type Account = {
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
  isAuthenticated: boolean;
  account: Account | undefined;
}

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [loggedAccount, setLoggedAccount] = useState<Account>();
  const [isLoading, setIsLoading] = useState(false);
  const isAuthenticated = !!loggedAccount;
  const navigate = useNavigate();
  const api = setupAPIClient();

  useEffect(() => {
    const { 'dta.token': token } = parseCookies();

    if (token) {
      api
        .get('/users/me')
        .then(response => {
          setLoggedAccount(response.data);
        })
        .catch(() => {
          signOut();
        });
    } else {
      signOut();
    }
  }, []);

  const signOut = useCallback(() => {
    destroyCookie(undefined, 'dta.token');

    navigate('/');
  }, []);

  const signIn = useCallback(async ({ email, password }: SignIn) => {
    try {
      setIsLoading(true);

      const response = await api.post('auth', { email, password });

      const { account, token } = response.data;

      setCookie(undefined, 'dta.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });

      setLoggedAccount(account);

      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      navigate('/dash');

    } catch (err: any) {
      if (err.response.data) {
        switch (err.response.data?.message) {
          case 'Invalid login credentials':
            toast.error(
              'Erro ao logar! Verifique suas credenciais e tente novamente',
            );
            break;

          default:
            toast.error(
              'Ocorreu um erro ao logar, tente novamente mais tarde',
            );
            console.log(err.response.data?.message);
            break;
        }
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
      account: loggedAccount,
      isLoading,
    }),
    [isAuthenticated, signIn, loggedAccount, isLoading],
  );
  return (
    <AuthContext.Provider value={authContextData}>
      {children}
    </AuthContext.Provider>
  );
}
