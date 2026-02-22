import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">Swami PG</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-3">
            <Link
              to="/admin/login"
              className="px-4 py-2 text-sm font-medium text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/10 transition-colors"
            >
              Admin
            </Link>
            <Link
              to="/tenant/login"
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20"
            >
              Tenant Login
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
