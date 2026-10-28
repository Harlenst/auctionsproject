
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from 'react';

import {
  login as loginService,
  register as registerService,
  type AuthUser
} from '../services/authService';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

interface StoredSession {
  user: AuthUser;
  token: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedSession = localStorage.getItem('hs_session');

      if (storedSession) {
        const session: StoredSession = JSON.parse(storedSession);

        if (session.user && session.token) {
          setUser(session.user);
          setToken(session.token);
        } else {
          localStorage.removeItem('hs_session');
        }
      }
    } catch {
      localStorage.removeItem('hs_session');
    } finally {
      setLoading(false);
    }
  }, []);

  async function login(email: string, password: string): Promise<void> {
    const response = await loginService(email, password);

    const session: StoredSession = {
      user: {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email
      },
      token: response.data.token
    };

    localStorage.setItem('hs_session', JSON.stringify(session));

    setUser(session.user);
    setToken(session.token);
  }

  async function register(
    name: string,
    email: string,
    password: string
  ): Promise<void> {
    await registerService(name, email, password);

    // El usuario inicia sesión después de registrarse.
    await login(email, password);
  }

  function logout(): void {
    localStorage.removeItem('hs_session');
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth debe utilizarse dentro de un AuthProvider'
    );
  }

  return context;
}
