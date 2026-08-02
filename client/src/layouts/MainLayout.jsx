import { Outlet } from 'react-router-dom';
import { Navbar, Footer } from '../components/layout';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
