import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { LoadingSpinner } from '../../components/common';

// SVG Icons
const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export default function PropertiesListPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('All');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchProperties() {
      try {
        // Fetch all properties
        const propertiesSnap = await getDocs(collection(db, 'properties'));

        const propertiesData = [];

        for (const doc of propertiesSnap.docs) {
          const propertyData = { id: doc.id, ...doc.data() };

          // Calculate occupied beds for each property
          const tenantsQuery = query(
            collection(db, 'tenants'),
            where('property_id', '==', doc.id),
            where('status', '==', 'Active')
          );

          try {
            const tenantsSnap = await getDocs(tenantsQuery);
            propertyData.occupied_beds = tenantsSnap.size;
          } catch (err) {
            // Fallback: fetch all tenants and filter client-side
            const allTenantsSnap = await getDocs(collection(db, 'tenants'));
            const activeTenants = allTenantsSnap.docs.filter(t => {
              const tenant = t.data();
              return tenant.property_id === doc.id && tenant.status === 'Active';
            });
            propertyData.occupied_beds = activeTenants.length;
          }

          propertyData.available_beds = (propertyData.total_flats || 0) - propertyData.occupied_beds;
          propertiesData.push(propertyData);
        }

        // Sort by name
        propertiesData.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

        setProperties(propertiesData);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties');
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  // Get unique areas for filter
  const areas = [...new Set(properties.map(p => p.area).filter(Boolean))].sort();

  // Filter properties
  const filteredProperties = properties.filter(property => {
    const matchesSearch =
      (property.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (property.address || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (property.area || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesArea = areaFilter === 'All' || property.area === areaFilter;

    return matchesSearch && matchesArea;
  });

  // Calculate totals
  const totals = filteredProperties.reduce((acc, p) => ({
    totalFlats: acc.totalFlats + (p.total_flats || 0),
    occupied: acc.occupied + (p.occupied_beds || 0),
    available: acc.available + (p.available_beds || 0)
  }), { totalFlats: 0, occupied: 0, available: 0 });

  async function handleDeleteProperty() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, 'properties', deleteTarget.id));
      setProperties(prev => prev.filter(p => p.id !== deleteTarget.id));
      setShowDeleteModal(false);
      setDeleteTarget(null);
    } catch (err) {
      console.error('Error deleting property:', err);
      setError('Failed to delete property');
    } finally {
      setDeleting(false);
    }
  }

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
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Properties Management</h1>
          <p className="text-[#4a4a4a] mt-1">Manage all PG properties</p>
        </div>
        <Link
          to="/admin/properties/new"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#5B9BD5] to-[#4A8AC4] text-[#1a1a1a] px-4 py-2.5 rounded-lg font-medium hover:from-[#4A8AC4] hover:to-[#5B9BD5] transition-all shadow-sm"
        >
          <PlusIcon />
          Add New Property
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-[#4a4a4a]">Total Properties</p>
          <p className="text-2xl font-bold bg-gradient-to-r from-[#5B9BD5] to-[#42A5F5] bg-clip-text text-transparent">{filteredProperties.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-[#4a4a4a]">Total Flats</p>
          <p className="text-2xl font-bold text-[#1a1a1a]">{totals.totalFlats}</p>
          <p className="text-xs text-[#4a4a4a]">{totals.occupied} occupied</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-[#4a4a4a]">Available Flats</p>
          <p className="text-2xl font-bold text-[#43A047]">{totals.available}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#4a4a4a]">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search by name, area, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F5F5F5] border border-gray-200 rounded-lg text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5B9BD5]/30 focus:border-[#5B9BD5] transition-colors"
            />
          </div>

          {/* Area Filter */}
          <div className="sm:w-48">
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-gray-200 rounded-lg text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#5B9BD5]/30 focus:border-[#5B9BD5] transition-colors"
            >
              <option value="All">All Areas</option>
              {areas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Properties List */}
      {filteredProperties.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4 text-[#4a4a4a]">
            <BuildingIcon />
          </div>
          <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">No Properties Found</h3>
          <p className="text-[#4a4a4a] mb-4">
            {properties.length === 0
              ? "You haven't added any properties yet."
              : "No properties match your search criteria."}
          </p>
          {properties.length === 0 && (
            <Link
              to="/admin/properties/new"
              className="inline-flex items-center gap-2 text-[#5B9BD5] hover:text-[#4A8AC4] font-medium"
            >
              <PlusIcon />
              Add your first property
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
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#4a4a4a] uppercase tracking-wider">
                      Property Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#4a4a4a] uppercase tracking-wider">
                      Area
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-[#4a4a4a] uppercase tracking-wider">
                      Total Flats
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-[#4a4a4a] uppercase tracking-wider">
                      Occupied
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-[#4a4a4a] uppercase tracking-wider">
                      Available
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-[#4a4a4a] uppercase tracking-wider">
                      Rent Range
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-[#4a4a4a] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProperties.map((property) => (
                    <tr key={property.id} className="hover:bg-[#F5F5F5] transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-[#1a1a1a]">{property.name}</p>
                          <p className="text-sm text-[#4a4a4a] truncate max-w-xs">{property.address}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-[#5B9BD5] border border-blue-100">
                          {property.area || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-[#1a1a1a]">
                        {property.total_flats || 0}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`font-medium ${property.occupied_beds > 0 ? 'text-amber-600' : 'text-[#4a4a4a]'}`}>
                          {property.occupied_beds || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`font-medium ${property.available_beds > 0 ? 'text-[#43A047]' : 'text-red-600'}`}>
                          {property.available_beds || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-[#1a1a1a]">
                        {property.min_rent && property.max_rent
                          ? `${Number(property.min_rent).toLocaleString('en-IN')} - ${Number(property.max_rent).toLocaleString('en-IN')}`
                          : (property.default_rent || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/admin/properties/${property.id}/edit`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-[#5B9BD5] rounded-lg text-sm font-medium hover:bg-blue-100 border border-blue-100 transition-colors"
                          >
                            <EditIcon />
                            Edit
                          </Link>
                          <button
                            onClick={() => { setDeleteTarget(property); setShowDeleteModal(true); }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 border border-red-100 transition-colors"
                          >
                            <TrashIcon />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredProperties.map((property) => (
              <div key={property.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-[#1a1a1a]">{property.name}</h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-[#5B9BD5] border border-blue-100 mt-1">
                      {property.area || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/admin/properties/${property.id}/edit`}
                      className="p-2 text-[#5B9BD5] hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <EditIcon />
                    </Link>
                    <button
                      onClick={() => { setDeleteTarget(property); setShowDeleteModal(true); }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-[#4a4a4a] mb-3 line-clamp-1">{property.address}</p>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-xs text-[#4a4a4a]">Total</p>
                    <p className="font-semibold text-[#1a1a1a]">{property.total_flats || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-[#4a4a4a]">Occupied</p>
                    <p className="font-semibold text-amber-600">{property.occupied_beds || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-[#4a4a4a]">Available</p>
                    <p className={`font-semibold ${property.available_beds > 0 ? 'text-[#43A047]' : 'text-red-600'}`}>
                      {property.available_beds || 0}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-[#4a4a4a]">
                    Rent Range: <span className="font-medium text-[#1a1a1a]">
                      {property.min_rent && property.max_rent
                        ? `${Number(property.min_rent).toLocaleString('en-IN')} - ${Number(property.max_rent).toLocaleString('en-IN')}`
                        : (property.default_rent || 0).toLocaleString('en-IN')}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 max-w-md w-full shadow-2xl">
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">Delete Property</h3>
              <p className="text-[#4a4a4a] mb-4">
                Are you sure you want to permanently delete <strong className="text-[#1a1a1a]">{deleteTarget.name}</strong>?
              </p>
              {deleteTarget.occupied_beds > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                  <p className="text-amber-700 text-sm font-medium">⚠️ Warning: This property has {deleteTarget.occupied_beds} active tenant(s). Deleting it will leave those tenants without an assigned property.</p>
                </div>
              )}
              <p className="text-sm text-red-600 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => { setShowDeleteModal(false); setDeleteTarget(null); }}
                  disabled={deleting}
                  className="px-4 py-2.5 border border-gray-300 text-[#1a1a1a] rounded-xl hover:bg-[#F5F5F5] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProperty}
                  disabled={deleting}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <LoadingSpinner size="small" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <TrashIcon />
                      Delete Property
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
