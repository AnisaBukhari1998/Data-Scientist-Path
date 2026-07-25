import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, LogIn, Mail, Loader2, KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';

export function LoginModal({ isOpen, onClose }) {
  const { loginWithGoogle, loginWithEmail, signupWithEmail, resetPassword } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      if (isForgotPassword) {
        if (!email) {
          setError('Please enter your email address.');
          setIsLoading(false);
          return;
        }
        await resetPassword(email);
        setMessage('Password reset email sent! Please check your inbox.');
      } else if (isSignUp) {
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }
        await signupWithEmail(email, password, displayName);
        onClose();
      } else {
        await loginWithEmail(email, password);
        onClose();
      }
    } catch (err) {
      const code = err.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
        setError('No account found with this email. Try signing up.');
      } else if (code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (code === 'auth/email-already-in-use') {
        setError('Email already registered. Try logging in instead.');
      } else if (code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'Something went wrong.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setMessage('');
    try {
      await loginWithGoogle();
      onClose();
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        setError('Google sign-in failed. Try email instead.');
      }
    }
  };

  const resetModalState = () => {
    setError('');
    setMessage('');
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface rounded-2xl shadow-2xl max-w-sm w-full p-6 relative border border-border-line animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-text-faint hover:text-text-main rounded-full hover:bg-bg-raise transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Forgot Password Header */}
        {isForgotPassword ? (
          <div className="text-center mb-6 mt-4">
            <div className="bg-phase-violet/15 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <KeyRound size={28} className="text-phase-violet" />
            </div>
            <h2 className="text-2xl font-bold font-display text-text-main">
              Reset Password
            </h2>
            <p className="text-text-dim mt-2 text-sm">
              Enter your email address and we'll send you a password reset link.
            </p>
          </div>
        ) : (
          <div className="text-center mb-6 mt-4">
            <div className="bg-phase-amber/15 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn size={28} className="text-phase-amber" />
            </div>
            <h2 className="text-2xl font-bold font-display text-text-main">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-text-dim mt-2 text-sm">
              {isSignUp
                ? 'Sign up to track progress & get free AI-powered study help.'
                : 'Sign in to continue your data science journey.'}
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-phase-brick/10 border border-phase-brick/20 rounded-xl text-xs text-phase-brick font-bold text-center">
            {error}
          </div>
        )}

        {/* Success Alert */}
        {message && (
          <div className="mb-4 p-3 bg-phase-teal/10 border border-phase-teal/20 rounded-xl text-xs text-phase-teal font-bold flex items-center justify-center gap-2 text-center">
            <CheckCircle2 size={16} />
            <span>{message}</span>
          </div>
        )}

        {/* Email/Password / Reset Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-3 mb-4">
          {isSignUp && !isForgotPassword && (
            <input
              type="text"
              placeholder="Your Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-bg-main border border-border-line rounded-xl px-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-phase-amber placeholder:text-text-faint"
            />
          )}

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-bg-main border border-border-line rounded-xl px-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-phase-amber placeholder:text-text-faint"
          />

          {!isForgotPassword && (
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-bg-main border border-border-line rounded-xl px-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-phase-amber placeholder:text-text-faint"
              />
              {!isSignUp && (
                <div className="text-right mt-1.5">
                  <button
                    type="button"
                    onClick={() => { setIsForgotPassword(true); resetModalState(); }}
                    className="text-xs text-phase-amber font-semibold hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-phase-amber hover:bg-phase-amber/90 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : isForgotPassword ? (
              <KeyRound size={18} />
            ) : (
              <Mail size={18} />
            )}
            {isForgotPassword ? 'Send Reset Link' : isSignUp ? 'Sign Up with Email' : 'Sign In with Email'}
          </button>
        </form>

        {/* Back to Sign In button on Forgot Password screen */}
        {isForgotPassword ? (
          <button
            type="button"
            onClick={() => { setIsForgotPassword(false); resetModalState(); }}
            className="w-full flex items-center justify-center gap-2 text-xs text-text-dim hover:text-text-main font-semibold py-2 cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Sign In
          </button>
        ) : (
          /* Toggle Sign Up / Sign In */
          <p className="text-center text-xs text-text-dim mb-4">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); resetModalState(); }}
              className="text-phase-amber font-bold hover:underline cursor-pointer"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        )}

        {!isForgotPassword && (
          <>
            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-border-line"></div>
              <span className="text-[10px] text-text-faint uppercase tracking-wider font-bold">or</span>
              <div className="flex-1 h-px bg-border-line"></div>
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-bg-raise border border-border-line hover:bg-surface-hover text-text-main font-semibold py-3 px-4 rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </>
        )}
      </div>
    </div>
  );
}
