
import { useState } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PublishAuction from './pages/PublishAuction';
import { useAuth } from './context/AuthContext';
import './App.css';

type View = 'home' | 'login' | 'register' | 'publish';

function App() {
  const [view, setView] = useState<View>('home');
  const [returnToPublish, setReturnToPublish] = useState(false);

  const { loading, isAuthenticated } = useAuth();

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
        onSuccess={() => {
          setView(returnToPublish ? 'publish' : 'home');
          setReturnToPublish(false);
        }}
      />
    );
  }

  if (view === 'register') {
    return (
      <Register
        onLogin={() => setView('login')}
        onSuccess={() => {
          setView(returnToPublish ? 'publish' : 'home');
          setReturnToPublish(false);
        }}
      />
    );
  }

  if (view === 'publish') {
    return (
      <PublishAuction
        onBack={() => setView('home')}
        onSuccess={() => setView('home')}
      />
    );
  }

  return (
    <Home
      onLogin={() => setView('login')}
      onRegister={() => setView('register')}
      onSell={() => {
        if (isAuthenticated) {
          setView('publish');
        } else {
          setReturnToPublish(true);
          setView('login');
        }
      }}
    />
  );
}

export default App;
