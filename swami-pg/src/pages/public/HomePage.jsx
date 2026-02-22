import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProperties, useAreas } from '../../hooks/useProperties';
import { LoadingSpinner } from '../../components/common';
import { formatCurrency, getCallLink } from '../../utils/helpers';

// ============================================================================
// ICONS
// ============================================================================
const Icons = {
  Calendar: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Phone: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  Shield: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Home: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Currency: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  MapPin: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Users: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Wifi: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
    </svg>
  ),
  Clock: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  ChevronRight: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  Star: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  Building: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  Bed: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v11a1 1 0 001 1h16a1 1 0 001-1V7M3 7l9-4 9 4M3 7v4h18V7" />
    </svg>
  ),
  ArrowRight: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  ),
  Sparkles: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  )
};

// ============================================================================
// DARK THEME PROPERTY CARD
// ============================================================================
function DarkPropertyCard({ property }) {
  const { id, name, area, default_rent, available_beds, total_beds, rules_text, images } = property;

  const rulesPreview = rules_text
    ? rules_text.split('\n').slice(0, 2).join(' • ').replace(/^- /gm, '')
    : '';

  const isAvailable = available_beds > 0;
  
  // Get primary image or first image
  const primaryImage = images?.find(img => img.isPrimary) || images?.[0];
  const hasImage = primaryImage?.url;

  return (
    <div className="group bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10">
      {/* Property Header / Image */}
      <div className="relative h-44 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
        {hasImage ? (
          <>
            {/* Actual Property Image */}
            <img 
              src={primaryImage.url} 
              alt={name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
          </>
        ) : (
          <>
            {/* Decorative elements (fallback when no image) */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-4 left-4 w-20 h-20 border border-cyan-500/30 rounded-full"></div>
              <div className="absolute bottom-4 right-4 w-16 h-16 border border-purple-500/30 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-2xl"></div>
            </div>
            
            {/* Property Initial */}
            <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-3xl font-bold">{name?.charAt(0) || 'P'}</span>
            </div>
          </>
        )}

        {/* Availability Badge */}
        <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${
          isAvailable 
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          {isAvailable ? `${available_beds} beds available` : 'Fully Occupied'}
        </div>
        
        {/* Image count badge */}
        {images?.length > 1 && (
          <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-slate-900/70 text-slate-300 text-xs backdrop-blur-sm flex items-center gap-1">
            <Icons.Building className="w-3 h-3" />
            {images.length} photos
          </div>
        )}
      </div>

      {/* Property Info */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">
          {name}
        </h3>
        
        <div className="flex items-center gap-1.5 text-slate-400 text-sm mb-4">
          <Icons.MapPin className="w-4 h-4" />
          <span>{area}</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            {formatCurrency(default_rent)}
          </span>
          <span className="text-slate-500 text-sm">/ month</span>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-700/50">
          <div className="flex items-center gap-1.5 text-slate-400 text-sm">
            <Icons.Bed className="w-4 h-4" />
            <span>{total_beds} beds</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 text-sm">
            <Icons.Users className="w-4 h-4" />
            <span>Shared</span>
          </div>
        </div>

        {rulesPreview && (
          <p className="text-slate-500 text-sm mb-4 line-clamp-2">{rulesPreview}</p>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            to={`/property/${id}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20"
          >
            View Details
            <Icons.ChevronRight className="w-4 h-4" />
          </Link>
          <a
            href={getCallLink('9876543210')}
            className="px-4 py-2.5 text-sm font-medium text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/10 transition-colors"
          >
            <Icons.Phone className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE CARD
// ============================================================================
function FeatureCard({ icon: Icon, title, description, gradient }) {
  return (
    <div className="group relative p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:shadow-lg">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

// ============================================================================
// STAT ITEM
// ============================================================================
function StatItem({ value, label }) {
  return (
    <div className="text-center">
      <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-1">
        {value}
      </p>
      <p className="text-slate-400 text-sm">{label}</p>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function HomePage() {
  const [selectedArea, setSelectedArea] = useState('All Areas');
  const { properties, loading, error } = useProperties(selectedArea, true); // true = showOnHomepageOnly
  const { areas } = useAreas();

  return (
    <div className="bg-slate-950 min-h-screen">
      {/* ================================================================== */}
      {/* HERO SECTION */}
      {/* ================================================================== */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950"></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700/50 backdrop-blur-sm">
              <Icons.Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-slate-300">Trusted by 500+ professionals in Vadodara</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6">
            <span className="text-white">Premium PG Living in</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Vadodara
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-400 text-center max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience modern, safe, and affordable accommodation designed for students and working professionals.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/request-visit"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
            >
              <Icons.Calendar className="w-5 h-5" />
              Schedule a Visit
            </Link>
            <a
              href="tel:+919876543210"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 text-white rounded-xl font-semibold border border-slate-700 hover:bg-slate-700 hover:border-slate-600 transition-all"
            >
              <Icons.Phone className="w-5 h-5" />
              Call Us Now
            </a>
          </div>

          {/* Stats */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-8 md:gap-12 px-8 py-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
              <StatItem value="10+" label="Properties" />
              <div className="w-px h-10 bg-slate-700"></div>
              <StatItem value="200+" label="Happy Tenants" />
              <div className="w-px h-10 bg-slate-700 hidden md:block"></div>
              <div className="hidden md:block">
                <StatItem value="5★" label="Rating" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FEATURES SECTION */}
      {/* ================================================================== */}
      <section className="relative py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose Swami PG?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              We provide more than just a place to stay. Experience comfort, security, and community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={Icons.Shield}
              title="Safe & Secure"
              description="24/7 CCTV surveillance and security personnel for your peace of mind."
              gradient="from-cyan-500 to-blue-600"
            />
            <FeatureCard
              icon={Icons.Home}
              title="Fully Furnished"
              description="Comfortable beds, storage, and all essential amenities included."
              gradient="from-purple-500 to-pink-600"
            />
            <FeatureCard
              icon={Icons.Wifi}
              title="High-Speed WiFi"
              description="Unlimited high-speed internet for work and entertainment."
              gradient="from-amber-500 to-orange-600"
            />
            <FeatureCard
              icon={Icons.Currency}
              title="Transparent Pricing"
              description="No hidden charges. Clear billing with utility breakdown."
              gradient="from-emerald-500 to-teal-600"
            />
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* PROPERTIES SECTION */}
      {/* ================================================================== */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header with Filter */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Our Properties
              </h2>
              <p className="text-slate-400">
                {selectedArea === 'All Areas' 
                  ? 'Browse all available properties' 
                  : `Properties in ${selectedArea}`}
                <span className="text-slate-500 ml-2">({properties.length} found)</span>
              </p>
            </div>

            {/* Area Filter */}
            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-sm">Filter by area:</span>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all min-w-[180px]"
              >
                {areas.map((area) => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Properties Grid */}
          {loading ? (
            <div className="py-20 flex flex-col items-center">
              <LoadingSpinner size="large" />
              <p className="text-slate-400 mt-4">Loading properties...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <Icons.Building className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-red-400">Error loading properties: {error}</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <Icons.Building className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-slate-400">No properties found in this area.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <DarkPropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================================================================== */}
      {/* HOW IT WORKS SECTION */}
      {/* ================================================================== */}
      <section className="relative py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Getting started is simple. Follow these steps to find your perfect PG.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Browse Properties', description: 'Explore our curated list of premium PG accommodations across Vadodara.' },
              { step: '02', title: 'Schedule a Visit', description: 'Book a convenient time to visit and see the property in person.' },
              { step: '03', title: 'Move In', description: 'Complete simple documentation and move into your new home.' }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.description}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 -right-4 text-slate-700">
                    <Icons.ArrowRight className="w-8 h-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* CTA SECTION */}
      {/* ================================================================== */}
      <section className="relative py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-600"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
            
            {/* Content */}
            <div className="relative px-8 py-16 md:px-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Find Your New Home?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Schedule a visit today and experience the Swami PG difference. Our team is ready to welcome you!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/request-visit"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-slate-100 transition-colors shadow-lg"
                >
                  <Icons.Calendar className="w-5 h-5" />
                  Schedule Your Visit
                </Link>
                <a
                  href="tel:+919876543210"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-colors backdrop-blur-sm"
                >
                  <Icons.Phone className="w-5 h-5" />
                  Call Us Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FLOATING MOBILE CTA */}
      {/* ================================================================== */}
      <div className="fixed bottom-4 left-4 right-4 md:hidden z-40">
        <Link
          to="/request-visit"
          className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-cyan-500/30"
        >
          <Icons.Calendar className="w-5 h-5" />
          Schedule a Visit
        </Link>
      </div>
    </div>
  );
}
