import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner, StatusBadge } from '../../components/common';
import { formatCurrency, formatMonthYear } from '../../utils/helpers';

export default function BillsListPage() {
  const { tenantData } = useAuth();
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('all');
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    async function fetchBills() {
      if (!tenantData?.id) {
        setLoading(false);
        return;
      }

      try {
        const billsQuery = query(
          collection(db, 'bills'),
          where('tenant_id', '==', tenantData.id)
        );
        
        const snapshot = await getDocs(billsQuery);
        const billsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Sort by year and month (newest first)
        billsData.sort((a, b) => {
          if (b.year !== a.year) return b.year - a.year;
          return b.month - a.month;
        });

        setBills(billsData);
        setFilteredBills(billsData);

        // Extract unique years for filter
        const years = [...new Set(billsData.map(bill => bill.year))].sort((a, b) => b - a);
        setAvailableYears(years);
      } catch (error) {
        console.error('Error fetching bills:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBills();
  }, [tenantData]);

  // Filter bills when year changes
  useEffect(() => {
    if (selectedYear === 'all') {
      setFilteredBills(bills);
    } else {
      setFilteredBills(bills.filter(bill => bill.year === parseInt(selectedYear)));
    }
  }, [selectedYear, bills]);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  // Calculate totals
  const totalAmount = filteredBills.reduce((sum, bill) => sum + (bill.total_amount || 0), 0);
  const paidAmount = filteredBills
    .filter(bill => bill.status === 'Paid')
    .reduce((sum, bill) => sum + (bill.total_amount || 0), 0);
  const pendingAmount = totalAmount - paidAmount;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#424242]">My Bills</h1>
          <p className="text-[#757575] mt-1">View all your monthly bills</p>
        </div>
        
        {/* Year Filter */}
        <div className="flex items-center gap-3">
          <label htmlFor="year-filter" className="text-sm text-[#757575]">Filter:</label>
          <select
            id="year-filter"
            value={selectedYear}
            onChange={handleYearChange}
            className="px-4 py-2.5 bg-[#F5F5F5] border border-gray-200 rounded-xl text-[#424242] focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-[#1E88E5] transition-all"
          >
            <option value="all">All Years</option>
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
          <p className="text-sm text-[#757575] mb-2">Total</p>
          <p className="text-xl font-bold text-[#424242]">{formatCurrency(totalAmount)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-emerald-500/30 p-5 text-center">
          <p className="text-sm text-[#757575] mb-2">Paid</p>
          <p className="text-xl font-bold text-[#4A7C59]">{formatCurrency(paidAmount)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-amber-500/30 p-5 text-center">
          <p className="text-sm text-[#757575] mb-2">Pending</p>
          <p className="text-xl font-bold text-[#B8860B]">{formatCurrency(pendingAmount)}</p>
        </div>
      </div>

      {/* Bills List */}
      {filteredBills.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-[#F5F5F5] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-200">
            <svg className="w-10 h-10 text-[#757575]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-[#424242] mb-2">No Bills Found</h3>
          <p className="text-[#757575]">
            {selectedYear === 'all' 
              ? "You don't have any bills yet."
              : `No bills found for ${selectedYear}.`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* Table Header - Desktop */}
          <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-4 bg-[#F5F5F5] border-b border-gray-200 text-sm font-medium text-[#757575]">
            <div>Month</div>
            <div>Rent</div>
            <div>Utilities</div>
            <div>Total</div>
            <div className="text-center">Status</div>
          </div>

          {/* Bills */}
          <div className="divide-y divide-gray-200">
            {filteredBills.map((bill) => (
              <Link
                key={bill.id}
                to={`/tenant/bills/${bill.id}`}
                className="block hover:bg-[#F5F5F5] transition-all duration-200"
              >
                {/* Mobile View */}
                <div className="md:hidden p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-[#424242] text-lg">
                      {formatMonthYear(bill.month, bill.year)}
                    </span>
                    <StatusBadge status={bill.status} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#757575]">Total Amount</span>
                    <span className="font-bold text-[#5B7A9D] text-lg">
                      {formatCurrency(bill.total_amount)}
                    </span>
                  </div>
                </div>

                {/* Desktop View */}
                <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-5 items-center">
                  <div className="font-semibold text-[#424242]">
                    {formatMonthYear(bill.month, bill.year)}
                  </div>
                  <div className="text-[#424242]">
                    {formatCurrency(bill.rent_amount || 0)}
                  </div>
                  <div className="text-amber-600">
                    {formatCurrency((bill.electricity_share || 0) + (bill.gas_share || 0))}
                  </div>
                  <div className="font-bold text-[#5B7A9D]">
                    {formatCurrency(bill.total_amount)}
                  </div>
                  <div className="text-center">
                    <StatusBadge status={bill.status} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Bills Count */}
      {filteredBills.length > 0 && (
        <p className="text-sm text-[#757575] mt-6 text-center">
          Showing {filteredBills.length} bill{filteredBills.length !== 1 ? 's' : ''}
          {selectedYear !== 'all' && ` for ${selectedYear}`}
        </p>
      )}

      {/* Back Link */}
      <div className="text-center mt-8">
        <Link
          to="/tenant/dashboard"
          className="inline-flex items-center gap-2 text-[#5B7A9D] hover:text-[#4A6B8A] font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
