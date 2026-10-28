
const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  ok: boolean;
  data: AuthUser & {
    token: string;
  };
}

export interface RegisterResponse {
  ok: boolean;
  data: AuthUser;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(
      result.message || 'Ocurrió un error en la autenticación'
    );
  }

  return result as T;
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  return handleResponse<LoginResponse>(response);
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email, password })
  });

  return handleResponse<RegisterResponse>(response);
}
