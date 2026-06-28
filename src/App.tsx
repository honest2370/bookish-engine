import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import ProgressBar from './components/ProgressBar';

// Auth Pages
import WelcomePage from './pages/auth/WelcomePage';
import SignInPage from './pages/auth/SignInPage';
import SignUpPage from './pages/auth/SignUpPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Buyer Pages
import BuyerLayout from './pages/buyer/BuyerLayout';

// Simple Page Component for others
function SimplePage({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4">{title}</h1>
        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
          <p className="text-slate-400">This page is under development.</p>
        </div>
      </div>
    </div>
  );
}

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { initialize, loading } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.log('Service worker registration failed:', error);
      });
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ProgressBar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Shared Routes */}
        <Route path="/support" element={<SimplePage title="Support" />} />
        <Route path="/notifications" element={<SimplePage title="Notifications" />} />
        <Route path="/help" element={<SimplePage title="Help Center" />} />
        <Route path="/terms" element={<SimplePage title="Terms of Service" />} />
        <Route path="/privacy" element={<SimplePage title="Privacy Policy" />} />

        {/* Buyer Routes */}
        <Route
          path="/buyer/*"
          element={
            <ProtectedLayout>
              <BuyerLayout />
            </ProtectedLayout>
          }
        />

        {/* Seller Routes */}
        <Route
          path="/seller/*"
          element={
            <ProtectedLayout>
              <SimplePage title="Seller Dashboard" />
            </ProtectedLayout>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/adminentry/*"
          element={
            <ProtectedLayout>
              <SimplePage title="Admin Panel" />
            </ProtectedLayout>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
