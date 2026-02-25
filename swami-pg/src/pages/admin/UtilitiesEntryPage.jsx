import { useState, useEffect, useMemo, useCallback } from 'react';
import { collection, getDocs, query, where, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { LoadingSpinner } from '../../components/common';

// ============================================================================
// ICONS
// ============================================================================
const Icons = {
  Lightning: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Fire: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
    </svg>
  ),
  Check: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  CheckCircle: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Building: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  Search: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  ChevronDown: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  ),
  ChevronRight: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  ChevronLeft: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  MapPin: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Home: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  X: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Sparkles: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  Save: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
  ),
  Upload: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Plus: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  Trash: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
};

// ============================================================================
// CONSTANTS
// ============================================================================
const MONTHS = [
  { value: 1, label: 'January', short: 'Jan' },
  { value: 2, label: 'February', short: 'Feb' },
  { value: 3, label: 'March', short: 'Mar' },
  { value: 4, label: 'April', short: 'Apr' },
  { value: 5, label: 'May', short: 'May' },
  { value: 6, label: 'June', short: 'Jun' },
  { value: 7, label: 'July', short: 'Jul' },
  { value: 8, label: 'August', short: 'Aug' },
  { value: 9, label: 'September', short: 'Sep' },
  { value: 10, label: 'October', short: 'Oct' },
  { value: 11, label: 'November', short: 'Nov' },
  { value: 12, label: 'December', short: 'Dec' }
];

