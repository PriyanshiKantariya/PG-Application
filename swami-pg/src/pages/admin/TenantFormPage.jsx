import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, getDocs, addDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { LoadingSpinner } from '../../components/common';

// SVG Icons
const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const SaveIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default function TenantFormPage() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    property_id: '',
    tenant_code: '',
    start_date: '',
    rent: '',
    deposit: '',
    docs_link: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch properties
        const propertiesSnap = await getDocs(collection(db, 'properties'));
        const propertiesData = propertiesSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        propertiesData.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        setProperties(propertiesData);

        // Generate next tenant code
        const tenantsSnap = await getDocs(collection(db, 'tenants'));
        let maxCode = 100;
        tenantsSnap.forEach(doc => {
          const code = doc.data().tenant_code || '';
          const match = code.match(/SPG(\d+)/);
          if (match) {
            const num = parseInt(match[1]);
            if (num >= maxCode) maxCode = num + 1;
          }
        });
        
        setFormData(prev => ({
          ...prev,
          tenant_code: `SPG${maxCode.toString().padStart(3, '0')}`
        }));
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Handle property selection - auto-fill rent and deposit
  function handlePropertyChange(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    setFormData(prev => ({
      ...prev,
      property_id: propertyId,
      rent: property?.default_rent?.toString() || prev.rent,
      deposit: property?.default_deposit?.toString() || prev.deposit
    }));
  }

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === 'property_id') {
      handlePropertyChange(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Full name is required');
      return;
    }
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone.trim())) {
      setError('Valid 10-digit phone number is required');
      return;
    }
    if (!formData.property_id) {
      setError('Please select a property');
      return;
    }
    if (!formData.tenant_code.trim()) {
      setError('Tenant code is required');
      return;
    }
    if (!formData.start_date) {
      setError('Start date is required');
      return;
    }
    if (!formData.rent || parseFloat(formData.rent) <= 0) {
      setError('Monthly rent must be a positive number');
      return;
    }

    setSaving(true);

    try {
      // Check if tenant code is unique
      const existingCodeQuery = query(
        collection(db, 'tenants'),
        where('tenant_code', '==', formData.tenant_code.trim())
      );
      const existingSnap = await getDocs(existingCodeQuery);
      
      if (!existingSnap.empty) {
        setError('Tenant code already exists. Please use a different code.');
        setSaving(false);
        return;
      }

      // Check if phone is unique
      const existingPhoneQuery = query(
        collection(db, 'tenants'),
        where('phone', '==', formData.phone.trim())
      );
      const existingPhoneSnap = await getDocs(existingPhoneQuery);
      
      if (!existingPhoneSnap.empty) {
        setError('A tenant with this phone number already exists.');
        setSaving(false);
        return;
      }

      // Create tenant
      await addDoc(collection(db, 'tenants'), {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || null,
        property_id: formData.property_id,
        tenant_code: formData.tenant_code.trim(),
        start_date: formData.start_date,
        rent: parseFloat(formData.rent),
        deposit: parseFloat(formData.deposit) || 0,
        docs_link: formData.docs_link.trim() || null,
        status: 'Active',
        vacated_date: null,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });

      navigate('/admin/tenants');
    } catch (err) {
      console.error('Error saving tenant:', err);
      setError('Failed to save tenant. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/admin/tenants"
          className="inline-flex items-center gap-2 text-[#757575] hover:text-[#1E88E5] transition-colors mb-4"
        >
          <ArrowLeftIcon />
          Back to Tenants
        </Link>
        <h1 className="text-2xl font-bold text-[#212121]">Add New Tenant</h1>
        <p className="text-[#757575] mt-1">Enter tenant details to register a new tenant</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-[#C62828]/20 rounded-lg p-4 mb-6">
          <p className="text-[#C62828] text-sm">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-[#E0E0E0] card-shadow">
        <div className="p-6 space-y-5">
          {/* Personal Information Section */}
          <div className="pb-4 border-b border-[#E0E0E0]">
            <h2 className="text-lg font-semibold text-[#212121] mb-4">Personal Information</h2>
            
            {/* Full Name */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-[#212121] mb-1.5">
                Full Name <span className="text-[#C62828]">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Vivek Sharma"
                className="w-full px-4 py-2.5 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5]"
              />
            </div>

            {/* Phone & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-[#212121] mb-1.5">
                  Phone Number <span className="text-[#C62828]">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  className="w-full px-4 py-2.5 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5]"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#212121] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Optional"
                  className="w-full px-4 py-2.5 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5]"
                />
              </div>
            </div>
          </div>

          {/* Tenancy Details Section */}
          <div className="pb-4 border-b border-[#E0E0E0]">
            <h2 className="text-lg font-semibold text-[#212121] mb-4">Tenancy Details</h2>
            
            {/* Property Selection */}
            <div className="mb-4">
              <label htmlFor="property_id" className="block text-sm font-medium text-[#212121] mb-1.5">
                Select Property <span className="text-[#C62828]">*</span>
              </label>
              <select
                id="property_id"
                name="property_id"
                value={formData.property_id}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] bg-white"
              >
                <option value="">Choose a property...</option>
                {properties.map(property => (
                  <option key={property.id} value={property.id}>
                    {property.name} ({property.area})
                  </option>
                ))}
              </select>
            </div>

            {/* Tenant Code & Start Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="tenant_code" className="block text-sm font-medium text-[#212121] mb-1.5">
                  Tenant Code <span className="text-[#C62828]">*</span>
                </label>
                <input
                  type="text"
                  id="tenant_code"
                  name="tenant_code"
                  value={formData.tenant_code}
                  onChange={handleChange}
                  placeholder="e.g., SPG101"
                  className="w-full px-4 py-2.5 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] font-mono"
                />
                <p className="text-xs text-[#757575] mt-1">Auto-generated, but can be changed</p>
              </div>
              <div>
                <label htmlFor="start_date" className="block text-sm font-medium text-[#212121] mb-1.5">
                  Start Date <span className="text-[#C62828]">*</span>
                </label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5]"
                />
              </div>
            </div>

            {/* Rent & Deposit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="rent" className="block text-sm font-medium text-[#212121] mb-1.5">
                  Monthly Rent (₹) <span className="text-[#C62828]">*</span>
                </label>
                <input
                  type="number"
                  id="rent"
                  name="rent"
                  value={formData.rent}
                  onChange={handleChange}
                  min="0"
                  step="100"
                  placeholder="e.g., 6500"
                  className="w-full px-4 py-2.5 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5]"
                />
                <p className="text-xs text-[#757575] mt-1">Auto-filled from property default</p>
              </div>
              <div>
                <label htmlFor="deposit" className="block text-sm font-medium text-[#212121] mb-1.5">
                  Deposit (₹)
                </label>
                <input
                  type="number"
                  id="deposit"
                  name="deposit"
                  value={formData.deposit}
                  onChange={handleChange}
                  min="0"
                  step="100"
                  placeholder="e.g., 3000"
                  className="w-full px-4 py-2.5 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5]"
                />
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div>
            <h2 className="text-lg font-semibold text-[#212121] mb-4">Documents</h2>
            
            <div>
              <label htmlFor="docs_link" className="block text-sm font-medium text-[#212121] mb-1.5">
                Documents Link
              </label>
              <input
                type="url"
                id="docs_link"
                name="docs_link"
                value={formData.docs_link}
                onChange={handleChange}
                placeholder="e.g., https://drive.google.com/..."
                className="w-full px-4 py-2.5 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5]"
              />
              <p className="text-xs text-[#757575] mt-1">Link to Google Drive folder with ID proof, agreement, etc.</p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="px-6 py-4 bg-[#F5F5F5] border-t border-[#E0E0E0] rounded-b-lg flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Link
            to="/admin/tenants"
            className="px-6 py-2.5 border border-[#E0E0E0] bg-white text-[#757575] rounded-lg font-medium hover:bg-[#F5F5F5] transition-colors text-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1E88E5] text-white rounded-lg font-medium hover:bg-[#1565C0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <LoadingSpinner size="small" />
                Adding...
              </>
            ) : (
              <>
                <SaveIcon />
                Add Tenant
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
