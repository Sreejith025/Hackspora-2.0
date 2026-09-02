import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { AdminRoute, ProtectedRoute } from '../features/auth';
import {
  Home,
  About,
  Guidelines,
  ProblemStatements,
  Schedule,
  FAQ,
  Contact,
  Login,
  Register,
  SignUpPage,
  VirtualRound,
  Workspace,
  AdminDashboard,
  ParticipantDashboard,
  NotFound,
  TermsOfService,
  PrivacyPolicy,
} from '../pages';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="guidelines" element={<Guidelines />} />
          <Route path="problem-statements" element={<ProblemStatements />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="contact" element={<Contact />} />
          <Route path="terms" element={<TermsOfService />} />
          <Route path="privacy" element={<PrivacyPolicy />} />

          {/* Protected Participant Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<ParticipantDashboard />} />
            <Route path="virtual-round" element={<VirtualRound />} />
            <Route path="workspace" element={<Workspace />} />
            <Route path="register/*" element={<Register />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route path="admin" element={<AdminRoute />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="problem-statements" element={<ProblemStatements />} />
            <Route path="virtual-round" element={<VirtualRound />} />
          </Route>

          {/* Public Auth Routes */}
          <Route path="login/*" element={<Login />} />
          <Route path="signup/*" element={<SignUpPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
