import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const BillsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ComplaintsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ProfileIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const navigation = [
  { name: 'Dashboard', path: '/tenant/dashboard', icon: HomeIcon },
  { name: 'Bills', path: '/tenant/bills', icon: BillsIcon },
  { name: 'Complaints', path: '/tenant/complaints', icon: ComplaintsIcon },
  { name: 'Profile', path: '/tenant/profile', icon: ProfileIcon }
];

export default function TenantLayout() {
  const { tenantData, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="min-h-screen bg-[#F0F4F8]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#EBF3FB] border-r border-blue-200 shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        {/* Logo & Brand */}
        <div className="p-6 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <Link to="/tenant/dashboard" className="flex items-center gap-3">
              <img src="/logo.svg" alt="Swami PG Logo" className="w-10 h-10 rounded object-contain" />
              <div>
                <h1 className="text-xl font-bold text-[#1a1a1a]">Swami PG</h1>
                <p className="text-[#4a4a4a] text-xs">Tenant Portal</p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-[#4a4a4a] hover:text-[#1a1a1a]"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive: active }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${active
                    ? 'bg-white text-[#3A6FA0] font-medium shadow-sm'
                    : 'text-[#3a3a3a] hover:bg-white/60 hover:text-[#1a1a1a]'
                  }`
                }
              >
                <Icon />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="mt-auto p-4 border-t border-blue-200">
          <div className="px-4 py-2 mb-2">
            <p className="text-[#4a4a4a] text-xs">Logged in as</p>
            <p className="text-[#1a1a1a] text-sm font-medium truncate">
              {tenantData?.name || 'Tenant'}
            </p>
            {tenantData?.tenant_code && (
              <p className="text-[#4a4a4a] text-xs truncate">{tenantData.tenant_code}</p>
            )}
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm text-[#4a4a4a] hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogoutIcon />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="md:ml-64">
        {/* Top Bar */}
        <header className="bg-[#F0F7FF] border-b border-blue-100 px-4 py-4 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-[#4a4a4a] hover:bg-gray-100 transition-colors"
            >
              <MenuIcon />
            </button>
            <div className="md:hidden flex-1 text-center">
              <Link to="/tenant/dashboard" className="inline-flex items-center gap-2">
                <img src="/logo.svg" alt="Logo" className="w-7 h-7 rounded object-contain" />
                <span className="font-semibold text-[#1a1a1a]">Swami PG</span>
              </Link>
            </div>
            <div className="hidden md:block">
              <p className="text-sm text-[#4a4a4a]">
                Welcome back, <span className="font-medium text-[#1a1a1a]">{tenantData?.name || 'Tenant'}</span>
              </p>
            </div>
            <div className="w-8 md:hidden"></div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6 pb-24 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Bottom Navigation - Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        <div className="flex justify-around">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center py-3 px-4 text-xs transition-all duration-200 ${active
                  ? 'text-[#3A6FA0]'
                  : 'text-[#757575] hover:text-[#424242]'
                  }`}
              >
                <div className={`p-1 rounded-lg ${active ? 'bg-[#EBF3FB]' : ''}`}>
                  <Icon />
                </div>
                <span className={`mt-1 font-medium ${active ? 'text-[#3A6FA0]' : ''}`}>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
