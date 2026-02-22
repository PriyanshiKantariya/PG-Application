// Temporary script to fix tenant auth_uid linking
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCTMJ40i7BYhoiHrbatgkeODQ_I50cdpQg",
  authDomain: "swami-pg.firebaseapp.com",
  projectId: "swami-pg",
  storageBucket: "swami-pg.firebasestorage.app",
  messagingSenderId: "648738499371",
  appId: "1:648738499371:web:594e36cb242331f95a336e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// The user's Firebase Auth UID
const USER_UID = 'dt96gjZiHwSPNfRdgBbN6z9cdfK2';
const USER_EMAIL = 'piyukan07@gmail.com';

async function fixTenantLink() {
  console.log('\n=== Checking Tenants Collection ===\n');
  
  // List all tenants
  const snapshot = await getDocs(collection(db, 'tenants'));
  
  if (snapshot.empty) {
    console.log('No tenants found in the database!');
    console.log('You need to create a tenant document in Firestore first.');
    return;
  }
  
  console.log('Found tenants:');
  let matchingTenant = null;
  
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    console.log(`  - Document ID: ${docSnap.id}`);
    console.log(`    Email: ${data.email || 'NOT SET'}`);
    console.log(`    auth_uid: ${data.auth_uid || 'NOT SET'}`);
    console.log(`    Name: ${data.name || 'NOT SET'}`);
    console.log('');
    
    // Check if this tenant matches by email
    if (data.email === USER_EMAIL) {
      matchingTenant = { id: docSnap.id, ...data };
    }
  });
  
  if (matchingTenant) {
    console.log(`\nFound tenant matching email ${USER_EMAIL}!`);
    console.log(`Tenant Document ID: ${matchingTenant.id}`);
    
    if (matchingTenant.auth_uid === USER_UID) {
      console.log('auth_uid is already correctly set!');
    } else {
      console.log(`Updating auth_uid to: ${USER_UID}`);
      
      await updateDoc(doc(db, 'tenants', matchingTenant.id), {
        auth_uid: USER_UID
      });
      
      console.log('\n✅ Successfully updated tenant auth_uid!');
      console.log('Please refresh the app and try logging in again.');
    }
  } else {
    console.log(`\nNo tenant found with email: ${USER_EMAIL}`);
    console.log('You need to create a tenant document with this email in Firestore.');
    console.log('\nTo fix this, create a tenant document in Firestore with:');
    console.log(`  - email: "${USER_EMAIL}"`);
    console.log(`  - auth_uid: "${USER_UID}"`);
  }
  
  process.exit(0);
}

fixTenantLink().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
