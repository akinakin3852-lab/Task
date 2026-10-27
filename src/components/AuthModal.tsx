import { useState, type FormEvent } from 'react';
import { Loader2, Mail, Lock, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
};

export function AuthModal({ open, onClose, initialMode = 'signup' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        toast('success', 'Account created! Welcome to Organize.');
        onClose();
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        toast('success', 'Welcome back!');
        onClose();
      }
      setEmail('');
      setPassword('');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      setError(
        msg.includes('already registered')
          ? 'An account with this email already exists. Try signing in.'
          : msg.includes('Invalid login')
          ? 'Incorrect email or password.'
          : msg
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900">
          {mode === 'signup' ? 'Create your account' : 'Welcome back'}
        </h2>
        <p className="mt-1.5 text-sm text-slate-500">
          {mode === 'signup'
            ? 'Start organizing your team in minutes.'
            : 'Sign in to access your dashboard.'}
        </p>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label className="label" htmlFor="auth-email">Email</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="auth-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input pl-10"
              placeholder="you@company.com"
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="auth-password">Password</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="auth-password"
              type="password"
              required
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input pl-10"
              placeholder="At least 6 characters"
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <User className="h-4 w-4" />
          )}
          {mode === 'signup' ? 'Create account' : 'Sign in'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500">
        {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          onClick={() => {
            setMode(mode === 'signup' ? 'signin' : 'signup');
            setError(null);
          }}
          className="font-semibold text-slate-900 underline-offset-2 hover:underline"
        >
          {mode === 'signup' ? 'Sign in' : 'Sign up'}
        </button>
      </p>
    </Modal>
  );
}
