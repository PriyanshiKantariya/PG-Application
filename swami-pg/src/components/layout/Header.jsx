import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Icons
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

const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const navLinks = [
  { name: 'Home', href: '/', isRoute: true },
  { name: 'About Us', href: '/#about', isRoute: false },
  { name: 'Our PGs', href: '/properties', isRoute: true },
  { name: 'Reviews', href: '/#reviews', isRoute: false },
  { name: 'Rules', href: '/rules', isRoute: true },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const loginRef = useRef(null);
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (loginRef.current && !loginRef.current.contains(e.target)) {
        setLoginDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setLoginDropdownOpen(false);
  }, [location]);

  // Handle anchor link scrolling
  const handleNavClick = (e, href) => {
    if (href.startsWith('/#')) {
      const sectionId = href.replace('/#', '');

      // If already on homepage, scroll to section
      if (location.pathname === '/') {
        e.preventDefault();
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      // If on another page, navigate to / first, then scroll (handled by hash)
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-[#F0F7FF] border-b border-blue-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-white shadow-sm border border-gray-100 p-0.5 flex items-center justify-center">
              <img src="/logo.svg" alt="Swami PG Logo" className="w-full h-full rounded object-contain" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Swami PG
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${location.pathname === link.href
                    ? 'text-[#5B9BD5] bg-blue-50'
                    : 'text-[#424242] hover:text-[#5B9BD5] hover:bg-gray-50'
                    }`}
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-3 py-2 text-sm font-medium text-[#424242] hover:text-[#5B9BD5] hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
                >
                  {link.name}
                </a>
              )
            ))}

            {/* Login Button with Dropdown */}
            <div className="relative ml-2" ref={loginRef}>
              <button
                onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[#5B9BD5] rounded-lg hover:bg-[#4A8AC4] transition-all shadow-sm"
              >
                Login
                <ChevronDownIcon />
              </button>

              {/* Dropdown */}
              {loginDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden z-50 animate-in">
                  <Link
                    to="/tenant/login"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-[#424242] hover:bg-blue-50 hover:text-[#5B9BD5] transition-colors"
                    onClick={() => setLoginDropdownOpen(false)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <UserIcon />
                    </div>
                    <div>
                      <p className="font-medium">Tenant Login</p>
                      <p className="text-xs text-[#757575]">Access your account</p>
                    </div>
                  </Link>
                  <div className="border-t border-gray-100" />
                  <Link
                    to="/admin/login"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-[#424242] hover:bg-blue-50 hover:text-[#5B9BD5] transition-colors"
                    onClick={() => setLoginDropdownOpen(false)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                      <ShieldIcon />
                    </div>
                    <div>
                      <p className="font-medium">Admin Login</p>
                      <p className="text-xs text-[#757575]">Manage properties</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#424242] hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`block px-4 py-3 text-sm font-medium rounded-lg transition-colors ${location.pathname === link.href
                    ? 'text-[#5B9BD5] bg-blue-50'
                    : 'text-[#424242] hover:bg-gray-50'
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="block px-4 py-3 text-sm font-medium text-[#424242] hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {link.name}
                </a>
              )
            ))}

            {/* Mobile Login Options */}
            <div className="pt-3 mt-2 border-t border-gray-100 space-y-2">
              <p className="px-4 text-xs font-semibold text-[#757575] uppercase tracking-wider">Login As</p>
              <Link
                to="/tenant/login"
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#424242] hover:bg-blue-50 hover:text-[#5B9BD5] rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#5B9BD5]">
                  <UserIcon />
                </div>
                Tenant
              </Link>
              <Link
                to="/admin/login"
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#424242] hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                  <ShieldIcon />
                </div>
                Admin
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
