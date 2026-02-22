export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">Swami PG</h3>
            <p className="text-gray-400 text-sm">
              Strict, safe and affordable accommodation in Vadodara, Gujarat.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  View Properties
                </a>
              </li>
              <li>
                <a href="/request-visit" className="hover:text-white transition-colors">
                  Request a Visit
                </a>
              </li>
              <li>
                <a href="/tenant/login" className="hover:text-white transition-colors">
                  Tenant Login
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-400 text-sm">
              Vadodara, Gujarat, India
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Swami PG. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
