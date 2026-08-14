import { SignUp } from '@clerk/clerk-react';
import { useSearchParams } from 'react-router-dom';
import { SpaceBackground } from '../features/home';
import { clerkAppearance } from '../features/auth';

export default function SignUpPage() {
 const [searchParams] = useSearchParams();
 const redirectUrl = searchParams.get('redirect_url') || '/register';

 return (
 <div className="relative min-h-screen flex items-center justify-center pt-28 sm:pt-32 pb-12 px-3 sm:px-4 overflow-hidden">
 <SpaceBackground />
 <div className="relative z-10 w-full max-w-md flex justify-center">
 <SignUp
 routing="path"
 path="/signup"
 signInUrl={`/login?redirect_url=${encodeURIComponent(redirectUrl)}`}
 fallbackRedirectUrl={redirectUrl}
 forceRedirectUrl={redirectUrl}
 appearance={clerkAppearance}
 />
 </div>
 </div>
 );
}
