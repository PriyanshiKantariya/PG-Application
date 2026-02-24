import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, doc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
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
  AlertCircle: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
  Wrench: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Lightning: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Droplet: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
    </svg>
  ),
  Sparkles: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  Tag: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  Image: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  ArrowRight: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  )
};

// ============================================================================
// CONSTANTS
// ============================================================================
const STATUSES = [
  { value: 'all', label: 'All Statuses' },
  { value: 'Open', label: 'Open' },
  { value: 'InProgress', label: 'In Progress' },
  { value: 'Resolved', label: 'Resolved' }
];

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'Electrical', label: 'Electrical' },
  { value: 'Water', label: 'Water' },
  { value: 'Cleaning', label: 'Cleaning' },
  { value: 'Maintenance', label: 'Maintenance' },
  { value: 'Other', label: 'Other' }
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

const getTimeAgo = (date) => {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : new Date(date);
  const now = new Date();
  const diff = now - d;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return formatDate(date);
};

// ============================================================================
// STATUS BADGE COMPONENT
// ============================================================================
function StatusBadge({ status }) {
  const statusConfig = {
    Open: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      border: 'border-red-200',
      dot: 'bg-red-400'
    },
    InProgress: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-500/30',
      dot: 'bg-amber-400'
    },
    Resolved: {
      bg: 'bg-green-50',
      text: 'text-[#43A047]',
      border: 'border-emerald-500/30',
      dot: 'bg-emerald-400'
    }
  };

  const config = statusConfig[status] || statusConfig.Open;
  const displayText = status === 'InProgress' ? 'In Progress' : status;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${config.bg} ${config.text} ${config.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      {displayText}
    </span>
  );
}

