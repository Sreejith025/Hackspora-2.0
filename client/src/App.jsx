import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';
import { CinematicLoader } from './components/common';

function App() {
  const [loading, setLoading] = useState(() => {
    return !sessionStorage.getItem('hackspora_intro_played');
  });

  const handleLoadingComplete = () => {
    sessionStorage.setItem('hackspora_intro_played', 'true');
    setLoading(false);
  };

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      {loading && <CinematicLoader onComplete={handleLoadingComplete} />}
      <AppRoutes />
    </>
  );
}

export default App;

