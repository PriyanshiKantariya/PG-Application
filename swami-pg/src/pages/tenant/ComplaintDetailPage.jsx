import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner, StatusBadge } from '../../components/common';
import { formatDate } from '../../utils/helpers';

// SVG Icons
const BackIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ElectricalIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const WaterIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const CleaningIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const MaintenanceIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const OtherIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5 text-[#424242]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AdminIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const getCategoryIcon = (category) => {
  const icons = {
    'Electrical': ElectricalIcon,
    'Water': WaterIcon,
    'Cleaning': CleaningIcon,
    'Maintenance': MaintenanceIcon,
    'Other': OtherIcon
  };
  return icons[category] || OtherIcon;
};

const getCategoryColor = (category) => {
  const colors = {
    'Electrical': 'text-amber-600 bg-yellow-400/10 border-yellow-400/20',
    'Water': 'text-[#1E88E5] bg-blue-400/10 border-blue-400/20',
    'Cleaning': 'text-[#43A047] bg-emerald-400/10 border-emerald-400/20',
    'Maintenance': 'text-orange-500 bg-orange-400/10 border-orange-400/20',
    'Other': 'text-[#757575] bg-gray-100 border-gray-200'
  };
  return colors[category] || 'text-[#757575] bg-gray-100 border-gray-200';
};

const getStatusBorder = (status) => {
  const colors = {
    'Open': 'border-red-500',
    'InProgress': 'border-amber-500',
    'Resolved': 'border-emerald-500'
  };
  return colors[status] || 'border-gray-300';
};

export default function ComplaintDetailPage() {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const { tenantData } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchComplaint() {
      if (!complaintId) {
        setError('Complaint ID not provided');
        setLoading(false);
        return;
      }

      try {
        const complaintDoc = await getDoc(doc(db, 'complaints', complaintId));
        
        if (!complaintDoc.exists()) {
          setError('Complaint not found');
          setLoading(false);
          return;
        }

        const complaintData = { id: complaintDoc.id, ...complaintDoc.data() };

        if (complaintData.property_id !== tenantData?.property_id) {
          setError('You do not have permission to view this complaint');
          setLoading(false);
          return;
        }

        setComplaint(complaintData);
      } catch (err) {
        console.error('Error fetching complaint:', err);
        setError('Failed to load complaint details');
      } finally {
        setLoading(false);
      }
    }

    fetchComplaint();
  }, [complaintId, tenantData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/20">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#424242] mb-2">Error</h2>
          <p className="text-[#757575] mb-6">{error}</p>
          <button
            onClick={() => navigate('/tenant/complaints')}
            className="px-6 py-3 bg-gradient-to-r from-[#1E88E5] to-[#1565C0] text-[#424242] rounded-xl hover:from-[#1565C0] hover:to-[#1E88E5] transition-all font-semibold"
          >
            Back to Complaints
          </button>
        </div>
      </div>
    );
  }

  const CategoryIcon = getCategoryIcon(complaint.category);
  const isOwnComplaint = complaint.tenant_id === tenantData?.id;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        to="/tenant/complaints"
        className="inline-flex items-center text-[#1E88E5] hover:text-[#1565C0] mb-6 font-medium transition-colors"
      >
        <BackIcon />
        <span className="ml-1">Back to Complaints</span>
      </Link>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* Header with Category */}
        <div className={`px-6 py-6 border-b-4 ${getStatusBorder(complaint.status)} bg-[#F5F5F5]`}>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl border ${getCategoryColor(complaint.category)}`}>
              <CategoryIcon />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-xl font-bold text-[#424242]">
                  {complaint.title}
                </h1>
                <StatusBadge status={complaint.status} />
              </div>
              <span className={`inline-block mt-2 text-sm px-3 py-1 rounded-lg border ${getCategoryColor(complaint.category)}`}>
                {complaint.category}
              </span>
            </div>
          </div>
        </div>

        {/* Meta Information */}
        <div className="px-6 py-4 bg-[#F5F5F5]/30 border-b border-gray-200">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center text-[#757575]">
              <UserIcon />
              <span className="ml-2">
                Submitted by: {' '}
                <span className={isOwnComplaint ? 'font-semibold text-[#1E88E5]' : 'font-medium text-[#424242]'}>
                  {isOwnComplaint ? 'You' : (complaint.tenant_name || 'A tenant')}
                </span>
              </span>
            </div>
            <div className="flex items-center text-[#757575]">
              <CalendarIcon />
              <span className="ml-2">{formatDate(complaint.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h2 className="text-sm font-semibold text-[#757575] uppercase tracking-wide mb-3">
              Description
            </h2>
            <p className="text-[#424242] whitespace-pre-wrap leading-relaxed">
              {complaint.description}
            </p>
          </div>

          {/* Image if exists */}
          {complaint.image_url && (
            <div>
              <h2 className="text-sm font-semibold text-[#757575] uppercase tracking-wide mb-3">
                Attached Photo
              </h2>
              <div className="rounded-xl overflow-hidden border border-gray-200">
                <img
                  src={complaint.image_url}
                  alt="Complaint"
                  className="w-full max-h-96 object-contain bg-[#F5F5F5]"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden items-center justify-center py-8 text-[#757575] bg-[#F5F5F5]">
                  <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Image could not be loaded</span>
                </div>
              </div>
              <a
                href={complaint.image_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-3 text-sm text-[#1E88E5] hover:text-[#1565C0]"
              >
                Open image in new tab
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}

          {/* Admin Notes */}
          {complaint.admin_notes && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
              <div className="flex items-center mb-3">
                <AdminIcon className="text-[#1E88E5]" />
                <h2 className="ml-2 text-sm font-semibold text-[#1E88E5] uppercase tracking-wide">
                  Admin Response
                </h2>
              </div>
              <p className="text-[#424242] whitespace-pre-wrap">
                {complaint.admin_notes}
              </p>
            </div>
          )}

          {/* Status Timeline */}
          <div className="pt-4 border-t border-gray-200">
            <h2 className="text-sm font-semibold text-[#757575] uppercase tracking-wide mb-4">
              Status Timeline
            </h2>
            <div className="space-y-4">
              {/* Created */}
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1E88E5] to-[#1565C0] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[#424242]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="font-medium text-[#424242]">Complaint Submitted</p>
                  <p className="text-sm text-[#757575]">{formatDate(complaint.created_at)}</p>
                </div>
              </div>

              {/* In Progress */}
              {(complaint.status === 'InProgress' || complaint.status === 'Resolved') && (
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#424242]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-[#424242]">Work In Progress</p>
                    <p className="text-sm text-[#757575]">Admin is working on this issue</p>
                  </div>
                </div>
              )}

              {/* Resolved */}
              {complaint.status === 'Resolved' && (
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#43A047] to-[#2E7D32] flex items-center justify-center flex-shrink-0">
                    <CheckIcon />
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-[#424242]">Resolved</p>
                    <p className="text-sm text-[#757575]">
                      {complaint.resolved_at ? formatDate(complaint.resolved_at) : 'Issue has been fixed'}
                    </p>
                  </div>
                </div>
              )}

              {/* Pending Steps */}
              {complaint.status === 'Open' && (
                <div className="flex items-start opacity-50">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#757575]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-[#757575]">Awaiting Admin Response</p>
                    <p className="text-sm text-[#757575]">The admin will review this soon</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-center text-sm text-[#757575]">
        <p>Complaint ID: {complaint.id}</p>
        {complaint.updated_at && complaint.updated_at !== complaint.created_at && (
          <p className="mt-1">Last updated: {formatDate(complaint.updated_at)}</p>
        )}
      </div>
    </div>
  );
}
