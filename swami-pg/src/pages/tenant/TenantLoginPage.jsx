import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { LoadingSpinner } from '../../components/common';
import { isValidEmail } from '../../utils/helpers';

// Detect if input looks like a phone number
function isPhoneNumber(input) {
  const cleaned = input.replace(/[\s\-\(\)\+]/g, '');
  return /^\d{10,13}$/.test(cleaned);
}

// Normalize phone: strip country code prefix, keep last 10 digits
function normalizePhone(phone) {
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  if (cleaned.length > 10) {
    return cleaned.slice(-10);
  }
  return cleaned;
}

export default function TenantLoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: '',
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

    if (!formData.identifier.trim()) {
      newErrors.identifier = 'Email or phone number is required';
    } else {
      const input = formData.identifier.trim();
      if (!isPhoneNumber(input) && !isValidEmail(input)) {
        newErrors.identifier = 'Please enter a valid email address or 10-digit phone number';
      }
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
        message: 'The email/phone or password is incorrect. If the admin added you, please Sign Up first with the same email to activate your account.'
      },
      'auth/network-request-failed': {
        title: 'Network Error',
        message: 'Unable to connect. Please check your internet connection and try again.'
      },
      'auth/invalid-login-credentials': {
        title: 'Login Failed',
        message: 'Invalid credentials. If you are a new tenant, please Sign Up first to create your login.'
      }
    };
    return errorMessages[errorCode] || {
      title: 'Login Failed',
      message: `Something went wrong. Please try again. (Error: ${errorCode || 'Unknown'})`
    };
  };

  // Look up email from Firestore by phone number
  async function lookupEmailByPhone(phone) {
    const normalized = normalizePhone(phone);

    // Try exact match first
    let q = query(collection(db, 'tenants'), where('phone', '==', normalized));
    let snap = await getDocs(q);

    // If not found, try with common prefixes
    if (snap.empty) {
      q = query(collection(db, 'tenants'), where('phone', '==', '+91' + normalized));
      snap = await getDocs(q);
    }
    if (snap.empty) {
      q = query(collection(db, 'tenants'), where('phone', '==', '91' + normalized));
      snap = await getDocs(q);
    }

    if (snap.empty) {
      return null;
    }

    const tenant = snap.docs[0].data();
    return tenant.email || null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setAuthError('');

    try {
      let email = formData.identifier.trim();

      // If it's a phone number, look up the email from Firestore
      if (isPhoneNumber(email)) {
        const foundEmail = await lookupEmailByPhone(email);
        if (!foundEmail) {
          // Check if the phone exists in Firestore at all (tenant added by admin but no email)
          const normalized = normalizePhone(email);
          let phoneQuery = query(collection(db, 'tenants'), where('phone', '==', normalized));
          let phoneSnap = await getDocs(phoneQuery);
          if (phoneSnap.empty) {
            phoneQuery = query(collection(db, 'tenants'), where('phone', '==', '+91' + normalized));
            phoneSnap = await getDocs(phoneQuery);
          }

          if (!phoneSnap.empty) {
            // Tenant exists in Firestore but has no email — needs to sign up
            setAuthError({
              title: 'Sign Up Required',
              message: 'Your phone number is registered by the admin, but you haven\'t created your login yet. Please click "Sign Up" below to create your account with this phone number.'
            });
          } else {
            setAuthError({
              title: 'Phone Number Not Found',
              message: 'No tenant account is linked to this phone number. Please check the number or try logging in with your email instead.'
            });
          }
          setLoading(false);
          return;
        }
        email = foundEmail;
      }

      await signInWithEmailAndPassword(auth, email, formData.password);
      navigate('/tenant/dashboard');
    } catch (error) {
      console.error('Login error:', error.code, error.message);

      // If login failed, check if tenant exists in Firestore to give better error
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-login-credentials') {
        const inputEmail = formData.identifier.trim();
        if (!isPhoneNumber(inputEmail)) {
          // Check if this email exists in Firestore tenants (added by admin)
          const emailQuery = query(collection(db, 'tenants'), where('email', '==', inputEmail.toLowerCase()));
          const emailSnap = await getDocs(emailQuery);

          if (!emailSnap.empty) {
            const tenant = emailSnap.docs[0].data();
            if (!tenant.auth_uid) {
              // Tenant added by admin but never signed up
              setAuthError({
                title: 'Sign Up Required',
                message: 'The admin has added you as a tenant, but you haven\'t created your login yet. Please click "Sign Up" below and use this same email address to activate your account.'
              });
              setLoading(false);
              return;
            }
          }
        }
      }

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
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <img src="/logo.svg" alt="Swami PG Logo" className="w-10 h-10 rounded object-contain" />
            <span className="text-2xl font-bold text-[#1a1a1a]">Swami PG</span>
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
            {/* Email or Phone */}
            <div>
              <label htmlFor="identifier" className="block text-sm font-semibold text-[#424242] mb-2">
                Email or Phone Number
              </label>
              <input
                type="text"
                id="identifier"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                className={`w-full px-3 py-3 rounded-lg bg-white border text-[#424242] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/30 focus:border-[#1E88E5] transition-colors ${errors.identifier ? 'border-red-300' : 'border-gray-200'
                  }`}
                placeholder="Enter email or phone number"
                autoComplete="username"
              />
              {errors.identifier && (
                <p className="text-red-500 text-sm mt-1">{errors.identifier}</p>
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
