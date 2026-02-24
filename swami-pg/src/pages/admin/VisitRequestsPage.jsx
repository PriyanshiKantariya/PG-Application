import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
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
  Calendar: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
  CheckCircle: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
  Sparkles: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  Note: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  ExternalLink: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  )
};

// ============================================================================
// CONSTANTS
// ============================================================================
const STATUSES = [
  { value: 'all', label: 'All Statuses' },
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Completed', label: 'Completed' }
];

const ITEMS_PER_PAGE = 12;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const formatDate = (date) => {
  if (!date) return '-';
  const d = date.toDate ? date.toDate() : new Date(date);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatDateTime = (date) => {
  if (!date) return '-';
  const d = date.toDate ? date.toDate() : new Date(date);
  return d.toLocaleDateString('en-IN', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// ============================================================================
// STATUS BADGE COMPONENT
// ============================================================================
function StatusBadge({ status }) {
  const statusConfig = {
    New: {
      bg: 'bg-blue-500/10',
      text: 'text-[#1E88E5]',
      border: 'border-blue-500/30',
      icon: Icons.Sparkles,
      dot: 'bg-blue-400'
    },
    Contacted: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-500/30',
      icon: Icons.Phone,
      dot: 'bg-amber-400'
    },
    Completed: {
      bg: 'bg-green-50',
      text: 'text-[#43A047]',
      border: 'border-emerald-500/30',
      icon: Icons.CheckCircle,
      dot: 'bg-emerald-400'
    }
  };

  const config = statusConfig[status] || statusConfig.New;
  const IconComponent = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${config.bg} ${config.text} ${config.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      {status}
    </span>
  );
}

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================
function StatCard({ icon: Icon, label, value, color = 'blue' }) {
  const colorStyles = {
    blue: 'from-blue-500 to-blue-600',
    amber: 'from-amber-500 to-amber-600',
    green: 'from-emerald-500 to-emerald-600',
    purple: 'from-purple-500 to-purple-600'
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-all">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorStyles[color]} flex items-center justify-center text-[#424242]`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-[#424242]">{value}</p>
        <p className="text-sm text-[#757575] mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ============================================================================
// VISIT REQUEST DETAIL MODAL
// ============================================================================
function VisitDetailModal({ request, property, onClose, onUpdateStatus }) {
  const [status, setStatus] = useState(request.status);
  const [notes, setNotes] = useState(request.admin_notes || '');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await onUpdateStatus(request.id, status, notes);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  const hasChanges = status !== request.status || notes !== (request.admin_notes || '');

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Icons.Calendar className="w-5 h-5 text-[#1E88E5]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#424242]">Visit Request Details</h3>
              <p className="text-sm text-[#757575]">
                Submitted {formatDateTime(request.created_at)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Icons.X className="w-5 h-5 text-[#757575]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Visitor Info */}
          <div className="bg-[#F5F5F5] rounded-xl p-4 space-y-3 border border-gray-200">
            <h4 className="font-medium text-[#424242] flex items-center gap-2">
              <Icons.User className="w-4 h-4 text-[#757575]" />
              Visitor Information
            </h4>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <p className="text-xs text-[#757575]">Name</p>
                <p className="font-medium text-[#424242]">{request.name}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-xs text-[#757575]">Phone</p>
                  <a 
                    href={`tel:${request.phone}`}
                    className="font-medium text-[#1E88E5] hover:underline flex items-center gap-1"
                  >
                    <Icons.Phone className="w-3.5 h-3.5" />
                    {request.phone}
                  </a>
                </div>
                {request.email && (
                  <div className="flex-1">
                    <p className="text-xs text-[#757575]">Email</p>
                    <a 
                      href={`mailto:${request.email}`}
                      className="font-medium text-[#1E88E5] hover:underline flex items-center gap-1 truncate"
                    >
                      <Icons.Mail className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{request.email}</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Property & Schedule */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#F5F5F5] rounded-xl p-4 border border-gray-200">
              <p className="text-xs text-[#757575] mb-1">Property</p>
              <p className="font-medium text-[#424242]">{property?.name || 'Unknown'}</p>
              <p className="text-xs text-[#757575] mt-0.5">{property?.area || ''}</p>
            </div>
            <div className="bg-[#F5F5F5] rounded-xl p-4 border border-gray-200">
              <p className="text-xs text-[#757575] mb-1">Preferred Date</p>
              <p className="font-medium text-[#424242]">{formatDate(request.preferred_date)}</p>
              <p className="text-xs text-[#757575] mt-0.5">{request.preferred_time || 'Any time'}</p>
            </div>
          </div>

          {/* Status Update */}
          <div>
            <label className="block text-sm font-medium text-[#424242] mb-2">
              Status
            </label>
            <div className="flex gap-2">
              {['New', 'Contacted', 'Completed'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium border-2 transition-all ${
                    status === s
                      ? s === 'New'
                        ? 'border-blue-500 bg-blue-50 text-[#1E88E5]'
                        : s === 'Contacted'
                        ? 'border-amber-500 bg-amber-500/20 text-amber-600'
                        : 'border-emerald-500 bg-emerald-500/20 text-[#43A047]'
                      : 'border-gray-300 bg-[#F5F5F5] text-[#757575] hover:border-gray-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Admin Notes */}
          <div>
            <label className="block text-sm font-medium text-[#424242] mb-2">
              Admin Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this visit request..."
              rows={3}
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-[#424242] placeholder:text-[#757575] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/30 focus:border-[#1E88E5] resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="p-5 border-t border-gray-200 flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#1E88E5] to-[#1565C0] text-[#424242] rounded-lg font-medium hover:from-[#1565C0] hover:to-[#1E88E5] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <LoadingSpinner size="small" /> : <Icons.CheckCircle className="w-4 h-4" />}
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-gray-300 text-[#424242] rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// VISIT REQUEST CARD COMPONENT
// ============================================================================
function VisitRequestCard({ request, property, onViewDetails }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E88E5] to-[#1565C0] flex items-center justify-center text-[#424242] font-semibold">
            {request.name?.charAt(0)?.toUpperCase() || 'V'}
          </div>
          <div>
            <h3 className="font-semibold text-[#424242]">{request.name}</h3>
            <p className="text-sm text-[#757575]">{request.phone}</p>
          </div>
        </div>
        <StatusBadge status={request.status} />
      </div>

      {/* Property & Schedule */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-[#424242]">
          <Icons.Building className="w-4 h-4 text-[#757575]" />
          <span>{property?.name || 'Unknown Property'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#424242]">
          <Icons.Calendar className="w-4 h-4 text-[#757575]" />
          <span>{formatDate(request.preferred_date)}</span>
          {request.preferred_time && (
            <>
              <span className="text-[#757575]">•</span>
              <span>{request.preferred_time}</span>
            </>
          )}
        </div>
      </div>

      {/* Notes Preview */}
      {request.admin_notes && (
        <div className="mb-4 p-2.5 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs text-[#1E88E5] mb-1">Notes:</p>
          <p className="text-sm text-[#1565C0] line-clamp-2">{request.admin_notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <span className="text-xs text-[#757575]">
          {formatDateTime(request.created_at)}
        </span>
        <button
          onClick={() => onViewDetails(request)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#1E88E5] hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Icons.Eye className="w-4 h-4" />
          View Details
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function VisitRequestsPage() {
  // Data State
  const [requests, setRequests] = useState([]);
  const [properties, setProperties] = useState({});
  
  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Fetch all data
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError('');

    try {
      // Fetch visit requests
      const requestsSnap = await getDocs(collection(db, 'visit_requests'));
      const requestsData = requestsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort by created_at descending (newest first)
      requestsData.sort((a, b) => {
        const dateA = a.created_at?.toDate?.() || new Date(a.created_at) || new Date(0);
        const dateB = b.created_at?.toDate?.() || new Date(b.created_at) || new Date(0);
        return dateB - dateA;
      });
      setRequests(requestsData);

      // Fetch properties
      const propertiesSnap = await getDocs(collection(db, 'properties'));
      const propertiesMap = {};
      propertiesSnap.docs.forEach(doc => {
        propertiesMap[doc.id] = { id: doc.id, ...doc.data() };
      });
      setProperties(propertiesMap);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load visit requests. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Update visit request status and notes
  async function handleUpdateRequest(requestId, newStatus, notes) {
    try {
      const updateData = {
        status: newStatus,
        admin_notes: notes,
        updated_at: serverTimestamp()
      };

      await updateDoc(doc(db, 'visit_requests', requestId), updateData);
      
      // Update local state
      setRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: newStatus, admin_notes: notes, updated_at: new Date() }
          : req
      ));
    } catch (err) {
      console.error('Error updating request:', err);
      setError('Failed to update visit request.');
    }
  }

  // Properties list for filter dropdown
  const propertiesList = useMemo(() => {
    return [
      { value: 'all', label: 'All Properties' },
      ...Object.values(properties).map(p => ({ value: p.id, label: p.name }))
    ];
  }, [properties]);

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      // Property filter
      if (selectedProperty !== 'all' && request.property_id !== selectedProperty) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && request.status !== selectedStatus) {
        return false;
      }

      // Search filter (by name, phone, email)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const name = request.name?.toLowerCase() || '';
        const phone = request.phone || '';
        const email = request.email?.toLowerCase() || '';
        if (!name.includes(query) && !phone.includes(query) && !email.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [requests, selectedProperty, selectedStatus, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRequests.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRequests, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedProperty, selectedStatus, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const newCount = requests.filter(r => r.status === 'New').length;
    const contacted = requests.filter(r => r.status === 'Contacted').length;
    const completed = requests.filter(r => r.status === 'Completed').length;
    return { total: requests.length, newCount, contacted, completed };
  }, [requests]);

  // Clear filters
  function clearFilters() {
    setSearchQuery('');
    setSelectedProperty('all');
    setSelectedStatus('all');
  }

  const hasFilters = searchQuery || selectedProperty !== 'all' || selectedStatus !== 'all';

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <LoadingSpinner size="large" />
        <p className="text-[#757575]">Loading visit requests...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#424242]">Visit Requests</h1>
        <p className="text-[#757575] mt-1">
          Manage property visit requests from potential tenants
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <Icons.AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={Icons.Calendar}
          label="Total Requests"
          value={stats.total}
          color="purple"
        />
        <StatCard 
          icon={Icons.Sparkles}
          label="New"
          value={stats.newCount}
          color="blue"
        />
        <StatCard 
          icon={Icons.Phone}
          label="Contacted"
          value={stats.contacted}
          color="amber"
        />
        <StatCard 
          icon={Icons.CheckCircle}
          label="Completed"
          value={stats.completed}
          color="green"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#757575]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, or email..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[#424242] placeholder:text-[#757575] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/30 focus:border-[#1E88E5]"
            />
          </div>

          {/* Property Filter */}
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-[#424242] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/30 focus:border-[#1E88E5] min-w-[180px]"
          >
            {propertiesList.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-[#424242] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/30 focus:border-[#1E88E5] min-w-[140px]"
          >
            {STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          {/* Clear Filters */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 text-[#757575] hover:text-[#424242] hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Icons.X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Requests Grid */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icons.Calendar className="w-8 h-8 text-[#757575]" />
          </div>
          <h3 className="text-lg font-medium text-[#424242] mb-2">No Visit Requests Found</h3>
          <p className="text-[#757575] max-w-sm mx-auto">
            {hasFilters 
              ? 'No requests match your current filters. Try adjusting your search criteria.'
              : 'No visit requests have been submitted yet.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedRequests.map(request => (
              <VisitRequestCard
                key={request.id}
                request={request}
                property={properties[request.property_id]}
                onViewDetails={setSelectedRequest}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-5 py-4">
              <p className="text-sm text-[#757575]">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredRequests.length)} of {filteredRequests.length} requests
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 text-[#757575] hover:bg-gray-200 hover:text-[#424242] disabled:opacity-40 disabled:cursor-not-allowed"
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
                            ? 'bg-gradient-to-r from-[#1E88E5] to-[#1565C0] text-[#424242]' 
                            : 'hover:bg-gray-200 text-[#757575]'
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
                  className="p-2 rounded-lg border border-gray-200 text-[#757575] hover:bg-gray-200 hover:text-[#424242] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Icons.ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Visit Request Detail Modal */}
      {selectedRequest && (
        <VisitDetailModal
          request={selectedRequest}
          property={properties[selectedRequest.property_id]}
          onClose={() => setSelectedRequest(null)}
          onUpdateStatus={handleUpdateRequest}
        />
      )}
    </div>
  );
}
