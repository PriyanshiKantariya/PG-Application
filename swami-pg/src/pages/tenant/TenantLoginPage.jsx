import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { LoadingSpinner } from '../../components/common';
import { isValidEmail } from '../../utils/helpers';

export default function TenantLoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (authError) {
      setAuthError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getFirebaseErrorMessage = (errorCode) => {
    const errorMessages = {
      'auth/user-not-found': {
        title: 'Account Not Found',
        message: 'No account exists with this email. If the admin added you as a tenant, you need to Sign Up first to create your login credentials.'
      },
      'auth/wrong-password': {
        title: 'Incorrect Password',
        message: 'The password you entered is incorrect. Please try again or contact admin to reset your password.'
      },
      'auth/invalid-email': {
        title: 'Invalid Email',
        message: 'Please enter a valid email address format (e.g., name@example.com).'
      },
      'auth/user-disabled': {
        title: 'Account Disabled',
        message: 'Your account has been disabled. Please contact the admin for assistance.'
      },
      'auth/too-many-requests': {
        title: 'Too Many Attempts',
        message: 'Access temporarily blocked due to too many failed login attempts. Please try again after a few minutes.'
      },
      'auth/invalid-credential': {
        title: 'Invalid Credentials',
        message: 'The email or password is incorrect. If the admin added you, please Sign Up first with the same email to activate your account.'
      },
      'auth/network-request-failed': {
        title: 'Network Error',
        message: 'Unable to connect. Please check your internet connection and try again.'
      },
      'auth/invalid-login-credentials': {
        title: 'Login Failed',
        message: 'Invalid email or password. If you are a new tenant, please Sign Up first to create your login.'
      }
    };
    return errorMessages[errorCode] || {
      title: 'Login Failed',
      message: `Something went wrong. Please try again. (Error: ${errorCode || 'Unknown'})`
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setAuthError('');

    try {
      console.log('Attempting login with:', formData.email);
      const result = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      console.log('Login successful! User:', result.user.uid);
      navigate('/tenant/dashboard');
    } catch (error) {
      console.error('Login error:', error.code, error.message);
      setAuthError(getFirebaseErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] py-12 px-4">
      <div className="relative max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <span className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">Swami PG</span>
          </Link>
          <h1 className="text-2xl font-semibold text-[#424242]">Tenant Login</h1>
          <p className="text-[#757575] mt-2">Access your bills and account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-md">
          {/* Auth Error Alert */}
          {authError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-700">{authError.title}</h3>
                  <p className="text-sm text-red-600 mt-1">{authError.message}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#424242] mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-3 rounded-lg bg-white border text-[#424242] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/30 focus:border-[#1E88E5] transition-colors ${errors.email ? 'border-red-300' : 'border-gray-200'
                  }`}
                placeholder="Enter your email"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#424242] mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-3 rounded-lg bg-white border text-[#424242] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/30 focus:border-[#1E88E5] transition-colors ${errors.password ? 'border-red-300' : 'border-gray-200'
                  }`}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-[#1E88E5] hover:text-[#1565C0] font-medium"
                onClick={() => alert('Please contact the admin to reset your password.')}
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1E88E5] text-white font-semibold rounded-lg hover:bg-[#1565C0] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <LoadingSpinner size="small" className="mr-2" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-[#757575]">
              Don't have an account?{' '}
              <Link to="/tenant/signup" className="text-[#1E88E5] hover:text-[#1565C0] font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-[#757575] hover:text-[#1E88E5] font-medium transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
