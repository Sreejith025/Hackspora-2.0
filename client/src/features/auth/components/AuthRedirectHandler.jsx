import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { isAdminUser } from '../../../constants/authConfig';
import { HiSparkles } from 'react-icons/hi2';

export default function AuthRedirectHandler() {
 const { isLoaded, isSignedIn, user } = useUser();
 const navigate = useNavigate();

 useEffect(() => {
 if (isLoaded) {
 if (!isSignedIn) {
 navigate('/login', { replace: true });
 return;
 }

 const userEmail = user?.primaryEmailAddress?.emailAddress;
 if (isAdminUser(userEmail)) {
 navigate('/admin/dashboard', { replace: true });
 } else {
 navigate('/dashboard', { replace: true });
 }
 }
 }, [isLoaded, isSignedIn, user, navigate]);

 return (
 <div className="min-h-screen w-full bg-[#02040A] flex flex-col items-center justify-center space-y-4">
 <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 animate-spin">
 <HiSparkles className="w-8 h-8" />
 </div>
 <span className="text-xs text-cyan-300 font-bold tracking-widest uppercase">
 Redirecting to Workspace...
 </span>
 </div>
 );
}
