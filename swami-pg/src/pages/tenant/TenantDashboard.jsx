import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner, StatusBadge } from '../../components/common';
import { formatCurrency, formatMonthYear, getCurrentMonthYear, formatDate } from '../../utils/helpers';
import { GOOGLE_FORMS } from '../../utils/constants';

export default function TenantDashboard() {
  const { tenantData } = useAuth();
  const [propertyName, setPropertyName] = useState('');
  const [currentBill, setCurrentBill] = useState(null);
  const [complaintsCount, setComplaintsCount] = useState({ open: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!tenantData) {
        setLoading(false);
        return;
      }

      try {
        // Fetch property name
        if (tenantData.property_id) {
          const propertyDoc = await getDoc(doc(db, 'properties', tenantData.property_id));
          if (propertyDoc.exists()) {
            setPropertyName(propertyDoc.data().name);
          }
        }

        // Fetch current month bill
        const { month, year } = getCurrentMonthYear();
        const billsQuery = query(
          collection(db, 'bills'),
          where('tenant_id', '==', tenantData.id),
          where('month', '==', month),
          where('year', '==', year)
        );
        const billsSnapshot = await getDocs(billsQuery);
        if (!billsSnapshot.empty) {
          setCurrentBill({ id: billsSnapshot.docs[0].id, ...billsSnapshot.docs[0].data() });
        }

        // Fetch complaints count
        if (tenantData.property_id) {
          const openComplaintsQuery = query(
            collection(db, 'complaints'),
            where('property_id', '==', tenantData.property_id),
            where('status', 'in', ['Open', 'InProgress'])
          );
          const openSnapshot = await getDocs(openComplaintsQuery);

          const resolvedQuery = query(
            collection(db, 'complaints'),
            where('property_id', '==', tenantData.property_id),
            where('status', '==', 'Resolved')
          );
          const resolvedSnapshot = await getDocs(resolvedQuery);

          setComplaintsCount({
            open: openSnapshot.size,
            resolved: resolvedSnapshot.size
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [tenantData]);

  const handlePaymentClick = () => {
    const paymentFormUrl = GOOGLE_FORMS.paymentScreenshot;
    window.open(paymentFormUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const { month, year } = getCurrentMonthYear();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#424242] mb-2">
          Welcome back, <span className="text-[#1E88E5]">{tenantData?.name || 'Tenant'}</span>
        </h1>
        <p className="text-[#757575] flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-medium text-[#1E88E5]">{propertyName || 'Loading...'}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Month Bill Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:col-span-2 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[#424242] flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#1E88E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              This Month's Bill
            </h2>
            <span className="px-3 py-1 text-sm font-medium text-[#1E88E5] bg-blue-50 rounded-full border border-blue-100">
              {formatMonthYear(month, year)}
            </span>
          </div>

          {currentBill ? (
            <div>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-4xl font-bold text-[#424242] mb-1">
                    {formatCurrency(currentBill.total_amount)}
                  </p>
                  <p className="text-sm text-[#757575]">
                    Due by: <span className="text-amber-600 font-medium">{currentBill.due_date ? formatDate(currentBill.due_date) : `7 ${formatMonthYear(month, year)}`}</span>
                  </p>
                </div>
                <StatusBadge status={currentBill.status} />
              </div>

              {/* Quick Breakdown */}
              <div className="bg-[#F5F5F5] rounded-xl p-5 mb-6 border border-gray-100">
                <h3 className="text-sm font-medium text-[#424242] mb-4">Bill Breakdown</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
                    <span className="text-[#757575]">Rent</span>
                    <span className="font-semibold text-[#424242]">{formatCurrency(currentBill.rent_amount)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
                    <span className="text-[#757575]">Electricity</span>
                    <span className="font-semibold text-amber-600">{formatCurrency(currentBill.electricity_share || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
                    <span className="text-[#757575]">Gas</span>
                    <span className="font-semibold text-orange-500">{formatCurrency(currentBill.gas_share || 0)}</span>
                  </div>
                  {currentBill.late_fee > 0 && (
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                      <span className="text-red-600">Late Fee</span>
                      <span className="font-semibold text-red-600">{formatCurrency(currentBill.late_fee)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Link
                  to={`/tenant/bills/${currentBill.id}`}
                  className="flex-1 px-6 py-3 text-center text-sm font-semibold text-[#1E88E5] border-2 border-[#1E88E5]/30 rounded-xl hover:bg-blue-50 transition-all duration-200"
                >
                  View Details
                </Link>
                {currentBill.status !== 'Paid' && (
                  <button
                    onClick={handlePaymentClick}
                    className="flex-1 px-6 py-3 text-center text-sm font-semibold text-white bg-[#43A047] rounded-xl hover:bg-[#2E7D32] transition-all duration-200 shadow-sm"
                  >
                    I Have Paid
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-[#F5F5F5] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-200">
                <svg className="w-10 h-10 text-[#757575]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-[#424242] font-medium text-lg">No bill generated yet</p>
              <p className="text-sm text-[#757575] mt-2">Bills are usually generated on the 1st of each month.</p>
            </div>
          )}
        </div>

        {/* Complaints Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#424242] mb-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            Complaints
          </h2>

          <div className="flex justify-around mb-6">
            <div className="text-center p-4 bg-amber-50 rounded-xl border border-amber-100 flex-1 mr-2">
              <p className="text-3xl font-bold text-amber-600">{complaintsCount.open}</p>
              <p className="text-sm text-[#757575] mt-1">Open</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100 flex-1 ml-2">
              <p className="text-3xl font-bold text-[#43A047]">{complaintsCount.resolved}</p>
              <p className="text-sm text-[#757575] mt-1">Resolved</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              to="/tenant/complaints"
              className="flex-1 px-4 py-3 text-center text-sm font-semibold text-[#424242] border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              View All
            </Link>
            <Link
              to="/tenant/complaints/new"
              className="flex-1 px-4 py-3 text-center text-sm font-semibold text-white bg-[#1E88E5] rounded-xl hover:bg-[#1565C0] transition-all duration-200 shadow-sm"
            >
              New Complaint
            </Link>
          </div>
        </div>

        {/* Quick Links Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#424242] mb-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            Quick Links
          </h2>

          <div className="space-y-3">
            <Link
              to="/tenant/profile"
              className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-xl hover:bg-gray-100 transition-all duration-200 group border border-gray-100 hover:border-gray-200"
            >
              <span className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-[#1E88E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-[#424242] font-medium group-hover:text-[#1E88E5]">View My Profile</span>
              </span>
              <svg className="w-5 h-5 text-gray-300 group-hover:text-[#1E88E5] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              to="/tenant/bills"
              className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-xl hover:bg-gray-100 transition-all duration-200 group border border-gray-100 hover:border-gray-200"
            >
              <span className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-[#1E88E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-[#424242] font-medium group-hover:text-[#1E88E5]">View All Bills</span>
              </span>
              <svg className="w-5 h-5 text-gray-300 group-hover:text-[#1E88E5] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <button
              onClick={() => {
                const property = propertyName || 'the PG';
                alert(`House Rules for ${property}:\n\n• No smoking\n• No alcohol or drugs\n• No guests staying overnight\n• Maintain cleanliness\n• Quiet hours: 10 PM - 7 AM`);
              }}
              className="w-full flex items-center justify-between p-4 bg-[#F5F5F5] rounded-xl hover:bg-gray-100 transition-all duration-200 group text-left border border-gray-100 hover:border-gray-200"
            >
              <span className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="text-[#424242] font-medium group-hover:text-[#1E88E5]">View House Rules</span>
              </span>
              <svg className="w-5 h-5 text-gray-300 group-hover:text-[#1E88E5] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tenant Info Summary */}
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 md:col-span-2">
          <h2 className="text-lg font-semibold text-[#424242] mb-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1E88E5] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            Your Details
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <p className="text-[#757575] text-sm mb-1">Tenant Code</p>
              <p className="font-bold text-lg text-[#1E88E5]">{tenantData?.tenant_code || 'N/A'}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <p className="text-[#757575] text-sm mb-1">Monthly Rent</p>
              <p className="font-bold text-lg text-[#43A047]">{formatCurrency(tenantData?.rent || 0)}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <p className="text-[#757575] text-sm mb-1">Deposit Paid</p>
              <p className="font-bold text-lg text-purple-500">{formatCurrency(tenantData?.deposit || 0)}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <p className="text-[#757575] text-sm mb-1">Status</p>
              <p className={`font-bold text-lg ${tenantData?.status === 'Active' ? 'text-[#43A047]' : 'text-amber-500'}`}>
                {tenantData?.status || 'Active'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
