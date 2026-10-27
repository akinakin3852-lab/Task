import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ToastProvider } from '@/components/ui/Toast';
import { LandingPage } from '@/components/LandingPage';
import { Dashboard } from '@/components/Dashboard';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { session, loading } = useAuth();
  const [route, setRoute] = useState<'landing' | 'dashboard'>('landing');

  useEffect(() => {
    if (session && route === 'landing') {
      // auto-redirect to dashboard on first sign-in
      const hasSeenDash = sessionStorage.getItem('visited_dashboard');
      if (!hasSeenDash) {
        setRoute('dashboard');
        sessionStorage.setItem('visited_dashboard', '1');
      }
    }
  }, [session, route]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (route === 'dashboard' && session) {
    return <Dashboard onBackToLanding={() => setRoute('landing')} />;
  }

  if (route === 'dashboard' && !session) {
    // guard: bounce back to landing if not signed in
    setRoute('landing');
  }

  return <LandingPage onEnterApp={() => setRoute('dashboard')} />;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}
