import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProperty } from '../../hooks/useProperties';
import { LoadingSpinner } from '../../components/common';
import { formatCurrency, getCallLink, getWhatsAppLink, getGoogleMapsLink } from '../../utils/helpers';

// ============================================================================
// ICONS
// ============================================================================
const Icons = {
  ArrowLeft: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
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
  Calendar: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  WhatsApp: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
  Bed: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v11a1 1 0 001 1h16a1 1 0 001-1V7M3 7l9-4 9 4M3 7v4h18V7" />
    </svg>
  ),
  Building: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  Users: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Shield: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Wifi: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
    </svg>
  ),
  Droplet: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21c-4.97 0-9-4.03-9-9 0-3.53 5.1-8.9 7.59-11.18a1.87 1.87 0 012.82 0C15.9 3.1 21 8.47 21 12c0 4.97-4.03 9-9 9z" />
    </svg>
  ),
  Zap: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Check: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  ExternalLink: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  ),
  ChevronLeft: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  ChevronRight: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
};

// ============================================================================
// IMAGE GALLERY — PREMIUM
// ============================================================================
function ImageGallery({ images, propertyName }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const sortedImages = [...(images || [])].sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));
  const hasImages = sortedImages.length > 0;

  if (!hasImages) {
    return (
      <div className="relative rounded-2xl overflow-hidden h-72 md:h-[28rem] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #B3D4F0 0%, #C5DFF5 50%, #D4E6F6 100%)' }}>
        <div className="text-center relative z-10">
          <div className="w-24 h-24 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 shadow-sm border border-white/40">
            <span className="text-5xl font-bold text-[#5B9BD5]">{propertyName?.charAt(0) || 'P'}</span>
          </div>
          <p className="text-[#4a4a4a] text-sm">No photos available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative rounded-2xl overflow-hidden h-72 md:h-[28rem] bg-gray-100 group">
        <img
          src={sortedImages[activeIndex]?.url}
          alt={`${propertyName} - Image ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

        {/* Navigation */}
        {sortedImages.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex(prev => prev === 0 ? sortedImages.length - 1 : prev - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 hover:bg-white text-[#1a1a1a] rounded-full flex items-center justify-center transition-all shadow-lg opacity-0 group-hover:opacity-100 hover:scale-110"
            >
              <Icons.ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveIndex(prev => prev === sortedImages.length - 1 ? 0 : prev + 1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 hover:bg-white text-[#1a1a1a] rounded-full flex items-center justify-center transition-all shadow-lg opacity-0 group-hover:opacity-100 hover:scale-110"
            >
              <Icons.ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Counter Badge */}
        <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/50 text-white text-sm rounded-full backdrop-blur-md font-medium">
          {activeIndex + 1} / {sortedImages.length}
        </div>
      </div>

      {/* Thumbnails */}
      {sortedImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {sortedImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 ${index === activeIndex
                ? 'border-[#1E88E5] ring-2 ring-[#1E88E5]/25 scale-105'
                : 'border-transparent hover:border-gray-300 opacity-70 hover:opacity-100'
                }`}
            >
              <img src={image.url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// AMENITY BADGE
// ============================================================================
function AmenityBadge({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-3 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#5B9BD5]/30 transition-all duration-200">
      <div className="w-9 h-9 rounded-lg bg-[#D4E6F6] flex items-center justify-center flex-shrink-0">
        <Icon className="w-4.5 h-4.5 text-[#5B9BD5]" />
      </div>
      <span className="text-sm font-medium text-[#1a1a1a]">{label}</span>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function PropertyDetailPage() {
  const { propertyId } = useParams();
  const { property, loading, error } = useProperty(propertyId);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="text-[#4a4a4a] mt-4 text-sm">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
            <Icons.Building className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">Property Not Found</h2>
          <p className="text-[#4a4a4a] mb-6">{error || 'The property you are looking for does not exist or may have been removed.'}</p>
          <Link to="/properties" className="inline-flex items-center gap-2 px-6 py-3 bg-[#5B9BD5] text-white rounded-xl font-medium hover:bg-[#4A8AC4] transition-colors shadow-sm">
            <Icons.ArrowLeft className="w-4 h-4" />
            Browse Properties
          </Link>
        </div>
      </div>
    );
  }

  const isAvailable = property.available_beds > 0;
  const hasSharingOptions = property.sharing_options?.length > 0;
  const lowestPrice = hasSharingOptions
    ? Math.min(...property.sharing_options.map(s => s.price))
    : property.default_rent;

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      {/* ================================================================ */}
      {/* HERO HEADER */}
      {/* ================================================================ */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-[#4a4a4a] hover:text-[#1E88E5] transition-colors text-sm font-medium"
          >
            <Icons.ArrowLeft className="w-4 h-4" />
            Back to Properties
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ================================================================ */}
        {/* GALLERY + QUICK INFO SIDE-BY-SIDE ON DESKTOP */}
        {/* ================================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-10">
          {/* Gallery — 3 cols */}
          <div className="lg:col-span-3">
            <ImageGallery images={property.images} propertyName={property.name} />
          </div>

          {/* Quick Info Sidebar — 2 cols */}
          <div className="lg:col-span-2 space-y-5">
            {/* Property Title Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              {/* Availability Badge */}
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mb-4 ${isAvailable
                ? 'bg-green-50 text-[#2E7D32] border border-green-200'
                : 'bg-red-50 text-[#C62828] border border-red-200'
                }`}>
                <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-[#43A047] animate-pulse' : 'bg-red-500'}`}></div>
                {isAvailable ? `${property.available_beds} Flats Available` : 'Fully Occupied'}
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-2">{property.name}</h1>

              <div className="flex items-center gap-2 text-[#4a4a4a] mb-5">
                <Icons.MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{property.area}{property.landmark && ` • ${property.landmark}`}</span>
              </div>

              {/* Price Highlight */}
              <div className="bg-[#D4E6F6] rounded-xl p-4 mb-5">
                <p className="text-xs text-[#4a4a4a] font-medium mb-1">
                  {hasSharingOptions ? 'Starting from' : 'Monthly Rent'}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-[#5B9BD5]">{formatCurrency(lowestPrice)}</span>
                  <span className="text-[#4a4a4a] text-sm">/ month</span>
                </div>
                {property.default_deposit > 0 && (
                  <p className="text-xs text-[#4a4a4a] mt-1.5">
                    Deposit: {formatCurrency(property.default_deposit)} (Refundable)
                  </p>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center py-3 bg-[#F5F5F5] rounded-xl">
                  <p className="text-lg font-bold text-[#1a1a1a]">{property.total_flats}</p>
                  <p className="text-xs text-[#4a4a4a]">Total Flats</p>
                </div>
                <div className="text-center py-3 bg-[#F5F5F5] rounded-xl">
                  <p className="text-lg font-bold text-[#1a1a1a]">{property.occupied_beds}</p>
                  <p className="text-xs text-[#4a4a4a]">Occupied</p>
                </div>
                <div className="text-center py-3 bg-[#F5F5F5] rounded-xl">
                  <p className={`text-lg font-bold ${isAvailable ? 'text-[#43A047]' : 'text-red-500'}`}>
                    {property.available_beds}
                  </p>
                  <p className="text-xs text-[#4a4a4a]">Available</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:block space-y-3">
              <Link
                to={`/request-visit?property=${propertyId}`}
                className="flex items-center justify-center gap-2.5 w-full px-6 py-3.5 bg-[#5B9BD5] text-white rounded-xl font-semibold hover:bg-[#4A8AC4] transition-colors shadow-md hover:shadow-lg"
              >
                <Icons.Calendar className="w-5 h-5" />
                Schedule a Visit
              </Link>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={getCallLink('7575866048')}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl font-medium text-[#1a1a1a] hover:border-[#5B9BD5]/30 hover:bg-[#D4E6F6]/40 transition-all shadow-sm"
                >
                  <Icons.Phone className="w-4 h-4 text-[#5B9BD5]" />
                  Call Us
                </a>
                <a
                  href={getWhatsAppLink('7575866048', `Hi, I'm interested in ${property.name}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] text-white rounded-xl font-medium hover:bg-[#1fb855] transition-colors shadow-sm"
                >
                  <Icons.WhatsApp className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* SHARING OPTIONS */}
        {/* ================================================================ */}
        {hasSharingOptions && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-5 flex items-center gap-2">
              <Icons.Users className="w-5 h-5 text-[#5B9BD5]" />
              Room Sharing & Pricing
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {property.sharing_options.map((option, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-lg hover:border-[#5B9BD5]/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-[#D4E6F6] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-xl font-bold text-[#5B9BD5]">{option.sharing}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[#1a1a1a] text-lg">{option.sharing} Sharing</p>
                      <p className="text-xs text-[#4a4a4a]">per person / month</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#5B9BD5]">{formatCurrency(option.price)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* AMENITIES */}
        {/* ================================================================ */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#1a1a1a] mb-5 flex items-center gap-2">
            <Icons.Check className="w-5 h-5 text-[#5B9BD5]" />
            Amenities & Services
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <AmenityBadge icon={Icons.Wifi} label="High-Speed WiFi" />
            <AmenityBadge icon={Icons.Shield} label="24/7 Security" />
            <AmenityBadge icon={Icons.Droplet} label="24/7 Water Supply" />
            <AmenityBadge icon={Icons.Zap} label="Power Backup" />
            <AmenityBadge icon={Icons.Bed} label="Furnished Rooms" />
            <AmenityBadge icon={Icons.Building} label="Lift Access" />
            <AmenityBadge icon={Icons.Users} label="Common Area" />
            <AmenityBadge icon={Icons.Phone} label="Intercom System" />
          </div>
        </div>

        {/* ================================================================ */}
        {/* RENT & LOCATION ROW */}
        {/* ================================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Rent Breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1a1a1a] mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#5B9BD5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Rent & Deposit
            </h2>
            <div className="space-y-0">
              {[
                { label: 'Monthly Rent', value: formatCurrency(property.default_rent), highlight: true },
                { label: 'Security Deposit', value: formatCurrency(property.default_deposit), sub: 'Refundable' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-3.5 border-b border-gray-50 last:border-b-0">
                  <div>
                    <span className="text-[#4a4a4a] text-sm">{item.label}</span>
                    {item.sub && <span className="text-xs text-[#4a4a4a] ml-1.5">({item.sub})</span>}
                  </div>
                  <span className={`font-bold ${item.highlight ? 'text-[#5B9BD5] text-lg' : 'text-[#1a1a1a]'}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1a1a1a] mb-5 flex items-center gap-2">
              <Icons.MapPin className="w-5 h-5 text-[#5B9BD5]" />
              Location
            </h2>
            <p className="text-[#4a4a4a] mb-2 leading-relaxed">{property.address}</p>
            {property.landmark && (
              <p className="text-sm text-[#4a4a4a] mb-5">
                <span className="font-medium text-[#1a1a1a]">Landmark:</span> {property.landmark}
              </p>
            )}
            <a
              href={getGoogleMapsLink(property.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D4E6F6]/50 text-[#1a1a1a] rounded-xl text-sm font-medium hover:bg-[#D4E6F6] transition-colors border border-[#B3D4F0]"
            >
              <Icons.MapPin className="w-4 h-4 text-[#5B9BD5]" />
              View on Google Maps
              <Icons.ExternalLink className="w-3.5 h-3.5 text-[#4a4a4a]" />
            </a>
          </div>
        </div>

        {/* ================================================================ */}
        {/* BOTTOM CTA — DESKTOP */}
        {/* ================================================================ */}
        <div className="hidden lg:block rounded-2xl p-8 text-center mb-8 border border-[#B3D4F0]" style={{ background: 'linear-gradient(135deg, #B3D4F0 0%, #C5DFF5 50%, #D4E6F6 100%)' }}>
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Interested in {property.name}?</h2>
          <p className="text-[#4a4a4a] mb-6">Schedule a visit to see this property in person. Our team is ready to help.</p>
          <div className="flex justify-center gap-4">
            <Link
              to={`/request-visit?property=${propertyId}`}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#5B9BD5] text-white rounded-xl font-semibold hover:bg-[#4A8AC4] transition-colors shadow-md"
            >
              <Icons.Calendar className="w-5 h-5" />
              Schedule a Visit
            </Link>
            <a
              href={getCallLink('7575866048')}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#1a1a1a] rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Icons.Phone className="w-5 h-5" />
              Call Now
            </a>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* FIXED MOBILE CTA BAR */}
      {/* ================================================================ */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-50">
        <div className="max-w-lg mx-auto flex gap-2.5">
          <a
            href={getCallLink('7575866048')}
            className="flex items-center justify-center gap-1.5 px-4 py-3 bg-white border border-gray-200 rounded-xl font-medium text-[#1a1a1a] shadow-sm"
          >
            <Icons.Phone className="w-4 h-4 text-[#5B9BD5]" />
          </a>
          <a
            href={getWhatsAppLink('7575866048', `Hi, I'm interested in ${property.name}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-4 py-3 bg-[#25D366] text-white rounded-xl font-medium shadow-sm"
          >
            <Icons.WhatsApp className="w-4 h-4" />
          </a>
          <Link
            to={`/request-visit?property=${propertyId}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#5B9BD5] text-white rounded-xl font-semibold shadow-md hover:bg-[#4A8AC4] transition-colors"
          >
            <Icons.Calendar className="w-4 h-4" />
            Schedule Visit
          </Link>
        </div>
      </div>

      {/* Mobile spacer */}
      <div className="h-20 lg:hidden" />
    </div>
  );
}
