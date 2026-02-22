import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, query, where, orderBy, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { LoadingSpinner } from '../../components/common';

// ============================================================================
// ICONS
// ============================================================================
const Icons = {
  Search: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Filter: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
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
  Clock: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  AlertCircle: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  X: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
  ),
  Eye: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
  )
};

// ============================================================================
// CONSTANTS
// ============================================================================
const MONTHS = [
  { value: 0, label: 'All Months' },
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' }
];

const STATUSES = [
  { value: 'all', label: 'All Statuses' },
  { value: 'Pending', label: 'Pending' },
  { value: 'ReportedPaid', label: 'Reported Paid' },
  { value: 'Paid', label: 'Paid' },
  { value: 'Overdue', label: 'Overdue' }
];

const currentYear = new Date().getFullYear();
const YEARS = [
  { value: 0, label: 'All Years' },
  ...Array.from({ length: 3 }, (_, i) => ({ 
    value: currentYear - 1 + i, 
    label: (currentYear - 1 + i).toString() 
  }))
];

const ITEMS_PER_PAGE = 15;

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
  const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[month] || '';
};

const formatDate = (date) => {
  if (!date) return '-';
  const d = date.toDate ? date.toDate() : new Date(date);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

// ============================================================================
// STATUS BADGE COMPONENT
// ============================================================================
function StatusBadge({ status }) {
  const statusConfig = {
    Pending: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      icon: Icons.Clock
    },
    ReportedPaid: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      icon: Icons.AlertCircle
    },
    Paid: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      icon: Icons.CheckCircle
    },
    Overdue: {
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      border: 'border-red-500/30',
      icon: Icons.AlertCircle
    }
  };

  const config = statusConfig[status] || statusConfig.Pending;
  const IconComponent = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${config.bg} ${config.text} ${config.border}`}>
      <IconComponent className="w-3 h-3" />
      {status === 'ReportedPaid' ? 'Reported' : status}
    </span>
  );
}

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================
function StatCard({ icon: Icon, label, value, subValue, color = 'blue' }) {
  const colorStyles = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-500 to-amber-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600'
  };

  return (
    <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 p-4 hover:border-slate-600 transition-all">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorStyles[color]} flex items-center justify-center text-white`}>
          <Icon className="w-5 h-5" />
        </div>
        {subValue && (
          <span className="text-xs text-slate-400">{subValue}</span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-slate-400 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ============================================================================
// BILL DETAIL MODAL
// ============================================================================
function BillDetailModal({ bill, tenant, property, onClose, onUpdateStatus }) {
  const [updating, setUpdating] = useState(false);

  async function handleVerifyPayment() {
    setUpdating(true);
    try {
      await onUpdateStatus(bill.id, 'Paid');
      onClose();
    } finally {
      setUpdating(false);
    }
  }

  async function handleMarkOverdue() {
    setUpdating(true);
    try {
      await onUpdateStatus(bill.id, 'Overdue');
      onClose();
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-700/50">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <Icons.Receipt className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Bill Details</h3>
              <p className="text-sm text-slate-400">
                {getMonthName(bill.month)} {bill.year}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Icons.X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Tenant & Property Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <p className="text-xs text-slate-400 mb-1">Tenant</p>
              <p className="font-medium text-white">{tenant?.name || 'Unknown'}</p>
              <p className="text-xs text-slate-400">{tenant?.phone || ''}</p>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <p className="text-xs text-slate-400 mb-1">Property</p>
              <p className="font-medium text-white">{property?.name || 'Unknown'}</p>
              <p className="text-xs text-slate-400">{property?.area || ''}</p>
            </div>
          </div>

          {/* Bill Breakdown */}
          <div className="border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-700/50">
              <h4 className="font-medium text-white">Bill Breakdown</h4>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Monthly Rent</span>
                <span className="font-medium text-white">{formatCurrency(bill.rent_amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Electricity Share</span>
                <span className="font-medium text-white">{formatCurrency(bill.electricity_share)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Gas Share</span>
                <span className="font-medium text-white">{formatCurrency(bill.gas_share)}</span>
              </div>
              {bill.late_fee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-red-400">Late Fee</span>
                  <span className="font-medium text-red-400">{formatCurrency(bill.late_fee)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-slate-700/50 flex justify-between">
                <span className="font-semibold text-white">Total Amount</span>
                <span className="font-bold text-lg text-cyan-400">{formatCurrency(bill.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* Status & Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-400 mb-1">Status</p>
              <StatusBadge status={bill.status} />
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Due Date</p>
              <p className="font-medium text-white">{formatDate(bill.due_date)}</p>
            </div>
          </div>

          {bill.paid_at && (
            <div>
              <p className="text-xs text-slate-400 mb-1">Paid On</p>
              <p className="font-medium text-emerald-400">{formatDate(bill.paid_at)}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        {(bill.status === 'Pending' || bill.status === 'ReportedPaid') && (
          <div className="p-5 border-t border-slate-700/50 flex gap-3">
            {bill.status === 'ReportedPaid' && (
              <button
                onClick={handleVerifyPayment}
                disabled={updating}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/25"
              >
                {updating ? <LoadingSpinner size="small" /> : <Icons.Check className="w-4 h-4" />}
                Verify Payment
              </button>
            )}
            {bill.status === 'Pending' && (
              <button
                onClick={handleMarkOverdue}
                disabled={updating}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg font-medium hover:bg-red-500/20 transition-colors disabled:opacity-50"
              >
                {updating ? <LoadingSpinner size="small" /> : <Icons.AlertCircle className="w-4 h-4" />}
                Mark Overdue
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-600 text-slate-300 rounded-lg font-medium hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function BillsOverviewPage() {
  // Data State
  const [bills, setBills] = useState([]);
  const [tenants, setTenants] = useState({});
  const [properties, setProperties] = useState({});
  
  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedYear, setSelectedYear] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBill, setSelectedBill] = useState(null);

  // Fetch all data
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError('');

    try {
      // Fetch bills
      const billsSnap = await getDocs(collection(db, 'bills'));
      const billsData = billsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort by year and month descending
      billsData.sort((a, b) => {
        if (b.year !== a.year) return b.year - a.year;
        return b.month - a.month;
      });
      setBills(billsData);

      // Fetch tenants
      const tenantsSnap = await getDocs(collection(db, 'tenants'));
      const tenantsMap = {};
      tenantsSnap.docs.forEach(doc => {
        tenantsMap[doc.id] = { id: doc.id, ...doc.data() };
      });
      setTenants(tenantsMap);

      // Fetch properties
      const propertiesSnap = await getDocs(collection(db, 'properties'));
      const propertiesMap = {};
      propertiesSnap.docs.forEach(doc => {
        propertiesMap[doc.id] = { id: doc.id, ...doc.data() };
      });
      setProperties(propertiesMap);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load bills. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Update bill status
  async function handleUpdateStatus(billId, newStatus) {
    try {
      const updateData = {
        status: newStatus,
        updated_at: serverTimestamp()
      };
      
      if (newStatus === 'Paid') {
        updateData.paid_at = serverTimestamp();
      }

      await updateDoc(doc(db, 'bills', billId), updateData);
      
      // Update local state
      setBills(prev => prev.map(bill => 
        bill.id === billId 
          ? { ...bill, status: newStatus, ...(newStatus === 'Paid' ? { paid_at: new Date() } : {}) }
          : bill
      ));
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update bill status.');
    }
  }

  // Properties list for filter dropdown
  const propertiesList = useMemo(() => {
    return [
      { value: 'all', label: 'All Properties' },
      ...Object.values(properties).map(p => ({ value: p.id, label: p.name }))
    ];
  }, [properties]);

  // Filtered bills
  const filteredBills = useMemo(() => {
    return bills.filter(bill => {
      // Property filter
      if (selectedProperty !== 'all' && bill.property_id !== selectedProperty) {
        return false;
      }

      // Month filter
      if (selectedMonth !== 0 && bill.month !== selectedMonth) {
        return false;
      }

      // Year filter
      if (selectedYear !== 0 && bill.year !== selectedYear) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && bill.status !== selectedStatus) {
        return false;
      }

      // Search filter (by tenant name)
      if (searchQuery.trim()) {
        const tenant = tenants[bill.tenant_id];
        const tenantName = tenant?.name?.toLowerCase() || '';
        const tenantPhone = tenant?.phone || '';
        const query = searchQuery.toLowerCase();
        if (!tenantName.includes(query) && !tenantPhone.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [bills, selectedProperty, selectedMonth, selectedYear, selectedStatus, searchQuery, tenants]);

  // Pagination
  const totalPages = Math.ceil(filteredBills.length / ITEMS_PER_PAGE);
  const paginatedBills = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBills.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredBills, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedProperty, selectedMonth, selectedYear, selectedStatus, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const pending = filteredBills.filter(b => b.status === 'Pending').length;
    const reported = filteredBills.filter(b => b.status === 'ReportedPaid').length;
    const paid = filteredBills.filter(b => b.status === 'Paid').length;
    const overdue = filteredBills.filter(b => b.status === 'Overdue').length;
    const totalAmount = filteredBills.reduce((sum, b) => sum + (b.total_amount || 0), 0);
    const collectedAmount = filteredBills
      .filter(b => b.status === 'Paid')
      .reduce((sum, b) => sum + (b.total_amount || 0), 0);

    return { pending, reported, paid, overdue, totalAmount, collectedAmount, total: filteredBills.length };
  }, [filteredBills]);

  // Clear filters
  function clearFilters() {
    setSearchQuery('');
    setSelectedProperty('all');
    setSelectedMonth(0);
    setSelectedYear(0);
    setSelectedStatus('all');
  }

  const hasFilters = searchQuery || selectedProperty !== 'all' || selectedMonth !== 0 || selectedYear !== 0 || selectedStatus !== 'all';

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <LoadingSpinner size="large" />
        <p className="text-slate-400">Loading bills...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Bills Overview</h1>
        <p className="text-slate-400 mt-1">
          View and manage all tenant bills across properties
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
          <Icons.AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard 
          icon={Icons.Receipt}
          label="Total Bills"
          value={stats.total}
          color="blue"
        />
        <StatCard 
          icon={Icons.Clock}
          label="Pending"
          value={stats.pending}
          color="amber"
        />
        <StatCard 
          icon={Icons.AlertCircle}
          label="Reported Paid"
          value={stats.reported}
          subValue="Need Verification"
          color="purple"
        />
        <StatCard 
          icon={Icons.CheckCircle}
          label="Paid"
          value={stats.paid}
          color="green"
        />
        <StatCard 
          icon={Icons.CurrencyRupee}
          label="Collected"
          value={formatCurrency(stats.collectedAmount)}
          subValue={`of ${formatCurrency(stats.totalAmount)}`}
          color="green"
        />
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tenant name or phone..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
            />
          </div>

          {/* Property Filter */}
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 min-w-[160px]"
          >
            {propertiesList.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>

          {/* Month Filter */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 min-w-[140px]"
          >
            {MONTHS.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>

          {/* Year Filter */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 min-w-[120px]"
          >
            {YEARS.map(y => (
              <option key={y.value} value={y.value}>{y.label}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 min-w-[140px]"
          >
            {STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          {/* Clear Filters */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Icons.X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 overflow-hidden">
        {filteredBills.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icons.Receipt className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No Bills Found</h3>
            <p className="text-slate-400 max-w-sm mx-auto">
              {hasFilters 
                ? 'No bills match your current filters. Try adjusting your search criteria.'
                : 'No bills have been generated yet.'}
            </p>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-5 py-3 bg-slate-800/50 border-b border-slate-700/50 text-sm font-medium text-slate-400">
              <div className="col-span-3">Tenant</div>
              <div className="col-span-2">Property</div>
              <div className="col-span-2">Period</div>
              <div className="col-span-2 text-right">Amount</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1"></div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-slate-700/50">
              {paginatedBills.map(bill => {
                const tenant = tenants[bill.tenant_id];
                const property = properties[bill.property_id];

                return (
                  <div
                    key={bill.id}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-4 px-5 py-4 hover:bg-slate-800/50 transition-colors"
                  >
                    {/* Tenant */}
                    <div className="lg:col-span-3 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                        <Icons.User className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate">{tenant?.name || 'Unknown'}</p>
                        <p className="text-xs text-slate-400">{tenant?.phone || ''}</p>
                      </div>
                    </div>

                    {/* Property */}
                    <div className="lg:col-span-2 flex items-center">
                      <div className="min-w-0">
                        <p className="text-sm text-white truncate">{property?.name || 'Unknown'}</p>
                        <p className="text-xs text-slate-400 lg:hidden">{getMonthName(bill.month)} {bill.year}</p>
                      </div>
                    </div>

                    {/* Period */}
                    <div className="lg:col-span-2 hidden lg:flex items-center">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Icons.Calendar className="w-4 h-4 text-slate-400" />
                        {getMonthName(bill.month)} {bill.year}
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="lg:col-span-2 flex items-center lg:justify-end">
                      <p className="font-semibold text-white">{formatCurrency(bill.total_amount)}</p>
                    </div>

                    {/* Status */}
                    <div className="lg:col-span-2 flex items-center">
                      <StatusBadge status={bill.status} />
                    </div>

                    {/* Action */}
                    <div className="lg:col-span-1 flex items-center justify-end">
                      <button
                        onClick={() => setSelectedBill(bill)}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-cyan-400"
                        title="View Details"
                      >
                        <Icons.Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-5 py-4 border-t border-slate-700/50 flex items-center justify-between">
                <p className="text-sm text-slate-400">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredBills.length)} of {filteredBills.length} bills
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Icons.ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                            pageNum === currentPage 
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' 
                              : 'hover:bg-slate-700 text-slate-400'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Icons.ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bill Detail Modal */}
      {selectedBill && (
        <BillDetailModal
          bill={selectedBill}
          tenant={tenants[selectedBill.tenant_id]}
          property={properties[selectedBill.property_id]}
          onClose={() => setSelectedBill(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}
