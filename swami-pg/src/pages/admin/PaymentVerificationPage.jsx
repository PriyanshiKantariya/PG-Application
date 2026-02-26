import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { LoadingSpinner } from '../../components/common';
import { GOOGLE_FORMS } from '../../utils/constants';

// ============================================================================
// ICONS
// ============================================================================
const Icons = {
    Search: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    ),
    Receipt: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
    ),
    User: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    ),
    Building: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    ),
    Calendar: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    Check: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    ),
    X: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
    AlertCircle: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    ExternalLink: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
    ),
    CheckCircle: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    CurrencyRupee: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    Shield: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    )
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount || 0);
};

const getMonthName = (month) => {
    const months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month] || '';
};

const formatDate = (date) => {
    if (!date) return '-';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function PaymentVerificationPage() {
    const [bills, setBills] = useState([]);
    const [tenants, setTenants] = useState({});
    const [properties, setProperties] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProperty, setSelectedProperty] = useState('all');
    const [updatingBillId, setUpdatingBillId] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch data
    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);
        setError('');

        try {
            // Fetch all bills
            const billsSnap = await getDocs(collection(db, 'bills'));
            const allBills = billsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

            // Filter only ReportedPaid bills
            const reportedBills = allBills.filter(b => b.status === 'ReportedPaid');
            reportedBills.sort((a, b) => {
                if (b.year !== a.year) return b.year - a.year;
                return b.month - a.month;
            });
            setBills(reportedBills);

            // Fetch tenants
            const tenantsSnap = await getDocs(collection(db, 'tenants'));
            const tenantsMap = {};
            tenantsSnap.docs.forEach(d => {
                tenantsMap[d.id] = { id: d.id, ...d.data() };
            });
            setTenants(tenantsMap);

            // Fetch properties
            const propertiesSnap = await getDocs(collection(db, 'properties'));
            const propertiesMap = {};
            propertiesSnap.docs.forEach(d => {
                propertiesMap[d.id] = { id: d.id, ...d.data() };
            });
            setProperties(propertiesMap);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load payment verification data. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    // Verify payment (ReportedPaid → Paid)
    async function handleVerify(billId) {
        setUpdatingBillId(billId);
        try {
            await updateDoc(doc(db, 'bills', billId), {
                status: 'Paid',
                paid_at: serverTimestamp(),
                updated_at: serverTimestamp()
            });
            // Remove from list
            setBills(prev => prev.filter(b => b.id !== billId));
            setSuccessMessage('Payment verified successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Error verifying payment:', err);
            setError('Failed to verify payment. Please try again.');
        } finally {
            setUpdatingBillId(null);
        }
    }

    // Reject payment (ReportedPaid → Pending)
    async function handleReject(billId) {
        setUpdatingBillId(billId);
        try {
            await updateDoc(doc(db, 'bills', billId), {
                status: 'Pending',
                updated_at: serverTimestamp()
            });
            // Remove from list
            setBills(prev => prev.filter(b => b.id !== billId));
            setSuccessMessage('Payment rejected — bill set back to Pending.');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Error rejecting payment:', err);
            setError('Failed to reject payment. Please try again.');
        } finally {
            setUpdatingBillId(null);
        }
    }

    // Get Google Sheet link for payment proof
    function getPaymentProofLink(tenant) {
        const sheetUrl = GOOGLE_FORMS.paymentResponsesSheet;
        if (!sheetUrl || sheetUrl.includes('your-')) return null;
        return sheetUrl;
    }

    // Properties list for filter
    const propertiesList = useMemo(() => {
        return [
            { value: 'all', label: 'All Properties' },
            ...Object.values(properties).map(p => ({ value: p.id, label: p.name }))
        ];
    }, [properties]);

    // Filtered bills
    const filteredBills = useMemo(() => {
        return bills.filter(bill => {
            if (selectedProperty !== 'all' && bill.property_id !== selectedProperty) return false;
            if (searchQuery.trim()) {
                const tenant = tenants[bill.tenant_id];
                const tenantName = tenant?.name?.toLowerCase() || '';
                const tenantPhone = tenant?.phone || '';
                const tenantCode = tenant?.tenant_code?.toLowerCase() || '';
                const q = searchQuery.toLowerCase();
                if (!tenantName.includes(q) && !tenantPhone.includes(q) && !tenantCode.includes(q)) return false;
            }
            return true;
        });
    }, [bills, selectedProperty, searchQuery, tenants]);

    // Stats
    const totalAmount = useMemo(() => {
        return filteredBills.reduce((sum, b) => sum + (b.total_amount || 0), 0);
    }, [filteredBills]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <LoadingSpinner size="large" />
                <p className="text-[#4a4a4a]">Loading payment verifications...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                        <Icons.Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-[#1a1a1a]">Payment Verification</h1>
                        <p className="text-[#4a4a4a]">
                            Review and verify tenant payment submissions
                        </p>
                    </div>
                </div>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
                    <Icons.CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="text-green-700 text-sm font-medium">{successMessage}</p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                    <Icons.AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            {/* Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                            <Icons.AlertCircle className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <p className="text-2xl font-bold text-[#1a1a1a]">{filteredBills.length}</p>
                        <p className="text-sm text-[#4a4a4a] mt-0.5">Awaiting Verification</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <Icons.CurrencyRupee className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <p className="text-2xl font-bold text-[#1a1a1a]">{formatCurrency(totalAmount)}</p>
                        <p className="text-sm text-[#4a4a4a] mt-0.5">Total Reported Amount</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                            <Icons.Building className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <p className="text-2xl font-bold text-[#1a1a1a]">
                            {new Set(filteredBills.map(b => b.property_id)).size}
                        </p>
                        <p className="text-sm text-[#4a4a4a] mt-0.5">Properties with Pending Verifications</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a4a4a]" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by tenant name, phone, or code..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[#1a1a1a] placeholder:text-[#4a4a4a] focus:outline-none focus:ring-2 focus:ring-[#5B9BD5]/30 focus:border-[#5B9BD5]"
                        />
                    </div>
                    <select
                        value={selectedProperty}
                        onChange={(e) => setSelectedProperty(e.target.value)}
                        className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#5B9BD5]/30 focus:border-[#5B9BD5] min-w-[160px]"
                    >
                        {propertiesList.map(p => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Bills List */}
            {filteredBills.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icons.CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">All Caught Up!</h3>
                    <p className="text-[#4a4a4a] max-w-sm mx-auto">
                        No payments are awaiting verification right now. Check back when tenants report new payments.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredBills.map(bill => {
                        const tenant = tenants[bill.tenant_id];
                        const property = properties[bill.property_id];
                        const proofLink = getPaymentProofLink(tenant);
                        const isUpdating = updatingBillId === bill.id;

                        return (
                            <div
                                key={bill.id}
                                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-all"
                            >
                                <div className="p-5">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        {/* Tenant & Bill Info */}
                                        <div className="flex items-start gap-4 flex-1 min-w-0">
                                            <div className="w-11 h-11 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 border border-amber-200">
                                                <Icons.User className="w-5 h-5 text-amber-600" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="font-semibold text-[#1a1a1a]">{tenant?.name || 'Unknown Tenant'}</h3>
                                                    {tenant?.tenant_code && (
                                                        <span className="text-xs bg-gray-100 text-[#4a4a4a] px-2 py-0.5 rounded-full border border-gray-200">
                                                            {tenant.tenant_code}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 mt-1 text-sm text-[#4a4a4a] flex-wrap">
                                                    <span className="flex items-center gap-1">
                                                        <Icons.Building className="w-3.5 h-3.5" />
                                                        {property?.name || 'Unknown'}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Icons.Calendar className="w-3.5 h-3.5" />
                                                        {getMonthName(bill.month)} {bill.year}
                                                    </span>
                                                    {tenant?.phone && (
                                                        <span>{tenant.phone}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Amount */}
                                        <div className="flex-shrink-0 text-right lg:text-center lg:min-w-[120px]">
                                            <p className="text-xl font-bold text-[#1a1a1a]">{formatCurrency(bill.total_amount)}</p>
                                            <p className="text-xs text-[#4a4a4a]">Total Due</p>
                                        </div>
                                    </div>

                                    {/* Bill Breakdown */}
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                                            <div className="bg-[#F5F5F5] rounded-lg p-2.5">
                                                <p className="text-xs text-[#4a4a4a]">Rent</p>
                                                <p className="font-medium text-[#1a1a1a]">{formatCurrency(bill.rent_amount)}</p>
                                            </div>
                                            <div className="bg-[#F5F5F5] rounded-lg p-2.5">
                                                <p className="text-xs text-[#4a4a4a]">Electricity</p>
                                                <p className="font-medium text-[#1a1a1a]">{formatCurrency(bill.electricity_share)}</p>
                                            </div>
                                            <div className="bg-[#F5F5F5] rounded-lg p-2.5">
                                                <p className="text-xs text-[#4a4a4a]">Gas</p>
                                                <p className="font-medium text-[#1a1a1a]">{formatCurrency(bill.gas_share)}</p>
                                            </div>
                                            {bill.late_fee > 0 && (
                                                <div className="bg-red-50 rounded-lg p-2.5 border border-red-100">
                                                    <p className="text-xs text-red-600">Late Fee</p>
                                                    <p className="font-medium text-red-600">{formatCurrency(bill.late_fee)}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                        {/* Payment Proof Link */}
                                        {proofLink && (
                                            <a
                                                href={proofLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-[#5B9BD5] bg-blue-50 border border-blue-200 rounded-lg font-medium hover:bg-blue-100 transition-colors text-sm"
                                            >
                                                <Icons.ExternalLink className="w-4 h-4" />
                                                View Payment Proof
                                            </a>
                                        )}

                                        <div className="flex-1" />

                                        {/* Reject */}
                                        <button
                                            onClick={() => handleReject(bill.id)}
                                            disabled={isUpdating}
                                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-lg font-medium hover:bg-red-100 transition-colors disabled:opacity-50 text-sm"
                                        >
                                            {isUpdating ? <LoadingSpinner size="small" /> : <Icons.X className="w-4 h-4" />}
                                            Reject
                                        </button>

                                        {/* Verify */}
                                        <button
                                            onClick={() => handleVerify(bill.id)}
                                            disabled={isUpdating}
                                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-50 shadow-sm text-sm"
                                        >
                                            {isUpdating ? <LoadingSpinner size="small" /> : <Icons.Check className="w-4 h-4" />}
                                            Verify Payment
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
