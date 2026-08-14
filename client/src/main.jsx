import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import './index.css';
import App from './App.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';

const PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

function RootApp() {
  if (!PUBLISHABLE_KEY) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-slate-900 border border-amber-500/50 p-6 rounded-2xl shadow-2xl space-y-4">
          <h2 className="text-xl font-bold text-amber-400">Clerk Key Missing</h2>
          <p className="text-sm text-slate-300">
            <code className="bg-slate-800 px-2 py-1 rounded text-cyan-400">VITE_CLERK_PUBLISHABLE_KEY</code> is not available in environment variables.
          </p>
          <p className="text-xs text-slate-400">
            Please add <code className="bg-slate-800 px-1 py-0.5 rounded text-cyan-300">VITE_CLERK_PUBLISHABLE_KEY</code> in Vercel environment variables and trigger a <b>Redeploy</b>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <RootApp />
    </ErrorBoundary>
  </StrictMode>,
);
