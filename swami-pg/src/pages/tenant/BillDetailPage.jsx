import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner, StatusBadge } from '../../components/common';
import { formatCurrency, formatMonthYear, formatDate } from '../../utils/helpers';
import { GOOGLE_FORMS } from '../../utils/constants';

// SVG Icons
const RentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const ElectricityIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const GasIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const MinusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
  </svg>
);

const PaymentIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const iconMap = {
  rent: RentIcon,
  electricity: ElectricityIcon,
  gas: GasIcon,
  late: ClockIcon,
  plus: PlusIcon,
  minus: MinusIcon,
};

export default function BillDetailPage() {
  const { billId } = useParams();
  const navigate = useNavigate();
  const { tenantData } = useAuth();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchBill() {
      if (!billId) {
        setError('Bill ID not provided');
        setLoading(false);
        return;
      }

      try {
        const billDoc = await getDoc(doc(db, 'bills', billId));
        
        if (!billDoc.exists()) {
          setError('Bill not found');
          setLoading(false);
          return;
        }

        const billData = { id: billDoc.id, ...billDoc.data() };

        if (billData.tenant_id !== tenantData?.id) {
          setError('You do not have permission to view this bill');
          setLoading(false);
          return;
        }

        setBill(billData);
      } catch (err) {
        console.error('Error fetching bill:', err);
        setError('Failed to load bill details');
      } finally {
        setLoading(false);
      }
    }

    fetchBill();
  }, [billId, tenantData]);

  const handlePaymentClick = () => {
    const paymentFormUrl = GOOGLE_FORMS.paymentScreenshot;
    window.open(paymentFormUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-800 p-8">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/20">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Error</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/tenant/bills')}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all font-semibold"
          >
            Back to Bills
          </button>
        </div>
      </div>
    );
  }

  const utilitiesTotal = (bill.electricity_share || 0) + (bill.gas_share || 0);
  
  const breakdownItems = [
    { label: 'Monthly Rent', amount: bill.rent_amount || 0, iconKey: 'rent', color: 'text-cyan-400' },
    { label: 'Electricity Share', amount: bill.electricity_share || 0, iconKey: 'electricity', color: 'text-yellow-400' },
    { label: 'Gas Share', amount: bill.gas_share || 0, iconKey: 'gas', color: 'text-orange-400' },
  ];

  if (bill.late_fee && bill.late_fee > 0) {
    breakdownItems.push({ label: 'Late Fee', amount: bill.late_fee, iconKey: 'late', isExtra: true, color: 'text-red-400' });
  }

  if (bill.adjustments && bill.adjustments !== 0) {
    breakdownItems.push({ 
      label: bill.adjustments > 0 ? 'Additional Charges' : 'Discount/Adjustment', 
      amount: bill.adjustments, 
      iconKey: bill.adjustments > 0 ? 'plus' : 'minus',
      isExtra: true,
      color: bill.adjustments > 0 ? 'text-red-400' : 'text-emerald-400'
    });
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        to="/tenant/bills"
        className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-6 font-medium transition-colors"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Bills
      </Link>

      {/* Bill Header */}
      <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-800 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {formatMonthYear(bill.month, bill.year)}
              </h1>
              <p className="text-cyan-100 mt-1">Bill #{bill.id.slice(-6).toUpperCase()}</p>
            </div>
            <StatusBadge status={bill.status} />
          </div>
        </div>

        {/* Bill Details */}
        <div className="p-6">
          {/* Due Date Info */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700">
            <div>
              <p className="text-sm text-slate-400">Due Date</p>
              <p className="font-semibold text-white">
                {bill.due_date ? formatDate(bill.due_date) : `7 ${formatMonthYear(bill.month, bill.year)}`}
              </p>
            </div>
            {bill.paid_date && (
              <div className="text-right">
                <p className="text-sm text-slate-400">Paid On</p>
                <p className="font-semibold text-emerald-400">{formatDate(bill.paid_date)}</p>
              </div>
            )}
          </div>

          {/* Breakdown */}
          <h2 className="text-lg font-semibold text-white mb-4">Bill Breakdown</h2>
          
          <div className="space-y-3 mb-6">
            {breakdownItems.map((item, index) => {
              const IconComponent = iconMap[item.iconKey];
              return (
                <div
                  key={index}
                  className={`flex items-center justify-between py-4 px-4 rounded-xl ${
                    item.isExtra ? 'bg-red-500/10 border border-red-500/20' : 'bg-slate-800/50 border border-slate-700/50'
                  }`}
                >
                  <div className="flex items-center">
                    <span className={`mr-3 ${item.color}`}>
                      <IconComponent />
                    </span>
                    <span className="text-slate-200">{item.label}</span>
                  </div>
                  <span className={`font-semibold ${item.color}`}>
                    {item.amount < 0 ? '-' : ''}{formatCurrency(Math.abs(item.amount))}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Total */}
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl p-5 flex items-center justify-between">
            <span className="text-lg font-medium text-white">Total Amount</span>
            <span className="text-3xl font-bold text-cyan-400">{formatCurrency(bill.total_amount)}</span>
          </div>

          {/* Payment Button */}
          {bill.status !== 'Paid' && (
            <div className="mt-6">
              <button
                onClick={handlePaymentClick}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-lg font-semibold rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-200 flex items-center justify-center shadow-lg shadow-emerald-500/25"
              >
                <PaymentIcon />
                <span className="ml-2">I HAVE PAID - Submit Screenshot</span>
              </button>
              <p className="text-sm text-slate-500 text-center mt-2">
                Click above to submit your payment screenshot via Google Form
              </p>
            </div>
          )}

          {/* Paid confirmation */}
          {bill.status === 'Paid' && (
            <div className="mt-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 text-center">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-emerald-400 font-semibold">This bill has been paid</p>
              {bill.paid_date && (
                <p className="text-sm text-emerald-400/70 mt-1">
                  Payment confirmed on {formatDate(bill.paid_date)}
                </p>
              )}
            </div>
          )}

          {/* Reported Paid status */}
          {bill.status === 'ReportedPaid' && (
            <div className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 text-center">
              <p className="text-amber-400 font-semibold">Payment verification pending</p>
              <p className="text-sm text-amber-400/70 mt-1">
                The admin will verify your payment soon.
              </p>
            </div>
          )}

          {/* Admin Notes */}
          {bill.admin_notes && (
            <div className="mt-6 bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
              <h3 className="text-sm font-semibold text-slate-300 mb-2">Admin Notes</h3>
              <p className="text-slate-400">{bill.admin_notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Tenant Info Footer */}
      <div className="mt-6 text-center text-sm text-slate-500">
        <p>Bill for: {tenantData?.name} ({tenantData?.tenant_code})</p>
        <p>Room: {tenantData?.room_number}</p>
      </div>
    </div>
  );
}
