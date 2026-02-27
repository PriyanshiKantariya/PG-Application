import { Link } from 'react-router-dom';

// Icons
const Icons = {
  MapPin: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Phone: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  Mail: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Clock: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  ChevronRight: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  Instagram: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
  WhatsApp: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
};

const footerLinks = [
  { label: 'Our Properties', to: '/properties' },
  { label: 'Schedule a Visit', to: '/request-visit' },
  { label: 'PG Rules', to: '/rules' },
  { label: 'Tenant Login', to: '/tenant/login' },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#D4E6F6] overflow-hidden mt-auto">
      {/* Decorative top wave */}
      <div className="absolute top-0 left-0 right-0" aria-hidden="true">
        <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-6 md:h-10 block" preserveAspectRatio="none">
          <path d="M0 40L48 35C96 30 192 20 288 16C384 12 480 14 576 18C672 22 768 28 864 30C960 32 1056 30 1152 26C1248 22 1344 16 1392 13L1440 10V0H0V40Z" fill="white" />
        </svg>
      </div>

      {/* Subtle decorative circles */}
      <div className="absolute top-12 right-0 w-72 h-72 rounded-full bg-[#1E88E5]/[0.04] blur-3xl" aria-hidden="true"></div>
      <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-[#5B9BD5]/[0.06] blur-3xl" aria-hidden="true"></div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-10">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <h3 className="text-2xl font-bold text-[#1a1a1a]">Swami PG</h3>
            </Link>
            <p className="text-[#4a4a4a] text-sm leading-relaxed mb-6">
              Premium PG accommodation in Vadodara, Gujarat. Safe, affordable, and fully furnished living spaces for students and professionals.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/917575866048"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-[#25D366] hover:border-[#25D366] transition-all duration-300 group shadow-sm"
                aria-label="WhatsApp"
              >
                <Icons.WhatsApp className="w-4 h-4 text-[#4a4a4a] group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-[#E1306C] hover:border-[#E1306C] transition-all duration-300 group shadow-sm"
                aria-label="Instagram"
              >
                <Icons.Instagram className="w-4 h-4 text-[#4a4a4a] group-hover:text-white transition-colors" />
              </a>
              <a
                href="tel:+917575866048"
                className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-[#1E88E5] hover:border-[#1E88E5] transition-all duration-300 group shadow-sm"
                aria-label="Call"
              >
                <Icons.Phone className="w-4 h-4 text-[#4a4a4a] group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-[#1a1a1a] uppercase tracking-wider mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group flex items-center gap-2 text-[#4a4a4a] hover:text-[#1E88E5] text-sm font-medium transition-colors"
                  >
                    <Icons.ChevronRight className="w-3.5 h-3.5 text-[#5B9BD5] opacity-0 -ml-5 group-hover:ml-0 group-hover:opacity-100 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold text-[#1a1a1a] uppercase tracking-wider mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <Icons.MapPin className="w-4 h-4 text-[#1E88E5]" />
                </div>
                <p className="text-[#4a4a4a] text-sm leading-relaxed">Vadodara, Gujarat,<br />India - 390021</p>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Icons.Phone className="w-4 h-4 text-[#1E88E5]" />
                </div>
                <a href="tel:+917575866048" className="text-[#4a4a4a] text-sm hover:text-[#1E88E5] transition-colors font-medium">
                  +91 75758 66048
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Icons.Mail className="w-4 h-4 text-[#1E88E5]" />
                </div>
                <a href="mailto:Swamipg1@gmail.com" className="text-[#4a4a4a] text-sm hover:text-[#1E88E5] transition-colors font-medium">
                  Swamipg1@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Office Hours */}
          <div>
            <h4 className="text-sm font-semibold text-[#1a1a1a] uppercase tracking-wider mb-5">Office Hours</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Icons.Clock className="w-4 h-4 text-[#1E88E5]" />
                </div>
                <div>
                  <p className="text-sm text-[#1a1a1a] font-medium">Mon – Sat</p>
                  <p className="text-xs text-[#4a4a4a]">9:00 AM – 7:00 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Icons.Clock className="w-4 h-4 text-[#5B9BD5]" />
                </div>
                <div>
                  <p className="text-sm text-[#1a1a1a] font-medium">Sunday</p>
                  <p className="text-xs text-[#4a4a4a]">10:00 AM – 4:00 PM</p>
                </div>
              </div>
            </div>

            {/* Mini CTA */}
            <Link
              to="/request-visit"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-[#1E88E5] text-white text-sm font-medium rounded-xl hover:bg-[#1565C0] transition-colors shadow-md"
            >
              Schedule Visit
              <Icons.ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#b3cfe5]"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-5">
          <p className="text-[#4a4a4a] text-sm">
            © {new Date().getFullYear()} Swami PG. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/rules" className="text-[#4a4a4a] text-sm hover:text-[#1E88E5] transition-colors">
              PG Rules
            </Link>
            <span className="text-[#b3cfe5]">•</span>
            <Link to="/properties" className="text-[#4a4a4a] text-sm hover:text-[#1E88E5] transition-colors">
              Properties
            </Link>
            <span className="text-[#b3cfe5]">•</span>
            <Link to="/request-visit" className="text-[#4a4a4a] text-sm hover:text-[#1E88E5] transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
