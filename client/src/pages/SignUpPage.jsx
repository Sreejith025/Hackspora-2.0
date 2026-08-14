import { SignUp, ClerkLoading, ClerkLoaded } from '@clerk/clerk-react';
import { useSearchParams } from 'react-router-dom';
import { SpaceBackground } from '../features/home';
import { clerkAppearance } from '../features/auth';

export default function SignUpPage() {
 const [searchParams] = useSearchParams();
 const redirectUrl = searchParams.get('redirect_url') || '/register';

 return (
 <div className="relative min-h-screen flex items-center justify-center pt-28 sm:pt-32 pb-12 px-3 sm:px-4 overflow-hidden">
 <SpaceBackground />
 <div className="relative z-10 w-full max-w-md flex flex-col items-center justify-center">
 <ClerkLoading>
 <div className="flex flex-col items-center justify-center p-8 space-y-4">
 <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
 <p className="text-sm text-cyan-400 font-medium">Loading Authentication...</p>
 </div>
 </ClerkLoading>
 <ClerkLoaded>
 <SignUp
 routing="path"
 path="/signup"
 signInUrl={`/login?redirect_url=${encodeURIComponent(redirectUrl)}`}
 fallbackRedirectUrl={redirectUrl}
 forceRedirectUrl={redirectUrl}
 appearance={clerkAppearance}
 />
 </ClerkLoaded>
 </div>
 </div>
 );
}
