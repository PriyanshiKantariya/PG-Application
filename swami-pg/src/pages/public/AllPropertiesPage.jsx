import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProperties, useAreas } from '../../hooks/useProperties';
import { LoadingSpinner } from '../../components/common';
import { formatCurrency, getCallLink } from '../../utils/helpers';

// ============================================================================
// ICONS
// ============================================================================
const Icons = {
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
    Phone: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
    ),
    ChevronRight: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
    Calendar: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    ArrowLeft: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
    ),
    Search: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    )
};

// ============================================================================
// PROPERTY CARD
// ============================================================================
function PropertyCard({ property }) {
    const { id, name, area, default_rent, available_beds, total_flats, images } = property;
    const isAvailable = available_beds > 0;
    const primaryImage = images?.find(img => img.isPrimary) || images?.[0];
    const hasImage = primaryImage?.url;

    return (
        <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
            {/* Property Image */}
            <div className="relative h-48 bg-gradient-to-br from-[#5B9BD5] to-[#4A8AC4] flex items-center justify-center overflow-hidden">
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
                    <div className="relative z-10 w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white text-3xl font-bold">{name?.charAt(0) || 'P'}</span>
                    </div>
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
                    {property.sharing_options?.length > 0 ? (
                        <>
                            <span className="text-2xl font-bold text-[#1E88E5]">
                                {formatCurrency(Math.min(...property.sharing_options.map(s => s.price)))}
                            </span>
                            {property.sharing_options.length > 1 && (
                                <span className="text-[#4a4a4a] text-sm">
                                    – {formatCurrency(Math.max(...property.sharing_options.map(s => s.price)))}
                                </span>
                            )}
                            <span className="text-[#4a4a4a] text-sm">/ month</span>
                        </>
                    ) : (
                        <>
                            <span className="text-2xl font-bold text-[#1E88E5]">
                                {formatCurrency(default_rent)}
                            </span>
                            <span className="text-[#4a4a4a] text-sm">/ month</span>
                        </>
                    )}
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
// MAIN COMPONENT
// ============================================================================
export default function AllPropertiesPage() {
    const [selectedArea, setSelectedArea] = useState('All Areas');
    const [searchTerm, setSearchTerm] = useState('');
    const { properties, loading, error } = useProperties(selectedArea, false);
    const { areas } = useAreas();

    // Filter by search term
    const filteredProperties = properties.filter(property => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            (property.name || '').toLowerCase().includes(term) ||
            (property.area || '').toLowerCase().includes(term) ||
            (property.address || '').toLowerCase().includes(term)
        );
    });

    return (
        <div className="bg-[#F5F5F5] min-h-screen">
            {/* Hero Header */}
            <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #B3D4F0 0%, #C5DFF5 50%, #D4E6F6 100%)' }}>
                <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-[#1E88E5]/[0.08] blur-2xl" aria-hidden="true"></div>
                <div className="absolute top-20 right-16 w-48 h-48 rounded-full bg-[#42A5F5]/[0.10] blur-xl" aria-hidden="true"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-[#4a4a4a] hover:text-[#1E88E5] transition-colors mb-6"
                    >
                        <Icons.ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] mb-3">
                        All PG Properties
                    </h1>
                    <p className="text-lg text-[#4a4a4a] max-w-2xl mb-8">
                        Browse our complete collection of premium PG accommodations across Vadodara.
                    </p>

                    {/* Filters Row */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#4a4a4a]">
                                <Icons.Search className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name, area, or address..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/30 focus:border-[#1E88E5] transition-colors shadow-sm"
                            />
                        </div>

                        {/* Area Filter */}
                        <div className="sm:w-56">
                            <select
                                value={selectedArea}
                                onChange={(e) => setSelectedArea(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/30 focus:border-[#1E88E5] transition-colors shadow-sm"
                            >
                                {areas.map((area) => (
                                    <option key={area} value={area}>{area}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Wave Divider */}
            <div className="relative -mt-px bg-[#D4E6F6]" aria-hidden="true">
                <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10 md:h-14 block" preserveAspectRatio="none">
                    <path d="M0 0L60 5C120 10 240 20 360 25C480 30 600 30 720 27C840 24 960 18 1080 14C1200 10 1320 8 1380 7L1440 6V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0V0Z" fill="#F5F5F5" />
                </svg>
            </div>

            {/* Properties Grid */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Results Count */}
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-[#4a4a4a]">
                            <span className="font-semibold text-[#1a1a1a]">{filteredProperties.length}</span> {filteredProperties.length === 1 ? 'property' : 'properties'} found
                            {selectedArea !== 'All Areas' && <span> in <span className="font-medium text-[#1E88E5]">{selectedArea}</span></span>}
                        </p>
                        <Link
                            to="/request-visit"
                            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#5B9BD5] rounded-lg hover:bg-[#4A8AC4] transition-colors shadow-sm"
                        >
                            <Icons.Calendar className="w-4 h-4" />
                            Schedule a Visit
                        </Link>
                    </div>

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
                    ) : filteredProperties.length === 0 ? (
                        <div className="py-20 text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                <Icons.Building className="w-8 h-8 text-[#4a4a4a]" />
                            </div>
                            <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">No Properties Found</h3>
                            <p className="text-[#4a4a4a] mb-4">
                                {searchTerm
                                    ? 'No properties match your search. Try a different term.'
                                    : 'No properties found in this area.'}
                            </p>
                            {(searchTerm || selectedArea !== 'All Areas') && (
                                <button
                                    onClick={() => { setSearchTerm(''); setSelectedArea('All Areas'); }}
                                    className="text-[#1E88E5] hover:text-[#1565C0] font-medium"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProperties.map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-12 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-4">
                        Found Your Perfect PG?
                    </h2>
                    <p className="text-[#4a4a4a] mb-6">
                        Schedule a visit to see any property in person. Our team is ready to help.
                    </p>
                    <Link
                        to="/request-visit"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-[#5B9BD5] text-white rounded-xl font-semibold hover:bg-[#4A8AC4] transition-all shadow-md"
                    >
                        <Icons.Calendar className="w-5 h-5" />
                        Schedule a Visit
                    </Link>
                </div>
            </section>

            {/* Floating Mobile CTA */}
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
