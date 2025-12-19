const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

let db, auth;

try {
  // Path to service account key
  const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');
  
  // Check if file exists
  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(`Service account file not found at: ${serviceAccountPath}\nPlease download it from Firebase Console and place it in the backend folder.`);
  }

  // Read and parse the service account file
  const serviceAccount = require(serviceAccountPath);

  // Initialize Firebase Admin
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
  });

  console.log('✅ Firebase Admin initialized successfully');
  console.log(`✅ Project ID: ${serviceAccount.project_id}`);

  // Initialize Firestore and Auth
  db = admin.firestore();
  auth = admin.auth();

} catch (error) {
  console.error('❌ Firebase Admin initialization error:', error.message);
  console.error('\n📝 To fix this:');
  console.error('1. Go to Firebase Console → Project Settings → Service Accounts');
  console.error('2. Click "Generate new private key"');
  console.error('3. Save the file as "serviceAccountKey.json"');
  console.error('4. Place it in the backend folder\n');
  
  // Initialize dummy objects to prevent app crash
  db = null;
  auth = null;
}

// Export getFirestore function for compatibility
const getFirestore = () => {
  if (!db) {
    throw new Error('Firebase not initialized. Please check your serviceAccountKey.json file.');
  }
  return db;
};

// Export FieldValue for serverTimestamp
let FieldValue = null;
try {
  FieldValue = admin.firestore.FieldValue;
} catch (e) {
  // If Firebase not initialized, FieldValue will be null
  FieldValue = null;
}

module.exports = { 
  admin, 
  db, 
  auth, 
  getFirestore,
  FieldValue
};