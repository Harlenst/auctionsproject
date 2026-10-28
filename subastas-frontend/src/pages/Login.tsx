
import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
  onRegister: () => void;
  onSuccess: () => void;
}

function Login({ onRegister, onSuccess }: LoginProps) {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Completa todos los campos.');
      return;
    }

    try {
      setLoading(true);

      await login(email.trim(), password);

      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No fue posible iniciar sesión.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">HS</div>
          <h1>CASA DE SUBASTA</h1>
          <span>PIEZAS CON HISTORIA</span>
        </div>

        <div className="auth-heading">
          <span className="auth-eyebrow">BIENVENIDO DE NUEVO</span>
          <h2>Inicia sesión</h2>
          <p>
            Ingresa a tu cuenta y participa en nuestras subastas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="login-email">Correo electrónico</label>
          <input
            id="login-email"
            type="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />

          <label htmlFor="login-password">Contraseña</label>

          <div className="password-field">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? 'INGRESANDO...' : 'INICIAR SESIÓN'}
          </button>
        </form>

        <div className="auth-footer">
          <span>¿Todavía no tienes cuenta?</span>
          <button type="button" onClick={onRegister}>
            Crear cuenta
          </button>
        </div>

        <button
          type="button"
          className="auth-back"
          onClick={onSuccess}
        >
          ← Volver a las subastas
        </button>
      </section>
    </main>
  );
}

export default Login;
