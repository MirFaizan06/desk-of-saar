import { Suspense, useState } from 'react';
import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Code2, BarChart2, Mail,
  Settings, LogOut, Menu, X, ChevronRight,
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { useDialog } from '../../context/DialogContext';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/books', label: 'Books', icon: BookOpen },
  { to: '/admin/projects', label: 'Code Projects', icon: Code2 },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
  { to: '/admin/contacts', label: 'Messages', icon: Mail },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

function Sidebar({ open, onClose, location }) {
  const { user } = useAuth();
  const { showDialog } = useDialog();

  const handleLogout = () => {
    showDialog({
      type: 'confirm',
      title: 'Sign out?',
      message: 'You will be returned to the login screen.',
      confirmLabel: 'Sign Out',
      onConfirm: () => signOut(auth),
    });
  };

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-[#1a1a1a] text-white z-50 flex flex-col transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        {/* Logo */}
        <div className="px-6 py-7 border-b border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xl uppercase tracking-[3px] font-bold text-white">Saar</span>
            <p className="text-[0.65rem] text-white/40 uppercase tracking-[1.5px] mt-0.5">Admin Panel</p>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/50 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 text-[0.8rem] uppercase tracking-[1.5px] font-bold transition-all rounded ${
                  active
                    ? 'bg-[#d4a84b] text-white'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                {item.label}
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="px-4 py-4 border-t border-white/10">
          <p className="text-[0.7rem] text-white/30 uppercase tracking-wider px-2 mb-2 truncate">
            {user?.email}
          </p>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-[0.8rem] uppercase tracking-[1.5px] font-bold text-white/50 hover:text-red-400 hover:bg-white/5 transition-all rounded"
          >
            <LogOut size={16} />Sign Out
          </button>
          <Link
            to="/"
            className="block text-center text-[0.7rem] text-white/30 hover:text-white/60 mt-2 tracking-wider uppercase py-1"
          >
            ← View Website
          </Link>
        </div>
      </aside>
    </>
  );
}

function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#d4a84b] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[#888] text-sm uppercase tracking-wider">Loading…</p>
        </div>
      </div>
    );
  }

  // Not logged in — go to login
  if (!user && location.pathname !== '/admin/login') {
    return <Navigate to="/admin/login" replace />;
  }

  // Logged in but not an admin
  if (user && !isAdmin && location.pathname !== '/admin/login') {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="bg-white p-10 text-center max-w-sm">
          <p className="font-serif text-xl text-[#1a1a1a] mb-3">Access Denied</p>
          <p className="text-[#888] text-sm mb-6">Your account is not authorised as an admin.</p>
          <button onClick={() => signOut(auth)} className="px-6 py-2 bg-[#1a1a1a] text-white text-sm uppercase tracking-wider font-bold">
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // Login page — render without sidebar
  if (location.pathname === '/admin/login') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#f5f5f5]" />}>
        <Outlet />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] lg:pl-64">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} location={location} />

      {/* Mobile header */}
      <header className="lg:hidden bg-white border-b border-[#eee] px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
        <button onClick={() => setSidebarOpen(true)} className="text-[#1a1a1a]">
          <Menu size={22} />
        </button>
        <span className="text-sm uppercase tracking-[2px] font-bold text-[#1a1a1a]">Admin Panel</span>
      </header>

      <main className="p-6 md:p-8">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-32">
              <div className="w-8 h-8 border-2 border-[#d4a84b] border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}

export default AdminLayout;
