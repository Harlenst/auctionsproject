
import { useState } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './context/AuthContext';
import './App.css';

type View = 'home' | 'login' | 'register';

function App() {
  const [view, setView] = useState<View>('home');
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-page">
        <p>Preparando Casa de Subasta HS...</p>
      </div>
    );
  }

  if (view === 'login') {
    return (
      <Login
        onRegister={() => setView('register')}
        onSuccess={() => setView('home')}
      />
    );
  }

  if (view === 'register') {
    return (
      <Register
        onLogin={() => setView('login')}
        onSuccess={() => setView('home')}
      />
    );
  }

  return (
    <Home
      onLogin={() => setView('login')}
      onRegister={() => setView('register')}
    />
  );
}

export default App;
