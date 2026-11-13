
import { useState } from 'react';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PublishAuction from './pages/PublishAuction';
import CategoriesPage from './pages/CategoriesPage';

import { useAuth } from './context/AuthContext';
import './App.css';

type View =
  | 'home'
  | 'login'
  | 'register'
  | 'publish'
  | 'categories';

function App() {
  const [view, setView] = useState<View>('home');

  const [returnToPublish, setReturnToPublish] =
    useState(false);

  const [initialCategoryId, setInitialCategoryId] =
    useState<number | null>(null);

  const { loading, isAuthenticated } = useAuth();

  function handleOpenCategories(categoryId?: number) {
    setInitialCategoryId(categoryId ?? null);
    setView('categories');
  }

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

  if (view === 'categories') {
    return (
      <CategoriesPage
        onLogin={() => setView('login')}
        onRegister={() => setView('register')}
        onHome={() => setView('home')}
        initialCategoryId={initialCategoryId}
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
      onCategories={handleOpenCategories}
    />
  );
}

export default App;
