import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
// PROPERTY CARD – LIGHT MODE
// ============================================================================
function PropertyCard({ property }) {
  const { id, name, area, default_rent, available_beds, total_flats, rules_text, images } = property;

  const rulesPreview = rules_text
    ? rules_text.split('\n').slice(0, 2).join(' • ').replace(/^- /gm, '')
    : '';

  const isAvailable = available_beds > 0;

  // Get primary image or first image
  const primaryImage = images?.find(img => img.isPrimary) || images?.[0];
  const hasImage = primaryImage?.url;

  return (
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Property Header / Image */}
      <div className="relative h-44 bg-gradient-to-br from-[#5B9BD5] to-[#4A8AC4] flex items-center justify-center overflow-hidden">
        {hasImage ? (
          <>
            <img
              src={primaryImage.url}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
          </>
        ) : (
          <>
            <div className="relative z-10 w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-3xl font-bold">{name?.charAt(0) || 'P'}</span>
            </div>
          </>
        )}

        {/* Availability Badge */}
        <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-semibold ${isAvailable
          ? 'bg-green-100 text-[#2E7D32] border border-green-200'
          : 'bg-red-100 text-[#C62828] border border-red-200'
          }`}>
          {isAvailable ? `${available_beds} flats available` : 'Fully Occupied'}
        </div>

        {/* Image count badge */}
        {images?.length > 1 && (
          <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-black/50 text-white text-xs backdrop-blur-sm flex items-center gap-1">
            <Icons.Building className="w-3 h-3" />
            {images.length} photos
          </div>
        )}
      </div>

      {/* Property Info */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-[#1a1a1a] mb-1 group-hover:text-[#1E88E5] transition-colors">
          {name}
        </h3>

        <div className="flex items-center gap-1.5 text-[#4a4a4a] text-sm mb-4">
          <Icons.MapPin className="w-4 h-4" />
          <span>{area}</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-2xl font-bold text-[#1E88E5]">
            {formatCurrency(default_rent)}
          </span>
          <span className="text-[#4a4a4a] text-sm">/ month</span>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-1.5 text-[#4a4a4a] text-sm">
            <Icons.Bed className="w-4 h-4" />
            <span>{total_flats} flats</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#4a4a4a] text-sm">
            <Icons.Users className="w-4 h-4" />
            <span>Shared</span>
          </div>
        </div>

        {rulesPreview && (
          <p className="text-[#4a4a4a] text-sm mb-4 line-clamp-2">{rulesPreview}</p>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            to={`/property/${id}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#1E88E5] rounded-lg hover:bg-[#1565C0] transition-all shadow-sm"
          >
            View Details
            <Icons.ChevronRight className="w-4 h-4" />
          </Link>
          <a
            href={getCallLink('9876543210')}
            className="px-4 py-2.5 text-sm font-medium text-[#1E88E5] border border-[#1E88E5]/30 rounded-lg hover:bg-blue-50 transition-colors"
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
function FeatureCard({ icon: Icon, title, description, color }) {
  return (
    <div className="group relative p-6 rounded-xl bg-white border border-gray-200 hover:shadow-lg transition-all duration-300">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">{title}</h3>
      <p className="text-[#4a4a4a] text-sm leading-relaxed">{description}</p>
    </div>
  );
}

// ============================================================================
// STAT ITEM
// ============================================================================
function StatItem({ value, label }) {
  return (
    <div className="text-center">
      <p className="text-3xl md:text-4xl font-bold text-[#1E88E5] mb-1">
        {value}
      </p>
      <p className="text-[#4a4a4a] text-sm">{label}</p>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function HomePage() {
  const [selectedArea, setSelectedArea] = useState('All Areas');
  const { properties, loading, error } = useProperties(selectedArea, true);
  const { areas } = useAreas();
  const location = useLocation();

  // Scroll to hash section when navigating from another page
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [location.hash]);

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      {/* ================================================================== */}
      {/* HERO SECTION */}
      {/* ================================================================== */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #B3D4F0 0%, #C5DFF5 30%, #D4E6F6 70%, #D4E6F6 100%)' }}>
        {/* Decorative floating shapes */}
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-[#1E88E5]/[0.08] blur-2xl floating-shape" aria-hidden="true"></div>
        <div className="absolute top-20 right-16 w-48 h-48 rounded-full bg-[#42A5F5]/[0.10] blur-xl floating-shape-delayed" aria-hidden="true"></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-36 rounded-full bg-[#90CAF9]/20 blur-2xl" aria-hidden="true"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 lg:pt-28 lg:pb-36">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100">
              <Icons.Sparkles className="w-4 h-4 text-[#1E88E5]" />
              <span className="text-sm text-[#1a1a1a]">Trusted by 500+ professionals in Vadodara</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6">
            <span className="text-[#1a1a1a]">Premium PG Living in</span>
            <br />
            <span className="text-[#1E88E5]">
              Vadodara
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-[#4a4a4a] text-center max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience modern, safe, and affordable accommodation designed for students and working professionals.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/request-visit"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#5B9BD5] text-white rounded-xl font-semibold hover:bg-[#4A8AC4] transition-all shadow-md"
            >
              <Icons.Calendar className="w-5 h-5" />
              Schedule a Visit
            </Link>
            <a
              href="tel:+919876543210"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#1a1a1a] rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              <Icons.Phone className="w-5 h-5" />
              Call Us Now
            </a>
          </div>

          {/* Stats */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-8 md:gap-12 px-8 py-6 rounded-2xl bg-[#F5F5F5] border border-gray-200">
              <StatItem value="10+" label="Properties" />
              <div className="w-px h-10 bg-gray-200"></div>
              <StatItem value="200+" label="Happy Tenants" />
              <div className="w-px h-10 bg-gray-200 hidden md:block"></div>
              <div className="hidden md:block">
                <StatItem value="5★" label="Rating" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wave Divider: Hero → Features */}
      <div className="relative -mt-px bg-[#D4E6F6]" aria-hidden="true">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10 md:h-14 block" preserveAspectRatio="none">
          <path d="M0 0L60 5C120 10 240 20 360 25C480 30 600 30 720 27C840 24 960 18 1080 14C1200 10 1320 8 1380 7L1440 6V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0V0Z" fill="#FFFFFF" />
        </svg>
      </div>

      {/* ================================================================== */}
      {/* FEATURES SECTION */}
      {/* ================================================================== */}
      <section id="about" className="relative py-24 scroll-mt-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4">
              Why Choose Swami PG?
            </h2>
            <p className="text-[#4a4a4a] max-w-2xl mx-auto">
              We provide more than just a place to stay. Experience comfort, security, and community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={Icons.Shield}
              title="Safe & Secure"
              description="24/7 CCTV surveillance and security personnel for your peace of mind."
              color="from-[#E8F0FE] to-[#D4E4F7] text-[#5B9BD5]"
            />
            <FeatureCard
              icon={Icons.Home}
              title="Fully Furnished"
              description="Comfortable beds, storage, and all essential amenities included."
              color="from-[#E8F0FE] to-[#D4E4F7] text-[#5B9BD5]"
            />
            <FeatureCard
              icon={Icons.Wifi}
              title="High-Speed WiFi"
              description="Unlimited high-speed internet for work and entertainment."
              color="from-[#E8F0FE] to-[#D4E4F7] text-[#5B9BD5]"
            />
            <FeatureCard
              icon={Icons.Currency}
              title="Transparent Pricing"
              description="No hidden charges. Clear billing with utility breakdown."
              color="from-[#E8F0FE] to-[#D4E4F7] text-[#5B9BD5]"
            />
          </div>
        </div>
      </section>

      {/* Wave Divider: Features → Properties */}
      <div className="relative -mt-px bg-[#D4E6F6]" aria-hidden="true">
        <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-8 md:h-12 block" preserveAspectRatio="none">
          <path d="M0 50L48 45C96 40 192 30 288 24C384 18 480 16 576 18C672 20 768 26 864 30C960 34 1056 36 1152 34C1248 32 1344 26 1392 23L1440 20V0H1392C1344 0 1248 0 1152 0C1056 0 960 0 864 0C768 0 672 0 576 0C480 0 384 0 288 0C192 0 96 0 48 0H0V50Z" fill="#FFFFFF" />
        </svg>
      </div>

      {/* ================================================================== */}
      {/* PROPERTIES SECTION */}
      {/* ================================================================== */}
      <section id="properties" className="relative py-24 scroll-mt-14 overflow-hidden bg-[#D4E6F6]">
        {/* Subtle blue accent gradient on left edge */}
        <div className="absolute top-0 left-0 w-1.5 md:w-2 h-full bg-gradient-to-b from-transparent via-[#1E88E5]/20 to-transparent" aria-hidden="true"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header with Filter */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-2">
                Our Properties
              </h2>
              <p className="text-[#4a4a4a]">
                {selectedArea === 'All Areas'
                  ? 'Browse all available properties'
                  : `Properties in ${selectedArea}`}
                <span className="text-[#4a4a4a] ml-2">({properties.length} found)</span>
              </p>
            </div>

            {/* Area Filter */}
            <div className="flex items-center gap-3">
              <span className="text-[#4a4a4a] text-sm">Filter by area:</span>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/30 focus:border-[#1E88E5] transition-all min-w-[180px] shadow-sm"
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
              <p className="text-[#4a4a4a] mt-4">Loading properties...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Icons.Building className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-red-500">Error loading properties: {error}</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Icons.Building className="w-8 h-8 text-[#4a4a4a]" />
              </div>
              <p className="text-[#4a4a4a]">No properties found in this area.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================================================================== */}
      {/* HOW IT WORKS SECTION */}
      {/* ================================================================== */}
      <section className="relative py-24 overflow-hidden bg-white">
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#1E88E5]/[0.05] blur-xl" aria-hidden="true"></div>
        <div className="absolute -bottom-20 -left-10 w-48 h-48 rounded-full bg-[#42A5F5]/[0.05] blur-xl" aria-hidden="true"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4">
              How It Works
            </h2>
            <p className="text-[#4a4a4a] max-w-2xl mx-auto">
              Getting started is simple. Follow these steps to find your perfect PG.
            </p>
          </div>

          {/* Step connector line (desktop) */}
          <div className="hidden md:block absolute top-[13.5rem] left-1/2 -translate-x-1/2 w-2/3 border-t-2 border-dashed border-[#1E88E5]/15" aria-hidden="true"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              { step: '01', title: 'Browse Properties', description: 'Explore our curated list of premium PG accommodations across Vadodara.' },
              { step: '02', title: 'Schedule a Visit', description: 'Book a convenient time to visit and see the property in person.' },
              { step: '03', title: 'Move In', description: 'Complete simple documentation and move into your new home.' }
            ].map((item, index) => (
              <div key={index} className="relative bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/80 shadow-sm">
                <div className="text-6xl font-bold text-[#5B9BD5]/90 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">{item.title}</h3>
                <p className="text-[#4a4a4a]">{item.description}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 -right-4 text-[#1E88E5]/30 z-10">
                    <Icons.ArrowRight className="w-8 h-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* REVIEWS SECTION */}
      {/* ================================================================== */}
      <section id="reviews" className="relative py-24 scroll-mt-14 overflow-hidden bg-[#D4E6F6]">
        {/* Decorative accent */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[#1E88E5]/[0.04] blur-3xl" aria-hidden="true"></div>
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-[#42A5F5]/[0.04] blur-3xl" aria-hidden="true"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4">
              What Our Tenants Say
            </h2>
            <p className="text-[#4a4a4a] max-w-2xl mx-auto">
              Real experiences from our happy residents
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Rahul S.', rating: 5, text: 'Best PG in Vadodara! Clean rooms, great food, and the management is very responsive. Highly recommend Swami PG.', property: 'Gotri' },
              { name: 'Priya M.', rating: 5, text: 'I have been staying here for 6 months and it feels like home. The staff is friendly and the facilities are well maintained.', property: 'Akota' },
              { name: 'Amit K.', rating: 4, text: 'Good location, reasonable rent, and transparent billing. The online portal for bills is very convenient.', property: 'Alkapuri' }
            ].map((review, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-[#1a1a1a] mb-4 leading-relaxed">"{review.text}"</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <p className="font-semibold text-[#1a1a1a]">{review.name}</p>
                  <span className="text-xs font-medium text-[#1E88E5] bg-blue-50 px-2 py-1 rounded-full">{review.property}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* CTA SECTION */}
      {/* ================================================================== */}
      <section className="relative py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#3A6FA0] to-[#2D5F8A]"></div>

            {/* Content */}
            <div className="relative px-8 py-16 md:px-16 text-center">
              <h2 className="text-4xl md:text-4xl font-bold text-white mb-4">
                Ready to Find Your New Home?
              </h2>
              <p className="text-lg text-white mb-8 max-w-xl mx-auto">
                Schedule a visit today and experience the Swami PG difference. Our team is ready to welcome you!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/request-visit"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#5B9BD5] rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg"
                >
                  <Icons.Calendar className="w-5 h-5" />
                  Schedule Your Visit
                </Link>
                <a
                  href="tel:+919876543210"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/20 text-white rounded-xl font-semibold border border-white/40 hover:bg-white/30 transition-colors"
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
          className="flex items-center justify-center gap-2 w-full py-4 bg-[#5B9BD5] text-white rounded-xl font-semibold shadow-lg"
        >
          <Icons.Calendar className="w-5 h-5" />
          Schedule a Visit
        </Link>
      </div>
    </div>
  );
}