// ============================================================================
// CATEGORY BADGE COMPONENT
// ============================================================================
function CategoryBadge({ category }) {
  const categoryConfig = {
    Electrical: { bg: 'bg-yellow-500/20', text: 'text-amber-600', icon: Icons.Lightning },
    Water: { bg: 'bg-blue-50', text: 'text-[#1E88E5]', icon: Icons.Droplet },
    Cleaning: { bg: 'bg-purple-50', text: 'text-purple-500', icon: Icons.Sparkles },
    Maintenance: { bg: 'bg-gray-100', text: 'text-[#424242]', icon: Icons.Wrench },
    Other: { bg: 'bg-gray-500/20', text: 'text-gray-400', icon: Icons.Tag }
  };

  const config = categoryConfig[category] || categoryConfig.Other;
  const IconComponent = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded ${config.bg} ${config.text}`}>
      <IconComponent className="w-3 h-3" />
      {category}
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
    red: 'from-red-500 to-red-600'
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
// COMPLAINT DETAIL MODAL
// ============================================================================
function ComplaintDetailModal({ complaint, tenant, property, onClose, onUpdateStatus }) {
  const [status, setStatus] = useState(complaint.status);
  const [notes, setNotes] = useState(complaint.admin_notes || '');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await onUpdateStatus(complaint.id, status, notes);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  const hasChanges = status !== complaint.status || notes !== (complaint.admin_notes || '');

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <Icons.AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-[#424242]">Complaint Details</h3>
              <p className="text-sm text-[#757575]">
                {getTimeAgo(complaint.created_at)}
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
          {/* Title & Category */}
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <h4 className="text-lg font-semibold text-[#424242]">{complaint.title}</h4>
              <CategoryBadge category={complaint.category} />
            </div>
            <p className="text-[#424242]">{complaint.description}</p>
          </div>

          {/* Image */}
          {complaint.image_url && (
            <div>
              <p className="text-xs text-[#757575] mb-2 flex items-center gap-1">
                <Icons.Image className="w-3.5 h-3.5" />
                Attached Image
              </p>
              <img 
                src={complaint.image_url} 
                alt="Complaint" 
                className="w-full max-h-64 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}

          {/* Tenant & Property Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#F5F5F5] rounded-xl p-4 border border-gray-200">
              <p className="text-xs text-[#757575] mb-1">Submitted By</p>
              <p className="font-medium text-[#424242]">{tenant?.name || 'Unknown Tenant'}</p>
              <p className="text-xs text-[#757575]">{tenant?.phone || ''}</p>
            </div>
            <div className="bg-[#F5F5F5] rounded-xl p-4 border border-gray-200">
              <p className="text-xs text-[#757575] mb-1">Property</p>
              <p className="font-medium text-[#424242]">{property?.name || 'Unknown Property'}</p>
              <p className="text-xs text-[#757575]">{property?.area || ''}</p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="flex gap-6 text-sm">
            <div>
              <p className="text-[#757575]">Created</p>
              <p className="font-medium text-[#424242]">{formatDateTime(complaint.created_at)}</p>
            </div>
            {complaint.resolved_at && (
              <div>
                <p className="text-[#757575]">Resolved</p>
                <p className="font-medium text-[#43A047]">{formatDateTime(complaint.resolved_at)}</p>
              </div>
            )}
          </div>

          {/* Status Update */}
          <div>
            <label className="block text-sm font-medium text-[#424242] mb-2">
              Update Status
            </label>
            <div className="flex gap-2">
              {['Open', 'InProgress', 'Resolved'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium border-2 transition-all ${
                    status === s
                      ? s === 'Open'
                        ? 'border-red-500 bg-red-500/20 text-red-600'
                        : s === 'InProgress'
                        ? 'border-amber-500 bg-amber-500/20 text-amber-600'
                        : 'border-emerald-500 bg-emerald-500/20 text-[#43A047]'
                      : 'border-gray-300 bg-[#F5F5F5] text-[#757575] hover:border-gray-300'
                  }`}
                >
                  {s === 'InProgress' ? 'In Progress' : s}
                </button>
              ))}
            </div>
            
            {/* Status Flow Indicator */}
            {complaint.status !== 'Resolved' && (
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-[#757575]">
                <span className={complaint.status === 'Open' ? 'font-semibold text-red-600' : ''}>Open</span>
                <Icons.ArrowRight className="w-3 h-3" />
                <span className={complaint.status === 'InProgress' ? 'font-semibold text-amber-600' : ''}>In Progress</span>
                <Icons.ArrowRight className="w-3 h-3" />
                <span className={status === 'Resolved' ? 'font-semibold text-[#43A047]' : ''}>Resolved</span>
              </div>
            )}
          </div>

          {/* Admin Notes */}
          <div>
            <label className="block text-sm font-medium text-[#424242] mb-2">
              Admin Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes or resolution details..."
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
// COMPLAINT CARD COMPONENT
// ============================================================================
function ComplaintCard({ complaint, tenant, property, onViewDetails }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[#424242] truncate">{complaint.title}</h3>
          <p className="text-sm text-[#757575] mt-0.5 line-clamp-2">{complaint.description}</p>
        </div>
        <StatusBadge status={complaint.status} />
      </div>

      {/* Category & Property */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <CategoryBadge category={complaint.category} />
        <span className="text-xs text-[#757575]">•</span>
        <span className="text-xs text-[#757575] flex items-center gap-1">
          <Icons.Building className="w-3 h-3" />
          {property?.name || 'Unknown'}
        </span>
      </div>

      {/* Tenant Info */}
      <div className="flex items-center gap-2 mb-3 p-2 bg-[#F5F5F5] rounded-lg border border-gray-200">
        <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center">
          <Icons.User className="w-3.5 h-3.5 text-[#1E88E5]" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#424242] truncate">{tenant?.name || 'Unknown'}</p>
        </div>
      </div>

      {/* Admin Notes Preview */}
      {complaint.admin_notes && (
        <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs text-[#1E88E5] font-medium mb-0.5">Admin Note:</p>
          <p className="text-xs text-[#1565C0] line-clamp-2">{complaint.admin_notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <span className="text-xs text-[#757575]">
          {getTimeAgo(complaint.created_at)}
        </span>
        <button
          onClick={() => onViewDetails(complaint)}
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
export default function ComplaintsAdminPage() {
  // Data State
  const [complaints, setComplaints] = useState([]);
  const [tenants, setTenants] = useState({});
  const [properties, setProperties] = useState({});
  
  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Fetch all data
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError('');

    try {
      // Fetch complaints
      const complaintsSnap = await getDocs(collection(db, 'complaints'));
      const complaintsData = complaintsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort by created_at descending (newest first)
      complaintsData.sort((a, b) => {
        const dateA = a.created_at?.toDate?.() || new Date(a.created_at) || new Date(0);
        const dateB = b.created_at?.toDate?.() || new Date(b.created_at) || new Date(0);
        return dateB - dateA;
      });
      setComplaints(complaintsData);

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
      setError('Failed to load complaints. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Update complaint status and notes
  async function handleUpdateComplaint(complaintId, newStatus, notes) {
    try {
      const updateData = {
        status: newStatus,
        admin_notes: notes,
        updated_at: serverTimestamp()
      };

      // Set resolved_at if status is Resolved
      if (newStatus === 'Resolved') {
        updateData.resolved_at = serverTimestamp();
      }

      await updateDoc(doc(db, 'complaints', complaintId), updateData);
      
      // Update local state
      setComplaints(prev => prev.map(c => 
        c.id === complaintId 
          ? { 
              ...c, 
              status: newStatus, 
              admin_notes: notes, 
              updated_at: new Date(),
              ...(newStatus === 'Resolved' ? { resolved_at: new Date() } : {})
            }
          : c
      ));
    } catch (err) {
      console.error('Error updating complaint:', err);
      setError('Failed to update complaint.');
    }
  }

  // Properties list for filter dropdown
  const propertiesList = useMemo(() => {
    return [
      { value: 'all', label: 'All Properties' },
      ...Object.values(properties).map(p => ({ value: p.id, label: p.name }))
    ];
  }, [properties]);

  // Filtered complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter(complaint => {
      // Property filter
      if (selectedProperty !== 'all' && complaint.property_id !== selectedProperty) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && complaint.status !== selectedStatus) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && complaint.category !== selectedCategory) {
        return false;
      }

      // Search filter (by title, description, or tenant name)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const title = complaint.title?.toLowerCase() || '';
        const description = complaint.description?.toLowerCase() || '';
        const tenant = tenants[complaint.tenant_id];
        const tenantName = tenant?.name?.toLowerCase() || '';
        
        if (!title.includes(query) && !description.includes(query) && !tenantName.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [complaints, selectedProperty, selectedStatus, selectedCategory, searchQuery, tenants]);

  // Pagination
  const totalPages = Math.ceil(filteredComplaints.length / ITEMS_PER_PAGE);
  const paginatedComplaints = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredComplaints.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredComplaints, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedProperty, selectedStatus, selectedCategory, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const open = complaints.filter(c => c.status === 'Open').length;
    const inProgress = complaints.filter(c => c.status === 'InProgress').length;
    const resolved = complaints.filter(c => c.status === 'Resolved').length;
    return { total: complaints.length, open, inProgress, resolved };
  }, [complaints]);

  // Clear filters
  function clearFilters() {
    setSearchQuery('');
    setSelectedProperty('all');
    setSelectedStatus('all');
    setSelectedCategory('all');
  }

  const hasFilters = searchQuery || selectedProperty !== 'all' || selectedStatus !== 'all' || selectedCategory !== 'all';

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <LoadingSpinner size="large" />
        <p className="text-[#757575]">Loading complaints...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#424242]">Complaints Management</h1>
        <p className="text-[#757575] mt-1">
          View and manage tenant complaints across all properties
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
          icon={Icons.AlertCircle}
          label="Total Complaints"
          value={stats.total}
          color="blue"
        />
        <StatCard 
          icon={Icons.AlertCircle}
          label="Open"
          value={stats.open}
          color="red"
        />
        <StatCard 
          icon={Icons.Clock}
          label="In Progress"
          value={stats.inProgress}
          color="amber"
        />
        <StatCard 
          icon={Icons.CheckCircle}
          label="Resolved"
          value={stats.resolved}
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
              placeholder="Search by title, description, or tenant..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[#424242] placeholder:text-[#757575] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/30 focus:border-[#1E88E5]"
            />
          </div>

          {/* Property Filter */}
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-[#424242] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/30 focus:border-[#1E88E5] min-w-[160px]"
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

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-[#424242] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/30 focus:border-[#1E88E5] min-w-[140px]"
          >
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
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

      {/* Complaints Grid */}
      {filteredComplaints.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icons.AlertCircle className="w-8 h-8 text-[#757575]" />
          </div>
          <h3 className="text-lg font-medium text-[#424242] mb-2">No Complaints Found</h3>
          <p className="text-[#757575] max-w-sm mx-auto">
            {hasFilters 
              ? 'No complaints match your current filters. Try adjusting your search criteria.'
              : 'No complaints have been submitted yet.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedComplaints.map(complaint => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                tenant={tenants[complaint.tenant_id]}
                property={properties[complaint.property_id]}
                onViewDetails={setSelectedComplaint}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-5 py-4">
              <p className="text-sm text-[#757575]">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredComplaints.length)} of {filteredComplaints.length} complaints
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

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <ComplaintDetailModal
          complaint={selectedComplaint}
          tenant={tenants[selectedComplaint.tenant_id]}
          property={properties[selectedComplaint.property_id]}
          onClose={() => setSelectedComplaint(null)}
          onUpdateStatus={handleUpdateComplaint}
        />
      )}
    </div>
  );
}
