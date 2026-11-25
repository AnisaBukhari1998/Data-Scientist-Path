import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, LogIn, Loader2 } from 'lucide-react';

// Sign-in window. The app uses Google sign-in only: no passwords to remember or reset.
export function LoginModal({ isOpen, onClose }) {
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        setError('Google sign-in did not work. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface rounded-2xl shadow-2xl max-w-sm w-full p-6 relative border border-border-line animate-scale-in">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-2 text-text-faint hover:text-text-main rounded-full hover:bg-bg-raise transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6 mt-4">
          <div className="bg-phase-amber/15 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn size={28} className="text-phase-amber" />
          </div>
          <h2 className="text-2xl font-bold font-display text-text-main">Sign in</h2>
          <p className="text-text-dim mt-2 text-sm">
            Save your progress on every device and use the AI study helper. New here? Signing in creates your account.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-phase-brick/10 border border-phase-brick/20 rounded-xl text-xs text-phase-brick font-bold text-center">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-bg-raise border border-border-line hover:bg-surface-hover text-text-main font-semibold py-3 px-4 rounded-xl transition-colors shadow-sm cursor-pointer disabled:opacity-60"
        >
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          )}
          Continue with Google
        </button>

        <p className="text-[11px] text-text-faint text-center mt-4">
          Your data is only used to run this app. You can delete your account at any time in Settings.
        </p>
      </div>
    </div>
  );
}
