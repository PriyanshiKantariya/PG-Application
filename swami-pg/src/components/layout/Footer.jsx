export default function Footer() {
  return (
    <footer className="bg-[#D4E6F6] border-t border-blue-100 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#1a1a1a]">Swami PG</h3>
            <p className="text-[#4a4a4a] text-sm">
              Strict, safe and affordable accommodation in Vadodara, Gujarat.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-[#4a4a4a]">
              <li>
                <a href="/" className="hover:text-[#5B9BD5] transition-colors">
                  View Properties
                </a>
              </li>
              <li>
                <a href="/request-visit" className="hover:text-[#5B9BD5] transition-colors">
                  Request a Visit
                </a>
              </li>
              <li>
                <a href="/tenant/login" className="hover:text-[#5B9BD5] transition-colors">
                  Tenant Login
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4">Contact</h3>
            <p className="text-[#4a4a4a] text-sm">
              Vadodara, Gujarat, India
            </p>
          </div>
        </div>

        <div className="border-t border-blue-200 mt-8 pt-8 text-center text-sm text-[#4a4a4a]">
          <p>&copy; {new Date().getFullYear()} Swami PG. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
