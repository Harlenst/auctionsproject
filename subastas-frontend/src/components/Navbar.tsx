
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onLogin: () => void;
  onRegister: () => void;
}

function Navbar({ onLogin, onRegister }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  function handleLogout() {
    logout();
    setMenuOpen(false);
  }

  return (
    <>
      <div className="top-bar">
        <div className="container top-content">
          <span>◉ Subastas en vivo · Nuevos lotes cada semana</span>
          <span>Atención personalizada · Colombia</span>
        </div>
      </div>

      <header className="navbar-hs">
        <div className="container nav-content">
          <a href="#inicio" className="brand-hs">
            <span className="brand-logo">HS</span>
            <span>
              Casa de Subasta
              <strong>HS</strong>
            </span>
          </a>

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            {menuOpen ? '×' : '☰'}
          </button>

          <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
            <a href="#subastas" onClick={() => setMenuOpen(false)}>Subastas</a>
            <a href="#categorias" onClick={() => setMenuOpen(false)}>Categorías</a>
            <a href="#como-pujar" onClick={() => setMenuOpen(false)}>Cómo pujar</a>
            <a href="#vender" onClick={() => setMenuOpen(false)}>Vender con nosotros</a>
            <a href="#contacto" onClick={() => setMenuOpen(false)}>Contacto</a>
          </nav>

          <div className="nav-buttons">
            {isAuthenticated ? (
              <>
                <span className="user-welcome">
                  Hola, {user?.name}
                </span>
                <button
                  type="button"
                  className="btn-hs btn-outline"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn-hs btn-outline"
                  onClick={onLogin}
                >
                  Ingresar
                </button>
                <button
                  type="button"
                  className="btn-hs btn-gold"
                  onClick={onRegister}
                >
                  Registrarme
                </button>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
