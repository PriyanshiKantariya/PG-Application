import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { LoadingSpinner } from '../../components/common';

// SVG Icons for Metric Cards
const PropertiesIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const TenantsIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const PaymentsIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ComplaintsIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const VisitsIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const BedsIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

// Quick Action Card Component
const QuickActionCard = ({ to, icon: Icon, title, description, color }) => (
  <Link
    to={to}
    className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 p-5 hover:border-cyan-500/50 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/10"
  >
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}>
      <Icon />
    </div>
    <h3 className="font-semibold text-white mb-1">{title}</h3>
    <p className="text-sm text-slate-400">{description}</p>
  </Link>
);

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    totalProperties: 0,
    totalBeds: 0,
    activeTenants: 0,
    availableBeds: 0,
    pendingPayments: 0,
    pendingAmount: 0,
    openComplaints: 0,
    newVisitRequests: 0,
    reportedPaidBills: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchMetrics() {
      try {
        // Fetch all data in parallel
        const [
          propertiesSnap,
          tenantsSnap,
          billsSnap,
          complaintsSnap,
          visitsSnap
        ] = await Promise.all([
          getDocs(collection(db, 'properties')),
          getDocs(query(collection(db, 'tenants'), where('status', '==', 'Active'))),
          getDocs(collection(db, 'bills')),
          getDocs(query(collection(db, 'complaints'), where('status', 'in', ['Open', 'InProgress']))),
          getDocs(query(collection(db, 'visit_requests'), where('status', '==', 'New')))
        ]);

        // Calculate total beds from properties
        let totalBeds = 0;
        propertiesSnap.forEach(doc => {
          totalBeds += doc.data().total_beds || 0;
        });

        // Calculate pending payments and reported paid
        let pendingPayments = 0;
        let pendingAmount = 0;
        let reportedPaidBills = 0;
        
        billsSnap.forEach(doc => {
          const bill = doc.data();
          if (bill.status === 'Pending' || bill.status === 'Overdue') {
            pendingPayments++;
            pendingAmount += bill.total_amount || 0;
          }
          if (bill.status === 'ReportedPaid') {
            reportedPaidBills++;
          }
        });

        const activeTenants = tenantsSnap.size;
        const availableBeds = totalBeds - activeTenants;

        setMetrics({
          totalProperties: propertiesSnap.size,
          totalBeds,
          activeTenants,
          availableBeds: availableBeds > 0 ? availableBeds : 0,
          pendingPayments,
          pendingAmount,
          openComplaints: complaintsSnap.size,
          newVisitRequests: visitsSnap.size,
          reportedPaidBills
        });
      } catch (err) {
        console.error('Error fetching metrics:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Welcome to Swami PG Admin Panel</p>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Properties */}
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Total Properties</p>
              <p className="text-3xl font-bold text-white">{metrics.totalProperties}</p>
              <p className="text-xs text-slate-400 mt-1">{metrics.totalBeds} total beds</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <PropertiesIcon />
            </div>
          </div>
        </div>

        {/* Active Tenants */}
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Active Tenants</p>
              <p className="text-3xl font-bold text-white">{metrics.activeTenants}</p>
              <p className="text-xs text-emerald-400 mt-1">{metrics.availableBeds} beds available</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <TenantsIcon />
            </div>
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Pending Payments</p>
              <p className="text-3xl font-bold text-white">{metrics.pendingPayments}</p>
              <p className="text-xs text-amber-400 mt-1">
                ₹{metrics.pendingAmount.toLocaleString('en-IN')} due
              </p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <PaymentsIcon />
            </div>
          </div>
        </div>

        {/* Open Complaints */}
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Open Complaints</p>
              <p className="text-3xl font-bold text-white">{metrics.openComplaints}</p>
              <p className="text-xs text-red-400 mt-1">Needs attention</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
              <ComplaintsIcon />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* New Visit Requests */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl p-5 text-white shadow-lg shadow-cyan-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cyan-100 mb-1">New Visit Requests</p>
              <p className="text-3xl font-bold">{metrics.newVisitRequests}</p>
            </div>
            <VisitsIcon />
          </div>
          <Link to="/admin/visits" className="inline-block mt-3 text-sm text-cyan-100 hover:text-white transition-colors">
            View all →
          </Link>
        </div>

        {/* Reported Paid (Awaiting Verification) */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-5 text-white shadow-lg shadow-amber-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-100 mb-1">Awaiting Verification</p>
              <p className="text-3xl font-bold">{metrics.reportedPaidBills}</p>
            </div>
            <PaymentsIcon />
          </div>
          <Link to="/admin/bills" className="inline-block mt-3 text-sm text-amber-100 hover:text-white transition-colors">
            Verify payments →
          </Link>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-5 text-white shadow-lg shadow-emerald-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-100 mb-1">Occupancy Rate</p>
              <p className="text-3xl font-bold">
                {metrics.totalBeds > 0 
                  ? Math.round((metrics.activeTenants / metrics.totalBeds) * 100) 
                  : 0}%
              </p>
            </div>
            <BedsIcon />
          </div>
          <p className="mt-3 text-sm text-emerald-100">
            {metrics.activeTenants} of {metrics.totalBeds} beds occupied
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickActionCard
            to="/admin/properties"
            icon={PropertiesIcon}
            title="Manage Properties"
            description="Add, edit, and view all PG properties"
            color="bg-cyan-500/10 text-cyan-400"
          />
          <QuickActionCard
            to="/admin/tenants"
            icon={TenantsIcon}
            title="Manage Tenants"
            description="Add new tenants, view details, mark vacated"
            color="bg-emerald-500/10 text-emerald-400"
          />
          <QuickActionCard
            to="/admin/bills"
            icon={PaymentsIcon}
            title="Bills & Payments"
            description="Generate bills, verify payments"
            color="bg-amber-500/10 text-amber-400"
          />
          <QuickActionCard
            to="/admin/complaints"
            icon={ComplaintsIcon}
            title="Handle Complaints"
            description="View and respond to tenant complaints"
            color="bg-red-500/10 text-red-400"
          />
          <QuickActionCard
            to="/admin/visits"
            icon={VisitsIcon}
            title="Visit Requests"
            description="Manage property visit requests"
            color="bg-purple-500/10 text-purple-400"
          />
        </div>
      </div>
    </div>
  );
}
