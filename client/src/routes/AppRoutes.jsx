import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { AdminRoute } from '../features/auth';
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
 <Route index element={<Home />} />
 <Route path="about" element={<About />} />
 <Route path="guidelines" element={<Guidelines />} />
 <Route path="problem-statements" element={<ProblemStatements />} />
 <Route path="schedule" element={<Schedule />} />
 <Route path="faq" element={<FAQ />} />
 <Route path="contact" element={<Contact />} />
 <Route path="virtual-round" element={<VirtualRound />} />
 <Route path="workspace" element={<Workspace />} />
 <Route path="dashboard" element={<ParticipantDashboard />} />
 <Route path="terms" element={<TermsOfService />} />
 <Route path="privacy" element={<PrivacyPolicy />} />

 {/* Protected Admin Routes */}
 <Route path="admin" element={<AdminRoute />}>
 <Route index element={<AdminDashboard />} />
 <Route path="dashboard" element={<AdminDashboard />} />
 <Route path="problem-statements" element={<ProblemStatements />} />
 <Route path="virtual-round" element={<VirtualRound />} />
 </Route>

 <Route path="login/*" element={<Login />} />
 <Route path="signup/*" element={<SignUpPage />} />
 <Route path="register/*" element={<Register />} />
 <Route path="*" element={<NotFound />} />
 </Route>
 </Routes>
 </BrowserRouter>
 );
}
