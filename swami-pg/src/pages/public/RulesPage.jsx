import { Link } from 'react-router-dom';

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icons = {
    Check: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
    ),
    Building: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    ),
    Shield: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    ),
    Clipboard: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
    ),
    Warning: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
    ),
    Calendar: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    // Rule-specific icons
    NoSmoking: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
    ),
    Moon: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
    ),
    Clean: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
    ),
    User: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    ),
    Key: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
    ),
    Bulb: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
    ),
    CreditCard: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
    ),
};

export default function RulesPage() {
    const facilities = [
        'Fully furnished bed with mattress & pillow',
        'Steel cupboard (full height)',
        'Washing machine',
        'High-speed Wi-Fi (5G broadband)',
        'Refrigerator',
        'RO drinking water',
        'Electric geyser',
        'Electric induction facility',
        'Lift access',
        'Daily housekeeping',
    ];

    const houseRules = [
        { icon: Icons.NoSmoking, rule: 'No smoking inside the premises', color: 'text-red-500 bg-red-50' },
        { icon: Icons.NoSmoking, rule: 'No alcohol, tobacco, or drugs allowed', color: 'text-red-500 bg-red-50' },
        { icon: Icons.Moon, rule: 'Quiet hours: 10 PM – 7 AM', color: 'text-indigo-500 bg-indigo-50' },
        { icon: Icons.Clean, rule: 'Maintain cleanliness in common areas', color: 'text-teal-600 bg-teal-50' },
        { icon: Icons.User, rule: 'No overnight guests without prior permission', color: 'text-orange-500 bg-orange-50' },
        { icon: Icons.Key, rule: 'Always lock your room when leaving', color: 'text-amber-600 bg-amber-50' },
        { icon: Icons.Bulb, rule: 'Switch off lights & fans when not in use', color: 'text-yellow-600 bg-yellow-50' },
        { icon: Icons.CreditCard, rule: 'Rent due by 7th of every month', color: 'text-[#1E88E5] bg-blue-50' },
    ];

    return (
        <div className="bg-[#F5F5F5] min-h-screen">
            {/* Page Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-[#1E88E5] rounded-full text-sm font-medium mb-4">
                        <Icons.Building className="w-4 h-4" />
                        Swami PG
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-[#424242] mb-3">
                        Facilities & Rules
                    </h1>
                    <p className="text-[#757575] max-w-xl mx-auto text-lg">
                        Everything you need to know for a comfortable stay
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

                {/* ─── Facilities Section ─── */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <Icons.Building className="w-5 h-5 text-[#1E88E5]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-[#424242]">Facilities Provided</h2>
                            <p className="text-sm text-[#757575]">Amenities available at our properties</p>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
                            {facilities.map((item, index) => (
                                <div key={index} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                                    <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                                        <Icons.Check className="w-3.5 h-3.5 text-[#43A047]" />
                                    </div>
                                    <span className="text-[#424242]">{item}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-100 flex items-start gap-2">
                            <svg className="w-4 h-4 text-[#757575] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm text-[#757575]">
                                Availability of certain facilities may vary by property location.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ─── Eligibility Section ─── */}
                <div className="bg-white rounded-2xl border border-amber-200 overflow-hidden shadow-sm">
                    <div className="px-6 py-5 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                            <Icons.Shield className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-[#424242] mb-1">Eligibility Criteria</h2>
                            <p className="text-[#424242]">
                                Accommodation is available <strong>only for male tenants</strong> who do not smoke, consume tobacco, or alcohol.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ─── House Rules Section ─── */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                            <Icons.Clipboard className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-[#424242]">House Rules</h2>
                            <p className="text-sm text-[#757575]">Guidelines for a peaceful living environment</p>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {houseRules.map((item, index) => {
                                const IconComponent = item.icon;
                                return (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                                            <IconComponent className="w-5 h-5" />
                                        </div>
                                        <p className="text-sm font-medium text-[#424242]">{item.rule}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ─── CTA ─── */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
                    <h3 className="text-lg font-bold text-[#424242] mb-2">Have questions?</h3>
                    <p className="text-[#757575] mb-6">Schedule a visit to see our facilities in person</p>
                    <Link
                        to="/request-visit"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-[#1E88E5] text-white font-semibold rounded-xl hover:bg-[#1565C0] transition-all shadow-sm"
                    >
                        <Icons.Calendar className="w-5 h-5" />
                        Schedule a Visit
                    </Link>
                </div>
            </div>
        </div>
    );
}
