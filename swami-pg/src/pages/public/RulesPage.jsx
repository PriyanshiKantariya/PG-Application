import { Link } from 'react-router-dom';

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icons = {
    Check: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
    ),
    Calendar: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    Shield: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    ),
    ArrowLeft: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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
        'No smoking inside the premises',
        'No alcohol, tobacco, or drugs allowed',
        'Quiet hours: 10 PM – 7 AM',
        'Maintain cleanliness in common areas',
        'No overnight guests without prior permission',
        'Always lock your room when leaving',
        'Switch off lights & fans when not in use',
        'Rent due by 7th of every month',
    ];

    return (
        <div className="bg-[#F5F5F5] min-h-screen">
            {/* ── Hero Header ── */}
            <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #B3D4F0 0%, #C5DFF5 40%, #D4E6F6 100%)' }}>
                <div className="absolute top-10 right-10 w-48 h-48 rounded-full bg-[#1E88E5]/[0.06] blur-2xl" aria-hidden="true"></div>
                <div className="absolute bottom-0 left-16 w-56 h-56 rounded-full bg-[#42A5F5]/[0.08] blur-2xl" aria-hidden="true"></div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm text-[#4a4a4a] hover:text-[#1E88E5] transition-colors mb-8"
                    >
                        <Icons.ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] mb-4">
                        Facilities & <span className="text-[#1E88E5]">House Rules</span>
                    </h1>
                    <p className="text-lg text-[#4a4a4a] max-w-xl mx-auto leading-relaxed">
                        Everything you need to know for a comfortable and peaceful stay at Swami PG.
                    </p>
                </div>
            </section>

            {/* Wave Divider */}
            <div className="relative -mt-px bg-[#D4E6F6]" aria-hidden="true">
                <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10 md:h-14 block" preserveAspectRatio="none">
                    <path d="M0 0L60 5C120 10 240 20 360 25C480 30 600 30 720 27C840 24 960 18 1080 14C1200 10 1320 8 1380 7L1440 6V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0V0Z" fill="#FFFFFF" />
                </svg>
            </div>

            {/* ── Main Content ── */}
            <section className="bg-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

                    {/* ── Facilities ── */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8F0FE] to-[#D4E4F7] flex items-center justify-center">
                                <Icons.Check className="w-5 h-5 text-[#5B9BD5]" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-[#1a1a1a]">Facilities Provided</h2>
                                <p className="text-sm text-[#4a4a4a]">Amenities available at all our properties</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0">
                            {facilities.map((item, index) => (
                                <div key={index} className="flex items-center gap-3 py-3.5 border-b border-gray-100 last:border-0">
                                    <svg className="w-5 h-5 text-[#43A047] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-[#1a1a1a] text-[15px]">{item}</span>
                                </div>
                            ))}
                        </div>

                        <p className="mt-4 text-sm text-[#757575] italic">
                            * Availability of certain facilities may vary by property location.
                        </p>
                    </div>

                    {/* Divider */}
                    <hr className="border-gray-200" />

                    {/* ── Eligibility ── */}
                    <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-[#E8F0FE] to-[#EEF4FB] rounded-xl border border-[#D4E4F7]">
                        <div className="w-10 h-10 rounded-xl bg-white/80 border border-[#D4E4F7] flex items-center justify-center flex-shrink-0">
                            <Icons.Shield className="w-5 h-5 text-[#5B9BD5]" />
                        </div>
                        <div>
                            <h3 className="font-bold text-[#1a1a1a] mb-1">Eligibility Criteria</h3>
                            <p className="text-[#4a4a4a] text-[15px] leading-relaxed">
                                Accommodation is available <strong className="text-[#1a1a1a]">only for male tenants</strong> who do not smoke, consume tobacco, or alcohol.
                            </p>
                        </div>
                    </div>

                    {/* Divider */}
                    <hr className="border-gray-200" />

                    {/* ── House Rules ── */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8F0FE] to-[#D4E4F7] flex items-center justify-center">
                                <svg className="w-5 h-5 text-[#5B9BD5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-[#1a1a1a]">House Rules</h2>
                                <p className="text-sm text-[#4a4a4a]">Guidelines for a respectful living environment</p>
                            </div>
                        </div>

                        <div className="space-y-0">
                            {houseRules.map((rule, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0"
                                >
                                    <span className="w-7 h-7 rounded-full bg-[#F5F5F5] border border-gray-200 flex items-center justify-center flex-shrink-0 text-xs font-semibold text-[#4a4a4a]">
                                        {index + 1}
                                    </span>
                                    <p className="text-[#1a1a1a] text-[15px]">{rule}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Wave Divider */}
            <div className="relative -mt-px bg-white" aria-hidden="true">
                <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-8 md:h-12 block" preserveAspectRatio="none">
                    <path d="M0 50L48 45C96 40 192 30 288 24C384 18 480 16 576 18C672 20 768 26 864 30C960 34 1056 36 1152 34C1248 32 1344 26 1392 23L1440 20V0H1392C1344 0 1248 0 1152 0C1056 0 960 0 864 0C768 0 672 0 576 0C480 0 384 0 288 0C192 0 96 0 48 0H0V50Z" fill="#D4E6F6" />
                </svg>
            </div>

            {/* ── CTA Section ── */}
            <section className="bg-[#D4E6F6] py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative rounded-2xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#3A6FA0] to-[#2D5F8A]"></div>
                        <div className="relative px-8 py-14 md:px-16 text-center">
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                                Ready to Join Swami PG?
                            </h3>
                            <p className="text-white/80 mb-8 max-w-md mx-auto">
                                Schedule a visit to see our facilities and find the perfect room for you.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/request-visit"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-[#5B9BD5] rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg"
                                >
                                    <Icons.Calendar className="w-5 h-5" />
                                    Schedule a Visit
                                </Link>
                                <Link
                                    to="/#properties"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/15 text-white rounded-xl font-semibold border border-white/30 hover:bg-white/25 transition-colors"
                                >
                                    Browse Properties
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
