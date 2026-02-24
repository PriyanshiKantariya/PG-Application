import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { LoadingSpinner } from '../../components/common';

// SVG Icons
const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const ViewIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

export default function TenantsListPage() {
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('Active');

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch tenants and properties in parallel
        const [tenantsSnap, propertiesSnap] = await Promise.all([
          getDocs(collection(db, 'tenants')),
          getDocs(collection(db, 'properties'))
        ]);

        // Build properties map for lookup
        const propertiesMap = {};
        const propertiesList = [];
        propertiesSnap.forEach(doc => {
          const data = { id: doc.id, ...doc.data() };
          propertiesMap[doc.id] = data;
          propertiesList.push(data);
        });
        setProperties(propertiesList.sort((a, b) => (a.name || '').localeCompare(b.name || '')));

        // Process tenants with property info
        const tenantsData = tenantsSnap.docs.map(doc => {
          const data = { id: doc.id, ...doc.data() };
          data.property = propertiesMap[data.property_id] || null;
          return data;
        });

        // Sort by tenant code
        tenantsData.sort((a, b) => (a.tenant_code || '').localeCompare(b.tenant_code || ''));

        setTenants(tenantsData);
      } catch (err) {
        console.error('Error fetching tenants:', err);
        setError('Failed to load tenants');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter tenants
  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch =
      (tenant.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tenant.phone || '').includes(searchTerm) ||
      (tenant.tenant_code || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProperty = propertyFilter === 'All' || tenant.property_id === propertyFilter;
    const matchesStatus = statusFilter === 'All' || tenant.status === statusFilter;

    return matchesSearch && matchesProperty && matchesStatus;
  });

  // Calculate counts
  const activeTenants = tenants.filter(t => t.status === 'Active').length;
  const vacatedTenants = tenants.filter(t => t.status === 'Vacated').length;

  // Status badge styling
  const getStatusBadge = (status) => {
    if (status === 'Active') {
      return 'bg-green-50 text-[#43A047] border border-green-100';
    }
    if (status === 'Pending') {
      return 'bg-amber-50 text-amber-600 border border-amber-100';
    }
    return 'bg-gray-100 text-[#757575] border border-gray-300';
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#424242]">Tenants Management</h1>
          <p className="text-[#757575] mt-1">Manage all PG tenants</p>
        </div>
        <Link
          to="/admin/tenants/new"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#1E88E5] to-[#1565C0] text-[#424242] px-4 py-2.5 rounded-lg font-medium hover:from-[#1565C0] hover:to-[#1E88E5] transition-all shadow-sm"
        >
          <PlusIcon />
          Add New Tenant
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-[#757575]">Total Tenants</p>
          <p className="text-2xl font-bold bg-gradient-to-r from-[#1E88E5] to-[#42A5F5] bg-clip-text text-transparent">{tenants.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-[#757575]">Active Tenants</p>
          <p className="text-2xl font-bold text-[#43A047]">{activeTenants}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-[#757575]">Vacated</p>
          <p className="text-2xl font-bold text-[#757575]">{vacatedTenants}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#757575]">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search by name, phone, or tenant code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F5F5F5] border border-gray-200 rounded-lg text-[#424242] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/30 focus:border-[#1E88E5] transition-colors"
            />
          </div>

          {/* Property Filter */}
          <div className="lg:w-56">
            <select
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-gray-200 rounded-lg text-[#424242] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/30 focus:border-[#1E88E5] transition-colors"
            >
              <option value="All">All Properties</option>
              {properties.map(property => (
                <option key={property.id} value={property.id}>{property.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="lg:w-40">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-gray-200 rounded-lg text-[#424242] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/30 focus:border-[#1E88E5] transition-colors"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Vacated">Vacated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tenants List */}
      {filteredTenants.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4 text-[#757575]">
            <UsersIcon />
          </div>
          <h3 className="text-lg font-medium text-[#424242] mb-2">No Tenants Found</h3>
          <p className="text-[#757575] mb-4">
            {tenants.length === 0
              ? "You haven't added any tenants yet."
              : "No tenants match your search criteria."}
          </p>
          {tenants.length === 0 && (
            <Link
              to="/admin/tenants/new"
              className="inline-flex items-center gap-2 text-[#1E88E5] hover:text-[#1565C0] font-medium"
            >
              <PlusIcon />
              Add your first tenant
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F5F5F5] border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#757575] uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#757575] uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#757575] uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#757575] uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-[#757575] uppercase tracking-wider">
                      Rent
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-[#757575] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-[#757575] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTenants.map((tenant) => (
                    <tr key={tenant.id} className="hover:bg-[#F5F5F5] transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono font-medium text-[#1E88E5]">
                          {tenant.tenant_code || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-[#424242]">{tenant.name}</p>
                        {tenant.email && (
                          <p className="text-sm text-[#757575]">{tenant.email}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-[#757575]">
                          <PhoneIcon />
                          <span>{tenant.phone || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[#424242]">
                          {tenant.property?.name || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-medium text-[#424242]">
                          ₹{(tenant.rent || 0).toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(tenant.status || 'Pending')}`}>
                          {tenant.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link
                          to={`/admin/tenants/${tenant.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-[#1E88E5] rounded-lg text-sm font-medium hover:bg-blue-50 border border-blue-100 transition-colors"
                        >
                          <ViewIcon />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredTenants.map((tenant) => (
              <Link
                key={tenant.id}
                to={`/admin/tenants/${tenant.id}`}
                className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-[#1E88E5]/30 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="font-mono text-sm font-medium text-[#1E88E5]">
                      {tenant.tenant_code || 'N/A'}
                    </span>
                    <h3 className="font-semibold text-[#424242] mt-1">{tenant.name}</h3>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(tenant.status || 'Pending')}`}>
                    {tenant.status || 'Pending'}
                  </span>
                </div>

                <div className="space-y-1 text-sm text-[#757575]">
                  <div className="flex items-center gap-1.5">
                    <PhoneIcon />
                    <span>{tenant.phone || 'N/A'}</span>
                  </div>
                  <p>{tenant.property?.name || 'Unknown Property'}</p>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-sm text-[#757575]">Monthly Rent</span>
                  <span className="font-semibold text-[#424242]">
                    ₹{(tenant.rent || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Results count */}
          <p className="text-sm text-[#757575] text-center">
            Showing {filteredTenants.length} of {tenants.length} tenants
          </p>
        </>
      )}
    </div>
  );
}
