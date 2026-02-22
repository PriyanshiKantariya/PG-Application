import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../common';

export default function ProtectedRoute({ children, requiredRole }) {
  const { currentUser, userRole, loading, tenantData } = useAuth();

  console.log('ProtectedRoute check:', { 
    loading, 
    currentUser: currentUser?.email, 
    userRole, 
    requiredRole,
    hasTenantData: !!tenantData 
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Not logged in
  if (!currentUser) {
    console.log('No currentUser, redirecting to login');
    return <Navigate to="/tenant/login" replace />;
  }

  // User is logged in but doesn't have the required role
  if (requiredRole && userRole !== requiredRole) {
    // If user is logged in but no tenant profile exists
    if (requiredRole === 'tenant' && !userRole) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Tenant Profile Not Found</h2>
              <p className="text-gray-600 mb-4">
                You are logged in as <span className="font-medium">{currentUser.email}</span>, but no tenant profile is linked to your account.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Please contact the admin to set up your tenant profile.
              </p>
              <div className="text-xs text-gray-400 mb-6 p-3 bg-gray-100 rounded font-mono">
                Your User ID: {currentUser.uid}
              </div>
              <Link
                to="/"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      );
    }
    
    // Tenant trying to access admin or vice versa
    if (requiredRole === 'admin') {
      return <Navigate to="/admin/login" replace />;
    }
    return <Navigate to="/tenant/login" replace />;
  }

  return children;
}
