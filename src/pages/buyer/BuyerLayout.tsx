import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Package, Bell, User, LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';

export default function BuyerLayout() {
  const navigate = useNavigate();
  const { signOut, profile } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Top Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <h1 className="text-white font-bold text-lg">SELLIZI</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/support')}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-slate-400 hover:text-white transition-colors">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Side Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setMenuOpen(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-slate-900 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6">
              <p className="text-white font-semibold">{profile?.full_name || 'User'}</p>
              <p className="text-slate-400 text-sm">{profile?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 text-red-400 hover:text-red-300 py-2 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 pb-20">
        <div className="max-w-2xl mx-auto w-full px-4 py-6">
          <h2 className="text-3xl font-bold text-white mb-4">My Dashboard</h2>
          <p className="text-slate-400 mb-8">Welcome! Here's your overview.</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
              <Package className="w-8 h-8 text-blue-400 mb-3" />
              <p className="text-2xl font-bold text-white mb-1">0</p>
              <p className="text-slate-400 text-sm">Purchases</p>
            </div>
            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
              <svg className="w-8 h-8 text-green-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-2xl font-bold text-white mb-1">$0</p>
              <p className="text-slate-400 text-sm">Spent</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/support"
              className="bg-slate-900 rounded-lg p-4 text-center border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className="text-2xl mb-2">💬</div>
              <p className="text-white font-medium text-sm">Support</p>
            </Link>
            <Link
              to="/help"
              className="bg-slate-900 rounded-lg p-4 text-center border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className="text-2xl mb-2">📚</div>
              <p className="text-white font-medium text-sm">Help</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 px-4 py-2 z-30">
        <div className="flex items-center justify-around max-w-2xl mx-auto">
          <Link
            to="/buyer"
            className="flex flex-col items-center gap-1 py-2 px-4 rounded-lg text-blue-400 transition-colors"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </Link>
          <Link
            to="/support"
            className="flex flex-col items-center gap-1 py-2 px-4 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <Package className="w-6 h-6" />
            <span className="text-xs">Products</span>
          </Link>
          <Link
            to="/notifications"
            className="flex flex-col items-center gap-1 py-2 px-4 rounded-lg text-slate-400 hover:text-white transition-colors relative"
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
            <span className="text-xs">Alerts</span>
          </Link>
          <button
            onClick={() => navigate('/support')}
            className="flex flex-col items-center gap-1 py-2 px-4 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
