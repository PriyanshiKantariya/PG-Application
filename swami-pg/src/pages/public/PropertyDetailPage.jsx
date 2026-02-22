import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProperty } from '../../hooks/useProperties';
import { LoadingSpinner } from '../../components/common';
import { formatCurrency, getCallLink, getWhatsAppLink, getGoogleMapsLink } from '../../utils/helpers';

// Image Gallery Component
function ImageGallery({ images, propertyName }) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Sort images so primary is first
  const sortedImages = [...(images || [])].sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));
  const hasImages = sortedImages.length > 0;

  if (!hasImages) {
    return (
      <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl h-64 md:h-80 flex items-center justify-center mb-8">
        <div className="text-center text-white">
          <span className="text-6xl font-bold">{propertyName?.charAt(0) || 'P'}</span>
          <p className="mt-2 text-slate-400">No photos available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 space-y-3">
      {/* Main Image */}
      <div className="relative rounded-xl overflow-hidden h-64 md:h-96 bg-slate-800">
        <img
          src={sortedImages[activeIndex]?.url}
          alt={`${propertyName} - Image ${activeIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation Arrows */}
        {sortedImages.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex(prev => prev === 0 ? sortedImages.length - 1 : prev - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setActiveIndex(prev => prev === sortedImages.length - 1 ? 0 : prev + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-slate-900/70 text-white text-sm rounded-lg backdrop-blur-sm">
          {activeIndex + 1} / {sortedImages.length}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {sortedImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {sortedImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                index === activeIndex 
                  ? 'border-cyan-400 ring-2 ring-cyan-400/30' 
                  : 'border-slate-600 hover:border-slate-500'
              }`}
            >
              <img
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PropertyDetailPage() {
  const { propertyId } = useParams();
  const { property, loading, error } = useProperty(propertyId);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Property Not Found</h2>
          <p className="text-slate-400 mb-4">{error || 'The property you are looking for does not exist.'}</p>
          <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            ← Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const rules = property.rules_text ? property.rules_text.split('\n').filter(r => r.trim()) : [];

  return (
    <div className="py-8 bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-slate-400 hover:text-cyan-400 transition-colors mb-6"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Properties
        </Link>

        {/* Property Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{property.name}</h1>
          <p className="text-lg text-slate-400">{property.area} {property.landmark && `• ${property.landmark}`}</p>
        </div>

        {/* Photo Gallery */}
        <ImageGallery images={property.images} propertyName={property.name} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* House Rules */}
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">House Rules</h2>
            {rules.length > 0 ? (
              <ul className="space-y-2">
                {rules.map((rule, index) => (
                  <li key={index} className="flex items-start text-slate-300">
                    <span className="text-cyan-400 mr-2">•</span>
                    {rule.replace(/^- /, '')}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500">No rules specified.</p>
            )}
          </div>

          {/* Rent & Deposit */}
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Rent & Deposit</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                <span className="text-slate-400">Monthly Rent</span>
                <span className="text-xl font-bold text-cyan-400">
                  {formatCurrency(property.default_rent)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                <span className="text-slate-400">Deposit (Refundable)</span>
                <span className="font-semibold text-white">
                  {formatCurrency(property.default_deposit)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                <span className="text-slate-400">Total Beds</span>
                <span className="font-semibold text-white">{property.total_beds}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                <span className="text-slate-400">Occupied</span>
                <span className="font-semibold text-white">{property.occupied_beds}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-400">Available</span>
                <span className={`font-bold ${property.available_beds > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {property.available_beds}
                </span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 p-6 md:col-span-2">
            <h2 className="text-xl font-semibold text-white mb-4">Location</h2>
            <p className="text-slate-300 mb-4">{property.address}</p>
            <a
              href={getGoogleMapsLink(property.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              View on Google Maps
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700/50 p-4 md:relative md:border-0 md:bg-transparent md:p-0 md:mt-8">
          <div className="max-w-4xl mx-auto flex gap-3">
            <a
              href={getCallLink('9876543210')}
              className="flex-1 px-6 py-3 text-center font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-colors shadow-lg shadow-cyan-500/25"
            >
              📞 Call
            </a>
            <a
              href={getWhatsAppLink('9876543210', `Hi, I'm interested in ${property.name}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-6 py-3 text-center font-medium text-white bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg hover:from-emerald-400 hover:to-green-500 transition-colors shadow-lg shadow-emerald-500/25"
            >
              💬 WhatsApp
            </a>
            <Link
              to={`/request-visit?property=${propertyId}`}
              className="flex-1 px-6 py-3 text-center font-medium text-cyan-400 border-2 border-cyan-500/50 rounded-lg hover:bg-cyan-500/10 transition-colors"
            >
              Request a Visit
            </Link>
          </div>
        </div>

        {/* Spacer for fixed bottom bar on mobile */}
        <div className="h-20 md:hidden" />
      </div>
    </div>
  );
}
