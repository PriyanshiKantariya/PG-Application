import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [tenantData, setTenantData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        console.log('User logged in:', user.uid, user.email);
        
        try {
          // Check if user is admin
          const adminDoc = await getDoc(doc(db, 'admins', user.uid));
          
          if (adminDoc.exists()) {
            console.log('User is admin');
            setUserRole('admin');
            setTenantData(null);
            setLoading(false);
            return;
          }
          
          // Check if tenant document exists with document ID matching user UID
          console.log('Checking tenants collection for user:', user.uid);
          const tenantDocById = await getDoc(doc(db, 'tenants', user.uid));
          
          if (tenantDocById.exists()) {
            console.log('Tenant found by document ID');
            setUserRole('tenant');
            setTenantData({ id: tenantDocById.id, ...tenantDocById.data() });
            setLoading(false);
            return;
          }
          
          // Fallback: Check if tenant document has auth_uid field matching user UID
          const tenantsQuery = query(
            collection(db, 'tenants'),
            where('auth_uid', '==', user.uid)
          );
          const tenantSnapshot = await getDocs(tenantsQuery);
          
          console.log('Tenant query by auth_uid:', tenantSnapshot.empty ? 'No tenant found' : 'Tenant found');
          
          if (!tenantSnapshot.empty) {
            setUserRole('tenant');
            setTenantData({ id: tenantSnapshot.docs[0].id, ...tenantSnapshot.docs[0].data() });
            console.log('Tenant data loaded:', tenantSnapshot.docs[0].id);
            setLoading(false);
            return;
          }
          
          // Fallback 2: Get ALL tenants and do case-insensitive email matching
          if (user.email) {
            console.log('Searching all tenants for email match...');
            const allTenantsSnap = await getDocs(collection(db, 'tenants'));
            
            let matchedTenant = null;
            const userEmailLower = user.email.toLowerCase().trim();
            
            allTenantsSnap.forEach(docSnap => {
              const data = docSnap.data();
              const tenantEmail = (data.email || '').toLowerCase().trim();
              console.log('Checking tenant:', docSnap.id, 'email:', tenantEmail);
              
              if (tenantEmail === userEmailLower) {
                matchedTenant = { id: docSnap.id, ...data };
              }
            });
            
            if (matchedTenant) {
              console.log('Tenant matched by email (case-insensitive):', matchedTenant.id);
              setUserRole('tenant');
              setTenantData(matchedTenant);
              setLoading(false);
              return;
            }
            
            console.warn('No tenant document found for user:', user.uid, 'email:', user.email);
            console.log('Total tenants checked:', allTenantsSnap.size);
          } else {
            console.warn('No tenant document found for user:', user.uid);
          }
          
          // No tenant found
          setUserRole(null);
          setTenantData(null);
          
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserRole(null);
          setTenantData(null);
        }
      } else {
        setUserRole(null);
        setTenantData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUserRole(null);
    setTenantData(null);
  };

  const value = {
    currentUser,
    user: currentUser,
    userRole,
    tenantData,
    loading,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