const currentYear = new Date().getFullYear();
const YEARS = [currentYear - 1, currentYear, currentYear + 1];
const ITEMS_PER_PAGE = 10;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const getFlatKey = (propertyId, flatNumber) => `${propertyId}_flat_${flatNumber}`;

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================
function StatCard({ icon: Icon, label, value, subValue, color = 'blue' }) {
  const colorStyles = {
    blue: 'from-[#5B9BD5] to-[#4A8AC4]',
    green: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-500 to-amber-600',
    purple: 'from-purple-500 to-purple-600'
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-all">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorStyles[color]} flex items-center justify-center text-[#1a1a1a] shadow-lg`}>
          <Icon className="w-5 h-5" />
        </div>
        {subValue && (
          <span className="text-xs text-[#4a4a4a]">{subValue}</span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-[#1a1a1a]">{value}</p>
        <p className="text-sm text-[#4a4a4a] mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ============================================================================
// FLAT UTILITY ROW COMPONENT
// ============================================================================
function FlatUtilityRow({
  flatNumber,
  utilityData,
  isSaved,
  isSaving,
  successMessage,
  onChange,
  onSave,
  onPhotoUpload,
  onPhotoRemove,
  photoUploading,
  isCustom
}) {
  const electricityBill = parseFloat(utilityData?.electricity_bill) || 0;
  const gasBill = parseFloat(utilityData?.gas_bill) || 0;
  const totalBill = electricityBill + gasBill;

  const handleFileSelect = (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) onPhotoUpload(type, file);
    };
    input.click();
  };

  return (
    <div className={`group rounded-xl border transition-all ${isSaved
      ? 'bg-green-50 border-emerald-500/30'
      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
      }`}>
      {/* Main Row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4">
        {/* Flat Number Badge */}
        <div className="flex items-center gap-3 sm:w-24 flex-shrink-0">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${isSaved ? 'bg-emerald-500/20 text-[#43A047]' : 'bg-gradient-to-br from-gray-100 to-gray-200 text-[#1a1a1a]'
            }`}>
            {flatNumber}
          </div>
          <div className="sm:hidden">
            <span className="text-sm font-medium text-[#1a1a1a]">Flat {flatNumber}</span>
            {isCustom && <span className="ml-1.5 text-[10px] px-1.5 py-0.5 bg-blue-100 text-[#5B9BD5] rounded-full font-medium">Custom</span>}
          </div>
        </div>

        {/* Utility Inputs */}
        <div className="flex-1 grid grid-cols-2 gap-3">
          {/* Electricity Input + Upload */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Icons.Lightning className="w-4 h-4 text-amber-500" />
                </div>
                <input
                  type="number"
                  value={utilityData?.electricity_bill || ''}
                  onChange={(e) => onChange('electricity_bill', e.target.value)}
                  min="0"
                  step="10"
                  placeholder="Electricity"
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-[#F8F9FA] border border-gray-200 rounded-lg text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5B9BD5]/30 focus:border-[#5B9BD5] transition-colors"
                />
              </div>
              <button
                onClick={() => handleFileSelect('electricity_bill_photo')}
                disabled={photoUploading?.electricity_bill_photo}
                className={`p-2 rounded-lg border transition-all flex-shrink-0 ${utilityData?.electricity_bill_photo
                  ? 'bg-amber-50 border-amber-200 text-amber-600'
                  : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-amber-500 hover:border-amber-200 hover:bg-amber-50'
                  }`}
                title="Upload electricity bill photo"
              >
                {photoUploading?.electricity_bill_photo
                  ? <LoadingSpinner size="small" />
                  : <Icons.Upload className="w-4 h-4" />
                }
              </button>
            </div>
            {/* Electricity Photo Thumbnail */}
            {utilityData?.electricity_bill_photo && (
              <div className="flex items-center gap-2 pl-1">
                <a href={utilityData.electricity_bill_photo} target="_blank" rel="noopener noreferrer" className="group/thumb flex items-center gap-2">
                  <img src={utilityData.electricity_bill_photo} alt="Electricity bill" className="w-8 h-8 rounded object-cover border border-gray-200 group-hover/thumb:border-amber-300 transition-colors" />
                  <span className="text-xs text-gray-400 group-hover/thumb:text-amber-500 transition-colors">View bill</span>
                </a>
                <button
                  onClick={() => onPhotoRemove('electricity_bill_photo')}
                  className="p-1 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Remove photo"
                >
                  <Icons.X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Gas Input + Upload */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Icons.Fire className="w-4 h-4 text-orange-500" />
                </div>
                <input
                  type="number"
                  value={utilityData?.gas_bill || ''}
                  onChange={(e) => onChange('gas_bill', e.target.value)}
                  min="0"
                  step="10"
                  placeholder="Gas"
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-[#F8F9FA] border border-gray-200 rounded-lg text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5B9BD5]/30 focus:border-[#5B9BD5] transition-colors"
                />
              </div>
              <button
                onClick={() => handleFileSelect('gas_bill_photo')}
                disabled={photoUploading?.gas_bill_photo}
                className={`p-2 rounded-lg border transition-all flex-shrink-0 ${utilityData?.gas_bill_photo
                  ? 'bg-orange-50 border-orange-200 text-orange-600'
                  : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-orange-500 hover:border-orange-200 hover:bg-orange-50'
                  }`}
                title="Upload gas bill photo"
              >
                {photoUploading?.gas_bill_photo
                  ? <LoadingSpinner size="small" />
                  : <Icons.Upload className="w-4 h-4" />
                }
              </button>
            </div>
            {/* Gas Photo Thumbnail */}
            {utilityData?.gas_bill_photo && (
              <div className="flex items-center gap-2 pl-1">
                <a href={utilityData.gas_bill_photo} target="_blank" rel="noopener noreferrer" className="group/thumb flex items-center gap-2">
                  <img src={utilityData.gas_bill_photo} alt="Gas bill" className="w-8 h-8 rounded object-cover border border-gray-200 group-hover/thumb:border-orange-300 transition-colors" />
                  <span className="text-xs text-gray-400 group-hover/thumb:text-orange-500 transition-colors">View bill</span>
                </a>
                <button
                  onClick={() => onPhotoRemove('gas_bill_photo')}
                  className="p-1 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Remove photo"
                >
                  <Icons.X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Total & Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-3 sm:w-44 flex-shrink-0">
          <div className="text-right">
            <p className="text-xs text-[#4a4a4a]">Total</p>
            <p className={`font-semibold ${totalBill > 0 ? 'text-[#1a1a1a]' : 'text-[#4a4a4a]'}`}>
              {formatCurrency(totalBill)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {successMessage && (
              <span className="hidden sm:flex items-center gap-1 text-xs text-[#43A047]">
                <Icons.CheckCircle className="w-3.5 h-3.5" />
                Saved
              </span>
            )}
            <button
              onClick={onSave}
              disabled={isSaving || (!utilityData?.electricity_bill && !utilityData?.gas_bill)}
              className={`p-2 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed ${isSaved
                ? 'bg-emerald-500/20 text-[#43A047] hover:bg-emerald-500/30'
                : 'bg-blue-50 text-[#5B9BD5] hover:bg-blue-100'
                }`}
              title={isSaved ? 'Update' : 'Save'}
            >
              {isSaving ? (
                <LoadingSpinner size="small" />
              ) : (
                <Icons.Check className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// PROPERTY CARD COMPONENT
// ============================================================================
function PropertyCard({
  property,
  utilities,
  existingUtilities,
  saving,
  successMessages,
  isExpanded,
  onToggleExpand,
  onUtilityChange,
  onSaveFlat,
  onSaveAllFlats,
  currentPage,
  onPageChange,
  customFlats,
  newFlatInput,
  onNewFlatInputChange,
  onAddCustomFlat,
  onPhotoUpload,
  onPhotoRemove,
  photoUploading
}) {
  const totalFlats = Number(property.total_flats) || 0;
  const autoFlats = Array.from({ length: totalFlats }, (_, i) => i + 1);
  const extraFlats = customFlats || [];
  const allFlats = [...autoFlats, ...extraFlats.filter(f => !autoFlats.includes(f))];

  // Pagination
  const totalPages = Math.ceil(allFlats.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const flats = allFlats.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  // Calculate saved count
  const savedCount = allFlats.filter(flatNum => {
    const key = getFlatKey(property.id, flatNum);
    return existingUtilities[key];
  }).length;

  // Calculate totals
  const propertyTotals = allFlats.reduce((acc, flatNum) => {
    const key = getFlatKey(property.id, flatNum);
    const data = utilities[key] || {};
    return {
      electricity: acc.electricity + (parseFloat(data.electricity_bill) || 0),
      gas: acc.gas + (parseFloat(data.gas_bill) || 0)
    };
  }, { electricity: 0, gas: 0 });

  const isSavingAny = allFlats.some(flatNum => saving[getFlatKey(property.id, flatNum)]);

  if (totalFlats === 0) {
    return (
      <div className="bg-white rounded-xl border border-amber-500/30 p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <Icons.Building className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[#1a1a1a]">{property.name}</h3>
            <p className="text-sm text-[#4a4a4a] flex items-center gap-1 mt-0.5">
              <Icons.MapPin className="w-3.5 h-3.5" />
              {property.area}
            </p>
            <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <p className="text-sm text-amber-600">
                ?? No flats configured. Please edit this property and set the "Total Flats" count.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border transition-all ${isExpanded ? 'border-[#5B9BD5]/30 shadow-md' : 'border-gray-200 hover:border-gray-300'
      }`}>
      {/* Property Header */}
      <div
        className="p-5 cursor-pointer select-none"
        onClick={onToggleExpand}
      >
        <div className="flex items-start gap-4">
          {/* Property Icon */}
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${savedCount === totalFlats ? 'bg-emerald-500/20' : 'bg-gray-200'
            }`}>
            <Icons.Building className={`w-6 h-6 ${savedCount === totalFlats ? 'text-[#43A047]' : 'text-[#4a4a4a]'
              }`} />
          </div>

          {/* Property Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-[#1a1a1a] truncate">{property.name}</h3>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${savedCount === totalFlats
                ? 'bg-emerald-500/20 text-[#43A047]'
                : 'bg-gray-200 text-[#4a4a4a]'
                }`}>
                {savedCount}/{totalFlats} flats
              </span>
            </div>
            <p className="text-sm text-[#4a4a4a] flex items-center gap-1 mt-0.5">
              <Icons.MapPin className="w-3.5 h-3.5" />
              {property.area}
            </p>

            {/* Summary Stats */}
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-sm">
                <Icons.Lightning className="w-4 h-4 text-amber-500" />
                <span className="text-[#1a1a1a]">{formatCurrency(propertyTotals.electricity)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <Icons.Fire className="w-4 h-4 text-orange-500" />
                <span className="text-[#1a1a1a]">{formatCurrency(propertyTotals.gas)}</span>
              </div>
              <div className="text-sm font-medium text-[#1a1a1a]">
                Total: {formatCurrency(propertyTotals.electricity + propertyTotals.gas)}
              </div>
            </div>
          </div>

          {/* Expand/Collapse */}
          <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            {isExpanded ? (
              <Icons.ChevronDown className="w-5 h-5 text-[#4a4a4a]" />
            ) : (
              <Icons.ChevronRight className="w-5 h-5 text-[#4a4a4a]" />
            )}
          </button>
        </div>
      </div>

      {/* Flats List - Expanded */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          {/* Flats Header */}
          <div className="px-5 py-3 bg-[#F5F5F5] flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Icons.Home className="w-4 h-4 text-[#4a4a4a]" />
              <span className="text-sm font-medium text-[#1a1a1a]">
                {allFlats.length} Flats
              </span>
              {totalPages > 1 && (
                <span className="text-xs text-[#4a4a4a]">
                  (Page {currentPage} of {totalPages})
                </span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSaveAllFlats(property.id, flats);
              }}
              disabled={isSavingAny}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#5B9BD5] bg-blue-50 rounded-lg hover:bg-blue-100 border border-blue-100 transition-colors disabled:opacity-50"
            >
              <Icons.Save className="w-4 h-4" />
              Save Page
            </button>
          </div>

          {/* Add Custom Flat */}
          <div className="px-5 py-3 bg-white border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-xs">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Icons.Home className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={newFlatInput || ''}
                  onChange={(e) => onNewFlatInputChange(property.id, e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && newFlatInput?.trim()) onAddCustomFlat(property.id, newFlatInput.trim()); }}
                  placeholder="Enter flat number (e.g. A1, 101)"
                  className="w-full pl-10 pr-3 py-2 text-sm bg-[#F8F9FA] border border-gray-200 rounded-lg text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5B9BD5]/30 focus:border-[#5B9BD5] transition-colors"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (newFlatInput?.trim()) onAddCustomFlat(property.id, newFlatInput.trim());
                }}
                disabled={!newFlatInput?.trim()}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#5B9BD5] rounded-lg hover:bg-[#4A8AC4] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Icons.Plus className="w-4 h-4" />
                Add Flat
              </button>
            </div>
          </div>

          {/* Flats Grid */}
          <div className="p-4 space-y-2">
            {flats.map(flatNum => {
              const key = getFlatKey(property.id, flatNum);
              const isCustom = extraFlats.includes(flatNum);
              return (
                <FlatUtilityRow
                  key={key}
                  flatNumber={flatNum}
                  utilityData={utilities[key] || {}}
                  isSaved={Boolean(existingUtilities[key])}
                  isSaving={saving[key]}
                  successMessage={successMessages[key]}
                  onChange={(field, value) => onUtilityChange(key, field, value)}
                  onSave={() => onSaveFlat(property.id, flatNum)}
                  onPhotoUpload={(type, file) => onPhotoUpload(property.id, flatNum, type, file)}
                  onPhotoRemove={(type) => onPhotoRemove(property.id, flatNum, type)}
                  photoUploading={photoUploading[key] || {}}
                  isCustom={isCustom}
                />
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPageChange(property.id, currentPage - 1);
                }}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-[#4a4a4a]"
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
                      onClick={(e) => {
                        e.stopPropagation();
                        onPageChange(property.id, pageNum);
                      }}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${pageNum === currentPage
                        ? 'bg-[#5B9BD5] text-[#1a1a1a]'
                        : 'hover:bg-gray-200 text-[#4a4a4a]'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPageChange(property.id, currentPage + 1);
                }}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-[#4a4a4a]"
              >
                <Icons.ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function UtilitiesEntryPage() {
  // Core State
  const [properties, setProperties] = useState([]);
  const [utilities, setUtilities] = useState({});
  const [existingUtilities, setExistingUtilities] = useState({});

  // UI State
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [successMessages, setSuccessMessages] = useState({});
  const [error, setError] = useState('');

  // View State
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedProperties, setExpandedProperties] = useState(new Set());
  const [propertyPages, setPropertyPages] = useState({});

  // Custom Flats & Photo State
  const [customFlats, setCustomFlats] = useState({}); // { propertyId: [flatId1, flatId2, ...] }
  const [newFlatInputs, setNewFlatInputs] = useState({}); // { propertyId: 'value' }
  const [photoUploading, setPhotoUploading] = useState({}); // { flatKey: { type: boolean } }

  // Fetch Data
  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  async function fetchData() {
    setLoading(true);
    setError('');
    setSuccessMessages({});

    try {
      // Fetch all properties
      const propertiesSnap = await getDocs(collection(db, 'properties'));
      const propertiesData = propertiesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      propertiesData.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      setProperties(propertiesData);

      // Initialize pages
      const pages = {};
      propertiesData.forEach(p => { pages[p.id] = 1; });
      setPropertyPages(pages);

      // Fetch existing utilities
      const existing = {};
      const initialUtilities = {};

      try {
        const utilitiesQuery = query(
          collection(db, 'utilities'),
          where('month', '==', selectedMonth),
          where('year', '==', selectedYear)
        );
        const utilitiesSnap = await getDocs(utilitiesQuery);

        utilitiesSnap.forEach(doc => {
          const data = doc.data();
          if (data.flat_number) {
            const key = getFlatKey(data.property_id, data.flat_number);
            existing[key] = { id: doc.id, ...data };
            initialUtilities[key] = {
              electricity_bill: data.electricity_bill?.toString() || '',
              gas_bill: data.gas_bill?.toString() || '',
              electricity_bill_photo: data.electricity_bill_photo || '',
              gas_bill_photo: data.gas_bill_photo || ''
            };
          }
        });
      } catch (err) {
        console.log('Fetching utilities with fallback');
        const allUtilitiesSnap = await getDocs(collection(db, 'utilities'));
        allUtilitiesSnap.forEach(doc => {
          const data = doc.data();
          if (data.month === selectedMonth && data.year === selectedYear && data.flat_number) {
            const key = getFlatKey(data.property_id, data.flat_number);
            existing[key] = { id: doc.id, ...data };
            initialUtilities[key] = {
              electricity_bill: data.electricity_bill?.toString() || '',
              gas_bill: data.gas_bill?.toString() || '',
              electricity_bill_photo: data.electricity_bill_photo || '',
              gas_bill_photo: data.gas_bill_photo || ''
            };
          }
        });
      }

      setExistingUtilities(existing);
      setUtilities(initialUtilities);

      // Expand first property
      if (propertiesData.length > 0 && Number(propertiesData[0].total_flats) > 0) {
        setExpandedProperties(new Set([propertiesData[0].id]));
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Handlers
  const handleUtilityChange = useCallback((key, field, value) => {
    setUtilities(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value }
    }));
    setSuccessMessages(prev => ({ ...prev, [key]: null }));
  }, []);

  async function handleSaveFlat(propertyId, flatNumber) {
    const key = getFlatKey(propertyId, flatNumber);
    const utilityData = utilities[key];

    if (!utilityData?.electricity_bill && !utilityData?.gas_bill) return;

    setSaving(prev => ({ ...prev, [key]: true }));

    try {
      const electricityBill = parseFloat(utilityData.electricity_bill) || 0;
      const gasBill = parseFloat(utilityData.gas_bill) || 0;

      const utilityRecord = {
        property_id: propertyId,
        flat_number: flatNumber,
        month: selectedMonth,
        year: selectedYear,
        electricity_bill: electricityBill,
        gas_bill: gasBill,
        updated_at: serverTimestamp()
      };

      // Include photo URLs if they exist
      if (utilityData.electricity_bill_photo) {
        utilityRecord.electricity_bill_photo = utilityData.electricity_bill_photo;
      }
      if (utilityData.gas_bill_photo) {
        utilityRecord.gas_bill_photo = utilityData.gas_bill_photo;
      }

      if (existingUtilities[key]) {
        await updateDoc(doc(db, 'utilities', existingUtilities[key].id), utilityRecord);
      } else {
        utilityRecord.created_at = serverTimestamp();
        const docRef = await addDoc(collection(db, 'utilities'), utilityRecord);
        setExistingUtilities(prev => ({
          ...prev,
          [key]: { id: docRef.id, ...utilityRecord }
        }));
      }

      setSuccessMessages(prev => ({ ...prev, [key]: 'Saved!' }));
      setTimeout(() => {
        setSuccessMessages(prev => ({ ...prev, [key]: null }));
      }, 2000);

    } catch (err) {
      console.error('Error saving utility:', err);
      setError(`Failed to save flat ${flatNumber} utilities.`);
    } finally {
      setSaving(prev => ({ ...prev, [key]: false }));
    }
  }

  async function handleSaveAllFlats(propertyId, flats) {
    for (const flatNum of flats) {
      const key = getFlatKey(propertyId, flatNum);
      const utilityData = utilities[key];
      if (utilityData?.electricity_bill || utilityData?.gas_bill) {
        await handleSaveFlat(propertyId, flatNum);
      }
    }
  }

  // Custom Flat Handlers
  const handleNewFlatInputChange = useCallback((propertyId, value) => {
    setNewFlatInputs(prev => ({ ...prev, [propertyId]: value }));
  }, []);

  const handleAddCustomFlat = useCallback((propertyId, flatNumber) => {
    const flatId = isNaN(flatNumber) ? flatNumber : Number(flatNumber);
    setCustomFlats(prev => {
      const existing = prev[propertyId] || [];
      if (existing.includes(flatId)) return prev;
      return { ...prev, [propertyId]: [...existing, flatId] };
    });
    setNewFlatInputs(prev => ({ ...prev, [propertyId]: '' }));
  }, []);

  // Photo Upload Handler
  async function handlePhotoUpload(propertyId, flatNumber, photoType, file) {
    const key = getFlatKey(propertyId, flatNumber);
    setPhotoUploading(prev => ({ ...prev, [key]: { ...(prev[key] || {}), [photoType]: true } }));

    try {
      const ext = file.name.split('.').pop();
      const storagePath = `utility_bills/${propertyId}/${selectedYear}/${selectedMonth}/${flatNumber}/${photoType}.${ext}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Update utilities state with the photo URL
      setUtilities(prev => ({
        ...prev,
        [key]: { ...prev[key], [photoType]: downloadURL }
      }));
    } catch (err) {
      console.error('Error uploading photo:', err);
      setError(`Failed to upload photo for flat ${flatNumber}.`);
    } finally {
      setPhotoUploading(prev => ({ ...prev, [key]: { ...(prev[key] || {}), [photoType]: false } }));
    }
  }

  // Photo Remove Handler
  async function handlePhotoRemove(propertyId, flatNumber, photoType) {
    const key = getFlatKey(propertyId, flatNumber);
    try {
      const photoUrl = utilities[key]?.[photoType];
      if (photoUrl) {
        try {
          const storageRef = ref(storage, photoUrl);
          await deleteObject(storageRef);
        } catch (e) {
          console.log('Photo may already be deleted from storage');
        }
      }
      setUtilities(prev => ({
        ...prev,
        [key]: { ...prev[key], [photoType]: '' }
      }));
    } catch (err) {
      console.error('Error removing photo:', err);
    }
  }

  const togglePropertyExpand = useCallback((propertyId) => {
    setExpandedProperties(prev => {
      const next = new Set(prev);
      if (next.has(propertyId)) {
        next.delete(propertyId);
      } else {
        next.add(propertyId);
      }
      return next;
    });
  }, []);

  const handlePageChange = useCallback((propertyId, page) => {
    setPropertyPages(prev => ({ ...prev, [propertyId]: page }));
  }, []);

  // Computed Values
  const filteredProperties = useMemo(() => {
    if (!searchQuery.trim()) return properties;
    const q = searchQuery.toLowerCase();
    return properties.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.area?.toLowerCase().includes(q)
    );
  }, [properties, searchQuery]);

  const stats = useMemo(() => {
    let totalElectricity = 0;
    let totalGas = 0;
    let totalFlats = 0;
    let savedFlats = 0;

    properties.forEach(property => {
      const flatsCount = Number(property.total_flats) || 0;
      totalFlats += flatsCount;

      for (let i = 1; i <= flatsCount; i++) {
        const key = getFlatKey(property.id, i);
        const data = utilities[key] || {};
        totalElectricity += parseFloat(data.electricity_bill) || 0;
        totalGas += parseFloat(data.gas_bill) || 0;
        if (existingUtilities[key]) savedFlats++;
      }
    });

    return { totalElectricity, totalGas, totalFlats, savedFlats, propertiesCount: properties.length };
  }, [properties, utilities, existingUtilities]);

  // Render
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <LoadingSpinner size="large" />
        <p className="text-[#4a4a4a]">Loading properties...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Per-Flat Utility Billing</h1>
          <p className="text-[#4a4a4a] mt-1">
            Enter electricity and gas bills for each flat in your properties
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 p-1.5 shadow-sm">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-3 py-2 bg-transparent border-0 focus:outline-none focus:ring-0 font-medium text-[#1a1a1a] cursor-pointer rounded-lg hover:bg-gray-200"
          >
            {MONTHS.map(m => (
              <option key={m.value} value={m.value} className="bg-[#F5F5F5]">{m.label}</option>
            ))}
          </select>
          <div className="w-px h-6 bg-gray-200" />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-2 bg-transparent border-0 focus:outline-none focus:ring-0 font-medium text-[#1a1a1a] cursor-pointer rounded-lg hover:bg-gray-200"
          >
            {YEARS.map(y => (
              <option key={y} value={y} className="bg-[#F5F5F5]">{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Icons.X className="w-3 h-3 text-red-600" />
          </div>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Icons.Lightning}
          label="Total Electricity"
          value={formatCurrency(stats.totalElectricity)}
          color="amber"
        />
        <StatCard
          icon={Icons.Fire}
          label="Total Gas"
          value={formatCurrency(stats.totalGas)}
          color="amber"
        />
        <StatCard
          icon={Icons.Home}
          label="Flats Saved"
          value={`${stats.savedFlats}/${stats.totalFlats}`}
          subValue={stats.totalFlats > 0 ? `${Math.round((stats.savedFlats / stats.totalFlats) * 100)}%` : '0%'}
          color="green"
        />
        <StatCard
          icon={Icons.Building}
          label="Total Amount"
          value={formatCurrency(stats.totalElectricity + stats.totalGas)}
          subValue={MONTHS.find(m => m.value === selectedMonth)?.short}
          color="purple"
        />
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a4a4a]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search properties by name or area..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5B9BD5]/30 focus:border-[#5B9BD5] transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-lg"
          >
            <Icons.X className="w-4 h-4 text-[#4a4a4a]" />
          </button>
        )}
      </div>

      {/* Properties List */}
      {filteredProperties.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4">
            <Icons.Building className="w-8 h-8 text-[#4a4a4a]" />
          </div>
          <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">
            {properties.length === 0 ? 'No Properties Found' : 'No Matching Properties'}
          </h3>
          <p className="text-[#4a4a4a] max-w-sm mx-auto">
            {properties.length === 0
              ? 'Add properties first and configure the number of flats.'
              : 'Try adjusting your search criteria.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProperties.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              utilities={utilities}
              existingUtilities={existingUtilities}
              saving={saving}
              successMessages={successMessages}
              isExpanded={expandedProperties.has(property.id)}
              onToggleExpand={() => togglePropertyExpand(property.id)}
              onUtilityChange={handleUtilityChange}
              onSaveFlat={handleSaveFlat}
              onSaveAllFlats={handleSaveAllFlats}
              currentPage={propertyPages[property.id] || 1}
              onPageChange={handlePageChange}
              customFlats={customFlats[property.id] || []}
              newFlatInput={newFlatInputs[property.id] || ''}
              onNewFlatInputChange={handleNewFlatInputChange}
              onAddCustomFlat={handleAddCustomFlat}
              onPhotoUpload={handlePhotoUpload}
              onPhotoRemove={handlePhotoRemove}
              photoUploading={photoUploading}
            />
          ))}
        </div>
      )}

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Icons.Sparkles className="w-5 h-5 text-[#5B9BD5] flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-[#5B9BD5]">How it works</h4>
            <p className="text-sm text-[#4A8AC4]/80 mt-1">
              Enter electricity and gas bills for each flat individually. Use the <strong>Add Flat</strong> button to add custom flat numbers.
              Upload bill photos using the 📷 icon next to each input. Click the checkmark to save each flat,
              or use "Save Page" to save all visible entries at once.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
