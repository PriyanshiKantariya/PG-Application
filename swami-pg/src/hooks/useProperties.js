import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

// Fetch all properties with available beds calculated
export function useProperties(areaFilter = null, showOnHomepageOnly = false) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true);
        
        // Fetch all properties
        const propertiesSnapshot = await getDocs(collection(db, 'properties'));
        const propertiesData = [];

        for (const propertyDoc of propertiesSnapshot.docs) {
          const property = { id: propertyDoc.id, ...propertyDoc.data() };
          
          // Skip properties not meant for homepage if filter is enabled
          if (showOnHomepageOnly && property.showOnHomepage === false) {
            continue;
          }
          
          // Calculate available beds
          const tenantsQuery = query(
            collection(db, 'tenants'),
            where('property_id', '==', propertyDoc.id),
            where('status', '==', 'Active')
          );
          const tenantsSnapshot = await getDocs(tenantsQuery);
          
          property.occupied_beds = tenantsSnapshot.size;
          property.available_beds = property.total_beds - tenantsSnapshot.size;
          
          propertiesData.push(property);
        }

        // Apply area filter if provided
        let filteredProperties = propertiesData;
        if (areaFilter && areaFilter !== 'All Areas') {
          filteredProperties = propertiesData.filter(p => p.area === areaFilter);
        }

        setProperties(filteredProperties);
        setError(null);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, [areaFilter, showOnHomepageOnly]);

  return { properties, loading, error };
}

// Fetch single property by ID
export function useProperty(propertyId) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProperty() {
      if (!propertyId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const propertyDoc = await getDoc(doc(db, 'properties', propertyId));
        
        if (!propertyDoc.exists()) {
          setError('Property not found');
          setProperty(null);
        } else {
          const propertyData = { id: propertyDoc.id, ...propertyDoc.data() };
          
          // Calculate available beds
          const tenantsQuery = query(
            collection(db, 'tenants'),
            where('property_id', '==', propertyId),
            where('status', '==', 'Active')
          );
          const tenantsSnapshot = await getDocs(tenantsQuery);
          
          propertyData.occupied_beds = tenantsSnapshot.size;
          propertyData.available_beds = propertyData.total_beds - tenantsSnapshot.size;
          
          setProperty(propertyData);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching property:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProperty();
  }, [propertyId]);

  return { property, loading, error };
}

// Get unique areas for filter dropdown
export function useAreas() {
  const [areas, setAreas] = useState(['All Areas']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAreas() {
      try {
        const propertiesSnapshot = await getDocs(collection(db, 'properties'));
        const uniqueAreas = new Set();
        
        propertiesSnapshot.docs.forEach(doc => {
          const area = doc.data().area;
          if (area) uniqueAreas.add(area);
        });

        setAreas(['All Areas', ...Array.from(uniqueAreas).sort()]);
      } catch (err) {
        console.error('Error fetching areas:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAreas();
  }, []);

  return { areas, loading };
}
