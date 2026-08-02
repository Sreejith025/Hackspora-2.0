import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { isAdminUser, ADMIN_EMAIL } from '../../../constants/authConfig';
import { HiShieldExclamation, HiSparkles } from 'react-icons/hi2';

export default function AdminRoute({ children }) {
  const { isLoaded, isSignedIn, user } = useUser();

  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const isAdmin = isAdminUser(userEmail);

  useEffect(() => {
    if (isLoaded && isSignedIn && !isAdmin) {
      toast.error('Access Denied: Administrator privileges required.', {
        id: 'admin-access-denied',
      });
    }
  }, [isLoaded, isSignedIn, isAdmin]);

  // Loading Spinner State
  if (!isLoaded) {
    return (
      <div className="min-h-screen w-full bg-[#02040A] flex flex-col items-center justify-center space-y-4">
        <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 animate-spin">
          <HiSparkles className="w-8 h-8" />
        </div>
        <span className="text-xs font-mono text-cyan-300 font-bold tracking-widest uppercase">
          Verifying Admin Access Credentials...
        </span>
      </div>
    );
  }

  // Not signed in -> redirect to login
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  // Signed in but NOT abisri024@gmail.com -> redirect to participant /dashboard
  if (!isAdmin) {
    console.warn(
      `Unauthorized access attempt to Admin route by ${userEmail}. Only ${ADMIN_EMAIL} is authorized.`
    );
    return (
      <div className="min-h-screen w-full bg-[#02040A] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
          <HiShieldExclamation className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-white">Access Denied</h2>
        <p className="text-xs text-slate-400 max-w-sm">
          Your account (<strong className="text-slate-200">{userEmail}</strong>) does not have administrator privileges.
        </p>
        <Navigate to="/" replace />
      </div>
    );
  }

  // Authorized Admin abisri024@gmail.com
  return children ? children : <Outlet />;
}
