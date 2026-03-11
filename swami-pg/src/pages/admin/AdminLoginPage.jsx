import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { LoadingSpinner } from '../../components/common';
import { useAuth } from '../../context/AuthContext';

// SVG Icons
const EmailIcon = () => (
  <svg className="w-5 h-5 text-[#4a4a4a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PasswordIcon = () => (
  <svg className="w-5 h-5 text-[#4a4a4a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      const result = await signInWithGoogle();
      const user = result.user;

      // Verify user is admin
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      if (!adminDoc.exists()) {
        await auth.signOut();
        setError('Access denied. This Google account is not registered as an admin.');
        setGoogleLoading(false);
        return;
      }

      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Google sign-in error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        // User closed the popup, no error needed
      } else {
        setError(
          error.code === 'auth/operation-not-allowed'
            ? 'Google sign-in is not enabled. Please contact the admin.'
            : 'Unable to sign in with Google. Please try again.'
        );
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const adminDoc = await getDoc(doc(db, 'admins', user.uid));

      if (!adminDoc.exists()) {
        await auth.signOut();
        setError('Access denied. This account is not registered as an admin.');
        setLoading(false);
        return;
      }

      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Login error:', err);

      switch (err.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setError('Invalid email or password');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later.');
          break;
        default:
          setError('Failed to log in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center py-12 px-4">
      <div className="relative max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-black">Swami PG</h1>
          </Link>
          <p className="text-[#4a4a4a] mt-2">Admin Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-md">
          <h2 className="text-2xl font-bold text-[#1a1a1a] text-center mb-2">
            Welcome Back
          </h2>
          <p className="text-[#4a4a4a] text-center mb-8">
            Sign in to access the admin dashboard
          </p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EmailIcon />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Swamipg1@gmail.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border border-gray-200 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5B9BD5]/30 focus:border-[#5B9BD5] transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PasswordIcon />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-lg bg-white border border-gray-200 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5B9BD5]/30 focus:border-[#5B9BD5] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#4a4a4a] hover:text-[#1a1a1a]"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#5B9BD5] text-white font-semibold rounded-lg hover:bg-[#4A8AC4] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="small" />
                  <span className="ml-2">Signing in...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-[#4a4a4a]">or</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full py-3 bg-white border border-gray-300 text-[#1a1a1a] font-semibold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-3"
          >
            {googleLoading ? (
              <>
                <LoadingSpinner size="small" />
                <span className="ml-2">Signing in...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Sign in with Google
              </>
            )}
          </button>

          {/* Tenant Login Link */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-[#4a4a4a] text-sm">
              Are you a tenant?{' '}
              <Link to="/tenant/login" className="text-[#5B9BD5] hover:text-[#4A8AC4] font-medium">
                Tenant Login
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-[#4a4a4a] hover:text-[#5B9BD5] text-sm transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
