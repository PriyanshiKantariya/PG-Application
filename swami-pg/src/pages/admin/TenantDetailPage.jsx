import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { LoadingSpinner } from '../../components/common';
import { formatDate } from '../../utils/helpers';

// SVG Icons
const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ExitIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const BillsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const SaveIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

export default function TenantDetailPage() {
  const { tenantId } = useParams();
  const navigate = useNavigate();

  const [tenant, setTenant] = useState(null);
  const [property, setProperty] = useState(null);
  const [properties, setProperties] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showVacateModal, setShowVacateModal] = useState(false);
  const [vacating, setVacating] = useState(false);

  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch tenant
        const tenantDoc = await getDoc(doc(db, 'tenants', tenantId));

        if (!tenantDoc.exists()) {
          setError('Tenant not found');
          setLoading(false);
          return;
        }

        const tenantData = { id: tenantDoc.id, ...tenantDoc.data() };
        setTenant(tenantData);
        setEditData(tenantData);

        // Fetch all properties for dropdown
        const propertiesSnap = await getDocs(collection(db, 'properties'));
        const propertiesData = propertiesSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProperties(propertiesData);

        // Fetch current property
        if (tenantData.property_id) {
          const propertyDoc = await getDoc(doc(db, 'properties', tenantData.property_id));
          if (propertyDoc.exists()) {
            setProperty({ id: propertyDoc.id, ...propertyDoc.data() });
          }
        }

        // Fetch recent bills
        try {
          const billsQuery = query(
            collection(db, 'bills'),
            where('tenant_id', '==', tenantId)
          );
          const billsSnap = await getDocs(billsQuery);
          const billsData = billsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          billsData.sort((a, b) => {
            if (b.year !== a.year) return b.year - a.year;
            return b.month - a.month;
          });
          setBills(billsData.slice(0, 6));
        } catch (err) {
          console.log('No bills found or index needed');
        }

      } catch (err) {
        console.error('Error fetching tenant:', err);
        setError('Failed to load tenant details');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [tenantId]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');

    try {
      // Determine status: if property is assigned and status is not Active, set to Active
      const shouldSetActive = editData.property_id && tenant.status !== 'Active' && tenant.status !== 'Vacated';

      const updateData = {
        name: editData.name?.trim(),
        phone: editData.phone?.trim(),
        email: editData.email?.trim() || null,
        property_id: editData.property_id,
        rent: parseFloat(editData.rent) || 0,
        deposit: parseFloat(editData.deposit) || 0,
        start_date: editData.start_date,
        docs_link: editData.docs_link?.trim() || null,
        updated_at: serverTimestamp(),
        ...(shouldSetActive && { status: 'Active' })
      };

      await updateDoc(doc(db, 'tenants', tenantId), updateData);

      // Update local state including status if it was changed
      setTenant(prev => ({
        ...prev,
        ...updateData,
        ...(shouldSetActive && { status: 'Active' })
      }));

      // Update property if changed
      if (editData.property_id !== tenant.property_id) {
        const newProperty = properties.find(p => p.id === editData.property_id);
        setProperty(newProperty || null);
      }

      setIsEditing(false);
    } catch (err) {
      console.error('Error saving tenant:', err);
      setSaveError('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditData(tenant);
    setIsEditing(false);
    setSaveError('');
  };

  async function handleMarkVacated() {
    setVacating(true);
    try {
      await updateDoc(doc(db, 'tenants', tenantId), {
        status: 'Vacated',
        vacated_date: new Date().toISOString().split('T')[0],
        updated_at: serverTimestamp()
      });

      setTenant(prev => ({
        ...prev,
        status: 'Vacated',
        vacated_date: new Date().toISOString().split('T')[0]
      }));
      setShowVacateModal(false);
    } catch (err) {
      console.error('Error marking tenant as vacated:', err);
      setError('Failed to update tenant status');
    } finally {
      setVacating(false);
    }
  }

  const getStatusBadge = (status) => {
    if (status === 'Active') {
      return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    }
    if (status === 'Pending') {
      return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
    }
    return 'bg-slate-700/50 text-slate-400 border border-slate-600';
  };

  const getBillStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'Pending':
        return 'bg-amber-500/20 text-amber-400';
      case 'ReportedPaid':
        return 'bg-blue-500/20 text-blue-400';
      case 'Overdue':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-slate-700/50 text-slate-400';
    }
  };

  const getMonthName = (month) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1] || '';
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !tenant) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 inline-block">
          <p className="text-red-400">{error || 'Tenant not found'}</p>
        </div>
        <div className="mt-4">
          <Link to="/admin/tenants" className="text-cyan-400 hover:text-cyan-300">
            ← Back to Tenants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            to="/admin/tenants"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors mb-2"
          >
            <ArrowLeftIcon />
            Back to Tenants
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-white">{tenant.name}</h1>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(tenant.status)}`}>
              {tenant.status}
            </span>
          </div>
          <p className="text-slate-400 mt-1">
            Tenant Code: <span className="font-mono font-medium text-cyan-400">{tenant.tenant_code}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/25"
              >
                <EditIcon />
                Edit Details
              </button>
              {tenant.status === 'Active' && (
                <button
                  onClick={() => setShowVacateModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-red-500/50 text-red-400 rounded-xl font-medium hover:bg-red-500/10 transition-colors"
                >
                  <ExitIcon />
                  Mark Vacated
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={handleCancelEdit}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-600 text-slate-300 rounded-xl font-medium hover:bg-slate-800 transition-colors"
              >
                <CloseIcon />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-green-600 transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50"
              >
                {saving ? <LoadingSpinner size="small" /> : <SaveIcon />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Save Error */}
      {saveError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-400">{saveError}</p>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-800/50">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <UserIcon />
                Personal Information
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editData.name || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
                  />
                ) : (
                  <p className="font-medium text-white">{tenant.name}</p>
                )}
              </div>

              {/* Tenant Code */}
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Tenant Code</label>
                <p className="font-mono font-medium text-cyan-400">{tenant.tenant_code}</p>
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm text-slate-400 mb-1 block flex items-center gap-2">
                  <PhoneIcon />
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editData.phone || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
                  />
                ) : (
                  <a href={`tel:${tenant.phone}`} className="font-medium text-cyan-400 hover:text-cyan-300">
                    {tenant.phone}
                  </a>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="text-sm text-slate-400 mb-1 block flex items-center gap-2">
                  <EmailIcon />
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editData.email || ''}
                    onChange={handleEditChange}
                    placeholder="tenant@example.com"
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
                  />
                ) : tenant.email ? (
                  <a href={`mailto:${tenant.email}`} className="font-medium text-cyan-400 hover:text-cyan-300">
                    {tenant.email}
                  </a>
                ) : (
                  <p className="text-slate-500">Not provided</p>
                )}
              </div>
            </div>
          </div>

          {/* Tenancy Information */}
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-800/50">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <BuildingIcon />
                Tenancy Details
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Property */}
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Property</label>
                {isEditing ? (
                  <select
                    name="property_id"
                    value={editData.property_id || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
                  >
                    <option value="">Select Property</option>
                    {properties.map(prop => (
                      <option key={prop.id} value={prop.id}>{prop.name}</option>
                    ))}
                  </select>
                ) : (
                  <div>
                    <p className="font-medium text-white">{property?.name || 'Unknown'}</p>
                    {property?.area && <p className="text-sm text-slate-400">{property.area}</p>}
                  </div>
                )}
              </div>

              {/* Start Date */}
              <div>
                <label className="text-sm text-slate-400 mb-1 block flex items-center gap-2">
                  <CalendarIcon />
                  Start Date
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    name="start_date"
                    value={editData.start_date || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
                  />
                ) : (
                  <p className="font-medium text-white">{formatDate(tenant.start_date)}</p>
                )}
              </div>

              {/* Monthly Rent */}
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Monthly Rent</label>
                {isEditing ? (
                  <input
                    type="number"
                    name="rent"
                    value={editData.rent || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
                  />
                ) : (
                  <p className="text-2xl font-bold text-white">₹{(tenant.rent || 0).toLocaleString('en-IN')}</p>
                )}
              </div>

              {/* Security Deposit */}
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Security Deposit</label>
                {isEditing ? (
                  <input
                    type="number"
                    name="deposit"
                    value={editData.deposit || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
                  />
                ) : (
                  <p className="text-2xl font-bold text-emerald-400">₹{(tenant.deposit || 0).toLocaleString('en-IN')}</p>
                )}
              </div>

              {/* Vacated Date (if vacated) */}
              {tenant.status === 'Vacated' && tenant.vacated_date && (
                <div className="sm:col-span-2 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <p className="text-sm text-slate-400 mb-1">Vacated On</p>
                  <p className="font-medium text-slate-300">{formatDate(tenant.vacated_date)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-800/50">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <DocumentIcon />
                Documents
              </h2>
            </div>
            <div className="p-6">
              {isEditing ? (
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Documents Link (Google Drive, etc.)</label>
                  <input
                    type="url"
                    name="docs_link"
                    value={editData.docs_link || ''}
                    onChange={handleEditChange}
                    placeholder="https://drive.google.com/..."
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
                  />
                </div>
              ) : tenant.docs_link ? (
                <a
                  href={tenant.docs_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-500/20 text-cyan-400 rounded-xl font-medium hover:bg-cyan-500/30 transition-colors"
                >
                  <DocumentIcon />
                  View Documents
                  <ExternalLinkIcon />
                </a>
              ) : (
                <p className="text-slate-500">No documents uploaded</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Bills Summary */}
        <div className="space-y-6">
          {/* Recent Bills */}
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-800/50 flex items-center justify-between">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <BillsIcon />
                Recent Bills
              </h2>
              <Link
                to={`/admin/tenants/${tenantId}/bills`}
                className="text-sm text-cyan-400 hover:text-cyan-300"
              >
                View all
              </Link>
            </div>
            <div className="p-4">
              {bills.length === 0 ? (
                <p className="text-center text-slate-500 py-6">No bills found</p>
              ) : (
                <div className="space-y-3">
                  {bills.map(bill => (
                    <div key={bill.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                      <div>
                        <p className="font-medium text-white">
                          {getMonthName(bill.month)} {bill.year}
                        </p>
                        <p className="text-sm text-slate-400">
                          ₹{(bill.total_amount || 0).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${getBillStatusBadge(bill.status)}`}>
                        {bill.status === 'ReportedPaid' ? 'Reported' : bill.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tenure Summary */}
          <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/30 p-6">
            <h3 className="text-sm text-cyan-300 mb-4 font-medium">Tenure Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Total Bills</span>
                <span className="font-bold text-white text-lg">{bills.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Paid</span>
                <span className="font-bold text-emerald-400 text-lg">{bills.filter(b => b.status === 'Paid').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Pending</span>
                <span className="font-bold text-amber-400 text-lg">{bills.filter(b => b.status === 'Pending' || b.status === 'Overdue').length}</span>
              </div>
            </div>
          </div>

          {/* Quick Info Card */}
          <div className="bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-xl border border-orange-500/30 p-6">
            <h3 className="text-sm text-orange-300 mb-3 font-medium">Quick Info</h3>
            <div className="space-y-2 text-sm">
              <p className="text-slate-300">
                <span className="text-orange-300">Joined:</span> {formatDate(tenant.start_date)}
              </p>
              <p className="text-slate-300">
                <span className="text-orange-300">Property:</span> {property?.name || 'N/A'}
              </p>
              <p className="text-slate-300">
                <span className="text-orange-300">Status:</span> {tenant.status}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Vacate Confirmation Modal */}
      {showVacateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 max-w-md w-full shadow-2xl">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Mark Tenant as Vacated</h3>
              <p className="text-slate-400 mb-4">
                Are you sure you want to mark <strong className="text-white">{tenant.name}</strong> as vacated?
              </p>
              <ul className="list-disc list-inside text-sm text-slate-400 mb-6 space-y-1">
                <li>Update tenant status to "Vacated"</li>
                <li>Record today's date as the vacated date</li>
                <li>Free up a bed in the property</li>
                <li>Stop future bill generation</li>
              </ul>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowVacateModal(false)}
                  disabled={vacating}
                  className="px-4 py-2.5 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMarkVacated}
                  disabled={vacating}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {vacating ? (
                    <>
                      <LoadingSpinner size="small" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ExitIcon />
                      Confirm Vacate
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
