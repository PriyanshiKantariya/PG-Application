import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// SVG Icons for Navigation
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const PropertiesIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const TenantsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const BillsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const ComplaintsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const VisitsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

// Navigation items
const navItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: DashboardIcon },
  { name: 'Properties', path: '/admin/properties', icon: PropertiesIcon },
  { name: 'Tenants', path: '/admin/tenants', icon: TenantsIcon },
  {
    name: 'Bills',
    icon: BillsIcon,
    subItems: [
      { name: 'Utilities Entry', path: '/admin/bills' },
      { name: 'Bills Overview', path: '/admin/bills/overview' },
    ]
  },
  { name: 'Complaints', path: '/admin/complaints', icon: ComplaintsIcon },
  { name: 'Visit Requests', path: '/admin/visits', icon: VisitsIcon },
];

export default function AdminLayout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [billsExpanded, setBillsExpanded] = useState(location.pathname.startsWith('/admin/bills'));

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

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
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#EBF3FB] border-r border-blue-200 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        {/* Logo */}
        <div className="p-6 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1a1a1a]">Swami PG</h1>
              <p className="text-[#4a4a4a] text-sm">Admin Panel</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-[#4a4a4a] hover:text-[#1a1a1a]"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => (
            item.subItems ? (
              // Expandable menu item (Bills)
              <div key={item.name}>
                <button
                  onClick={() => setBillsExpanded(!billsExpanded)}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors ${location.pathname.startsWith('/admin/bills')
                    ? 'bg-white text-[#3A6FA0] font-medium shadow-sm'
                    : 'text-[#3a3a3a] hover:bg-white/60 hover:text-[#1a1a1a]'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <ChevronDownIcon className={`transform transition-transform ${billsExpanded ? 'rotate-180' : ''}`} />
                </button>
                {/* Sub-items */}
                {billsExpanded && (
                  <div className="mt-1 ml-4 space-y-1">
                    {item.subItems.map((subItem) => (
                      <NavLink
                        key={subItem.path}
                        to={subItem.path}
                        end={subItem.path === '/admin/bills'}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${isActive
                            ? 'bg-white text-[#3A6FA0] font-medium shadow-sm'
                            : 'text-[#3a3a3a] hover:bg-white/60 hover:text-[#1a1a1a]'
                          }`
                        }
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></span>
                        <span>{subItem.name}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Regular nav item
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                    ? 'bg-white text-[#3A6FA0] font-medium shadow-sm'
                    : 'text-[#3a3a3a] hover:bg-white/60 hover:text-[#1a1a1a]'
                  }`
                }
              >
                <item.icon />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            )
          ))}
        </nav>

        {/* User & Logout */}
        <div className="mt-auto p-4 border-t border-blue-200">
          <div className="px-4 py-2 mb-2">
            <p className="text-[#4a4a4a] text-xs">Logged in as</p>
            <p className="text-[#1a1a1a] text-sm font-medium truncate">
              {currentUser?.email || 'Admin'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-[#4a4a4a] hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogoutIcon />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="bg-[#F0F7FF] border-b border-blue-100 px-4 py-4 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[#4a4a4a] hover:bg-gray-100 transition-colors"
            >
              <MenuIcon />
            </button>
            <div className="lg:hidden flex-1 text-center">
              <span className="font-semibold text-[#1a1a1a]">Swami PG Admin</span>
            </div>
            <div className="hidden lg:block">
              <p className="text-sm text-[#4a4a4a]">
                Welcome back, <span className="font-medium text-[#1a1a1a]">Admin</span>
              </p>
            </div>
            <div className="w-8 lg:hidden"></div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
