import { useUser } from '@clerk/clerk-react';
import { Navigate, Outlet } from 'react-router-dom';
import { HiSparkles } from 'react-icons/hi2';

export default function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen w-full bg-[#02040A] flex flex-col items-center justify-center space-y-4">
        <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 animate-spin">
          <HiSparkles className="w-8 h-8" />
        </div>
        <span className="text-xs text-cyan-300 font-bold tracking-widest uppercase">
          Verifying Credentials...
        </span>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}
