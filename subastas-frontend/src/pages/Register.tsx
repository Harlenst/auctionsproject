import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';

interface RegisterProps {
  onLogin: () => void;
  onSuccess: () => void;
}

function Register({ onLogin, onSuccess }: RegisterProps) {
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Completa todos los campos.');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      setLoading(true);
      await register(name.trim(), email.trim(), password);
      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No fue posible crear la cuenta.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <span className="auth-logo">HS</span>
          <span>CASA DE SUBASTA</span>
        </div>

        <h1 className="auth-heading">Crea tu cuenta</h1>
        <p className="auth-description">
          Únete y descubre piezas extraordinarias.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="register-name">Nombre completo</label>
          <input
            id="register-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Tu nombre"
            autoComplete="name"
          />

          <label htmlFor="register-email">Correo electrónico</label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="correo@ejemplo.com"
            autoComplete="email"
          />

          <label htmlFor="register-password">Contraseña</label>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
          />

          <label htmlFor="register-confirm">Confirmar contraseña</label>
          <input
            id="register-confirm"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Repite tu contraseña"
            autoComplete="new-password"
          />

          {error && <p className="auth-error">{error}</p>}

          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tienes una cuenta?{' '}
          <button type="button" onClick={onLogin}>
            Inicia sesión
          </button>
        </p>

        <button className="auth-back" type="button" onClick={onLogin}>
          Volver
        </button>
      </section>
    </main>
  );
}

export default Register;