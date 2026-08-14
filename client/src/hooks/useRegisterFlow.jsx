import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registrationService } from '../services/registrationService';

export function useRegisterFlow() {
 const { user, isSignedIn, isLoaded } = useUser();
 const navigate = useNavigate();

 const [isChecking, setIsChecking] = useState(false);
 const [isRegistered, setIsRegistered] = useState(false);
 const [registeredData, setRegisteredData] = useState(null);
 const [isModalOpen, setIsModalOpen] = useState(false);

 const clerkId = user?.id || '';
 const userEmail = user?.primaryEmailAddress?.emailAddress || '';

 // Check registration status function
 const checkStatus = useCallback(async () => {
 if (!clerkId && !userEmail) return;

 try {
 const res = await registrationService.checkRegistrationStatus(clerkId, userEmail);
 if (res?.registered) {
 setIsRegistered(true);
 setRegisteredData(res.data || null);
 } else {
 setIsRegistered(false);
 setRegisteredData(null);
 }
 } catch (error) {
 console.error('Registration status check failed:', error);
 }
 }, [clerkId, userEmail]);

 useEffect(() => {
 let isMounted = true;

 if (isLoaded && isSignedIn && (clerkId || userEmail)) {
 registrationService
 .checkRegistrationStatus(clerkId, userEmail)
 .then((res) => {
 if (!isMounted) return;
 if (res?.registered) {
 setIsRegistered(true);
 setRegisteredData(res.data || null);
 } else {
 setIsRegistered(false);
 setRegisteredData(null);
 }
 })
 .catch((error) => {
 console.error('Registration status check failed:', error);
 });
 }

 return () => {
 isMounted = false;
 };
 }, [isLoaded, isSignedIn, clerkId, userEmail]);

 // handleRegisterNow function for buttons
 const handleRegisterNow = async (e) => {
 if (e && e.preventDefault) e.preventDefault();
 console.log("handleRegisterNow invoked on touch/click event");

 if (!isLoaded) {
 console.log("Clerk is still loading...");
 return;
 }

 if (!isSignedIn) {
 console.log("User not signed in -> Redirecting to login with redirect_url=/register");
 toast('Please log in to proceed with hackathon registration.', { icon: '🔐' });
 navigate('/login?redirect_url=/register');
 return;
 }

 if (isRegistered) {
 console.log("User already registered -> Opening AlreadyRegisteredModal");
 setIsModalOpen(true);
 return;
 }

 console.log("Checking registration status from backend for:", clerkId, userEmail);
 setIsChecking(true);
 try {
 const res = await registrationService.checkRegistrationStatus(clerkId, userEmail);
 console.log("Registration Check Result:", res);

 if (res?.registered) {
 setIsRegistered(true);
 setRegisteredData(res.data || null);
 setIsModalOpen(true);
 } else {
 setIsRegistered(false);
 console.log("User not registered -> Navigating to /register");
 navigate('/register');
 }
 } catch (error) {
 console.error('Error during handleRegisterNow:', error);
 toast.error('Unable to verify registration status. Proceeding to registration.');
 navigate('/register');
 } finally {
 setIsChecking(false);
 }
 };

 const closeModal = () => setIsModalOpen(false);

 return {
 isLoaded,
 isSignedIn,
 isChecking,
 isRegistered,
 registeredData,
 isModalOpen,
 handleRegisterNow,
 closeModal,
 checkStatus,
 };
}
