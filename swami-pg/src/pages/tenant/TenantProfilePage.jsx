import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate } from '../../utils/helpers';

export default function TenantProfilePage() {
  const { tenantData, user, logout } = useAuth();

  const profileFields = [
    { label: 'Full Name', value: tenantData?.name, icon: 'user' },
    { label: 'Email', value: user?.email, icon: 'email' },
    { label: 'Phone', value: tenantData?.phone || 'Not provided', icon: 'phone' },
    { label: 'Tenant Code', value: tenantData?.tenant_code, icon: 'id' },
    { label: 'Room Number', value: tenantData?.room_number || 'N/A', icon: 'room' },
    { label: 'Property', value: tenantData?.property_name || 'Loading...', icon: 'building' },
    { label: 'Monthly Rent', value: formatCurrency(tenantData?.rent || 0), icon: 'money' },
    { label: 'Security Deposit', value: formatCurrency(tenantData?.deposit || 0), icon: 'shield' },
    { label: 'Join Date', value: tenantData?.created_at ? formatDate(tenantData.created_at) : 'N/A', icon: 'calendar' },
    { label: 'Status', value: tenantData?.status || 'Active', icon: 'status' },
  ];

  const getIcon = (type) => {
    const icons = {
      user: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      email: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      phone: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      id: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      ),
      room: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      building: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      money: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      shield: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      calendar: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      status: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    };
    return icons[type] || icons.user;
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#424242]">My Profile</h1>
        <p className="text-[#757575] mt-1">View your account information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* Avatar Section */}
        <div className="bg-[#5B7A9D] px-6 py-8 text-center">
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 border-4 border-white/30">
            <span className="text-4xl font-bold text-white">
              {(tenantData?.name || 'T').charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white">{tenantData?.name || 'Tenant'}</h2>
          <p className="text-blue-100 mt-1">{tenantData?.tenant_code || 'Loading...'}</p>
        </div>

        {/* Profile Fields */}
        <div className="p-6 space-y-4">
          {profileFields.map((field, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-xl border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#F0F4F8] flex items-center justify-center text-[#5B7A9D]">
                  {getIcon(field.icon)}
                </div>
                <span className="text-[#757575]">{field.label}</span>
              </div>
              <span className={`font-medium ${field.label === 'Status'
                ? field.value === 'Active'
                  ? 'text-[#4A7C59]'
                  : 'text-[#B8860B]'
                : 'text-[#424242]'
                }`}>
                {field.value}
              </span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200">
          <div className="space-y-3">
            <Link
              to="/tenant/dashboard"
              className="block w-full px-6 py-3 text-center text-sm font-semibold text-white bg-[#5B7A9D] rounded-xl hover:bg-[#4A6B8A] transition-all duration-200"
            >
              Back to Dashboard
            </Link>
            <button
              onClick={logout}
              className="block w-full px-6 py-3 text-center text-sm font-semibold text-red-600 border-2 border-red-200 rounded-xl hover:bg-red-50 hover:border-red-500/50 transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-[#424242] mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#5B7A9D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Need Help?
        </h3>
        <p className="text-[#757575] text-sm mb-4">
          Contact the PG admin for any profile updates or issues.
        </p>
        <a
          href="tel:+917575866048"
          className="inline-flex items-center gap-2 text-[#1E88E5] hover:text-[#1565C0] font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Call Admin
        </a>
      </div>
    </div>
  );
}
