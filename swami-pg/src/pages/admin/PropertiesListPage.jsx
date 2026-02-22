import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
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

export default function PropertiesListPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('All');

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
          
          propertyData.available_beds = (propertyData.total_beds || 0) - propertyData.occupied_beds;
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
    totalBeds: acc.totalBeds + (p.total_beds || 0),
    occupied: acc.occupied + (p.occupied_beds || 0),
    available: acc.available + (p.available_beds || 0)
  }), { totalBeds: 0, occupied: 0, available: 0 });

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Properties Management</h1>
          <p className="text-slate-400 mt-1">Manage all PG properties</p>
        </div>
        <Link
          to="/admin/properties/new"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25"
        >
          <PlusIcon />
          Add New Property
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 p-4">
          <p className="text-sm text-slate-400">Total Properties</p>
          <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{filteredProperties.length}</p>
        </div>
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 p-4">
          <p className="text-sm text-slate-400">Total Beds</p>
          <p className="text-2xl font-bold text-white">{totals.totalBeds}</p>
          <p className="text-xs text-slate-400">{totals.occupied} occupied</p>
        </div>
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 p-4">
          <p className="text-sm text-slate-400">Available Beds</p>
          <p className="text-2xl font-bold text-emerald-400">{totals.available}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search by name, area, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Area Filter */}
          <div className="sm:w-48">
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-colors"
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
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 p-12 text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <BuildingIcon />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No Properties Found</h3>
          <p className="text-slate-400 mb-4">
            {properties.length === 0 
              ? "You haven't added any properties yet." 
              : "No properties match your search criteria."}
          </p>
          {properties.length === 0 && (
            <Link
              to="/admin/properties/new"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium"
            >
              <PlusIcon />
              Add your first property
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Property Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Area
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Total Beds
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Occupied
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Available
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Default Rent
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {filteredProperties.map((property) => (
                    <tr key={property.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-white">{property.name}</p>
                          <p className="text-sm text-slate-400 truncate max-w-xs">{property.address}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          {property.area || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-white">
                        {property.total_beds || 0}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`font-medium ${property.occupied_beds > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                          {property.occupied_beds || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`font-medium ${property.available_beds > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {property.available_beds || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-white">
                        ₹{(property.default_rent || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link
                          to={`/admin/properties/${property.id}/edit`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 text-cyan-400 rounded-lg text-sm font-medium hover:bg-cyan-500/20 border border-cyan-500/20 transition-colors"
                        >
                          <EditIcon />
                          Edit
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
            {filteredProperties.map((property) => (
              <div key={property.id} className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{property.name}</h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mt-1">
                      {property.area || 'N/A'}
                    </span>
                  </div>
                  <Link
                    to={`/admin/properties/${property.id}/edit`}
                    className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                  >
                    <EditIcon />
                  </Link>
                </div>
                
                <p className="text-sm text-slate-400 mb-3 line-clamp-1">{property.address}</p>
                
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-700/50">
                  <div className="text-center">
                    <p className="text-xs text-slate-400">Total</p>
                    <p className="font-semibold text-white">{property.total_beds || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-400">Occupied</p>
                    <p className="font-semibold text-amber-400">{property.occupied_beds || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-400">Available</p>
                    <p className={`font-semibold ${property.available_beds > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {property.available_beds || 0}
                    </p>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-slate-700/50">
                  <p className="text-sm text-slate-400">
                    Default Rent: <span className="font-medium text-white">₹{(property.default_rent || 0).toLocaleString('en-IN')}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
