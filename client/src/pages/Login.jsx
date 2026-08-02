import { SignIn } from '@clerk/clerk-react';
import { SpaceBackground } from '../features/home';
import { clerkAppearance } from '../features/auth';

export default function Login() {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center py-12 px-4 overflow-hidden">
      <SpaceBackground />
      <div className="relative z-10 w-full max-w-md flex justify-center">
        <SignIn
          routing="path"
          path="/login"
          signUpUrl="/signup"
          fallbackRedirectUrl="/dashboard"
          appearance={clerkAppearance}
        />
      </div>
    </div>
  );
}
