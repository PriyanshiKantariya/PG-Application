import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner, StatusBadge } from '../../components/common';
import { formatDate } from '../../utils/helpers';
import { COMPLAINT_STATUS } from '../../utils/constants';

// SVG Icons
const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const ElectricalIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const WaterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const CleaningIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const MaintenanceIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const OtherIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const EmptyIcon = () => (
  <svg className="w-16 h-16 text-[#757575]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

// Category icon mapping
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

// Category color mapping - dark theme
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

export default function ComplaintsListPage() {
  const { tenantData } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Status filter options
  const statusOptions = ['All', COMPLAINT_STATUS.OPEN, COMPLAINT_STATUS.IN_PROGRESS, COMPLAINT_STATUS.RESOLVED];

  useEffect(() => {
    async function fetchComplaints() {
      if (!tenantData?.property_id) {
        setError('Property information not found');
        setLoading(false);
        return;
      }

      try {
        let complaintsData = [];
        
        try {
          const complaintsQuery = query(
            collection(db, 'complaints'),
            where('property_id', '==', tenantData.property_id),
            orderBy('created_at', 'desc')
          );
          const snapshot = await getDocs(complaintsQuery);
          complaintsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        } catch (indexError) {
          console.warn('Index not available, using client-side sorting:', indexError.message);
          const fallbackQuery = query(
            collection(db, 'complaints'),
            where('property_id', '==', tenantData.property_id)
          );
          const snapshot = await getDocs(fallbackQuery);
          complaintsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          complaintsData.sort((a, b) => {
            const dateA = a.created_at?.seconds || 0;
            const dateB = b.created_at?.seconds || 0;
            return dateB - dateA;
          });
        }

        setComplaints(complaintsData);
      } catch (err) {
        console.error('Error fetching complaints:', err);
        if (err.code === 'permission-denied') {
          setError('Permission denied. Please check Firestore security rules.');
        } else {
          setError('Failed to load complaints. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchComplaints();
  }, [tenantData]);

  const filteredComplaints = selectedStatus === 'All'
    ? complaints
    : complaints.filter(c => c.status === selectedStatus);

  const statusCounts = {
    All: complaints.length,
    [COMPLAINT_STATUS.OPEN]: complaints.filter(c => c.status === COMPLAINT_STATUS.OPEN).length,
    [COMPLAINT_STATUS.IN_PROGRESS]: complaints.filter(c => c.status === COMPLAINT_STATUS.IN_PROGRESS).length,
    [COMPLAINT_STATUS.RESOLVED]: complaints.filter(c => c.status === COMPLAINT_STATUS.RESOLVED).length
  };

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
          <p className="text-[#757575]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#424242]">Complaints</h1>
          <p className="text-[#757575] mt-1">
            {tenantData?.property_name || 'Your Property'}
          </p>
        </div>
        <Link
          to="/tenant/complaints/new"
          className="inline-flex items-center px-5 py-3 bg-[#5B7A9D] text-white rounded-xl hover:bg-[#4A6B8A] transition-all duration-200 font-semibold"
        >
          <PlusIcon />
          <span className="ml-2">New Complaint</span>
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 p-2 mb-8">
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center ${
                selectedStatus === status
                  ? 'bg-[#5B7A9D] text-white'
                  : 'text-[#757575] hover:text-[#424242] hover:bg-[#FAFAFA]'
              }`}
            >
              {status === 'InProgress' ? 'In Progress' : status}
              <span className={`ml-2 text-sm px-2 py-0.5 rounded-full ${
                selectedStatus === status
                  ? 'bg-white/20'
                  : 'bg-[#F5F5F5]'
              }`}>
                {statusCounts[status]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Complaints List */}
      {filteredComplaints.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="flex justify-center mb-6">
            <EmptyIcon />
          </div>
          <h3 className="text-xl font-semibold text-[#424242] mb-2">
            {selectedStatus === 'All' ? 'No complaints yet' : `No ${selectedStatus === 'InProgress' ? 'in progress' : selectedStatus.toLowerCase()} complaints`}
          </h3>
          <p className="text-[#757575] mb-6">
            {selectedStatus === 'All' 
              ? 'When you or other tenants submit complaints, they will appear here.'
              : 'Try selecting a different filter to see more complaints.'}
          </p>
          {selectedStatus === 'All' && (
            <Link
              to="/tenant/complaints/new"
              className="inline-flex items-center px-5 py-3 bg-[#5B7A9D] text-white rounded-xl hover:bg-[#4A6B8A] transition-all duration-200 font-semibold"
            >
              <PlusIcon />
              <span className="ml-2">Submit a Complaint</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComplaints.map((complaint) => {
            const CategoryIcon = getCategoryIcon(complaint.category);
            const isOwnComplaint = complaint.tenant_id === tenantData?.id;
            
            return (
              <div
                key={complaint.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-[#1E88E5]/30 transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  {/* Category Icon */}
                  <div className={`p-3 rounded-xl border ${getCategoryColor(complaint.category)}`}>
                    <CategoryIcon />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-lg font-semibold text-[#424242] truncate">
                        {complaint.title}
                      </h3>
                      <StatusBadge status={complaint.status} />
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-[#757575] mb-3">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {isOwnComplaint ? (
                          <span className="font-medium text-[#1E88E5]">You</span>
                        ) : (
                          complaint.tenant_name || 'A tenant'
                        )}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(complaint.created_at)}
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${getCategoryColor(complaint.category)}`}>
                        {complaint.category}
                      </span>
                    </div>

                    {/* Description Preview */}
                    <p className="text-[#757575] text-sm line-clamp-2 mb-4">
                      {complaint.description}
                    </p>

                    {/* Admin Notes Preview */}
                    {complaint.admin_notes && (
                      <div className="bg-[#F5F5F5] rounded-xl px-4 py-3 mb-4 border border-gray-200">
                        <p className="text-sm text-[#424242]">
                          <span className="font-medium text-[#1E88E5]">Admin: </span>
                          <span className="text-[#757575] line-clamp-1">{complaint.admin_notes}</span>
                        </p>
                      </div>
                    )}

                    {/* View Details Link */}
                    <Link
                      to={`/tenant/complaints/${complaint.id}`}
                      className="inline-flex items-center text-[#1E88E5] hover:text-[#1565C0] font-medium text-sm transition-colors"
                    >
                      View Details
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary Stats */}
      {complaints.length > 0 && (
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-red-100 p-5 text-center">
            <p className="text-2xl font-bold text-[#C25050]">{statusCounts[COMPLAINT_STATUS.OPEN]}</p>
            <p className="text-sm text-[#757575] mt-1">Open</p>
          </div>
          <div className="bg-white rounded-2xl border border-amber-500/30 p-5 text-center">
            <p className="text-2xl font-bold text-[#B8860B]">{statusCounts[COMPLAINT_STATUS.IN_PROGRESS]}</p>
            <p className="text-sm text-[#757575] mt-1">In Progress</p>
          </div>
          <div className="bg-white rounded-2xl border border-emerald-500/30 p-5 text-center">
            <p className="text-2xl font-bold text-[#4A7C59]">{statusCounts[COMPLAINT_STATUS.RESOLVED]}</p>
            <p className="text-sm text-[#757575] mt-1">Resolved</p>
          </div>
        </div>
      )}
    </div>
  );
}
