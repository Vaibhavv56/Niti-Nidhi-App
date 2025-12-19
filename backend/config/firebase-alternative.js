// Alternative Firebase initialization using service account file
// If you prefer to use a file instead of .env variable

const admin = require('firebase-admin');
const path = require('path');

let firebaseAdmin = null;

try {
  // Option 1: Try to load from file (if exists)
  const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');
  
  try {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id || 'techfest-85e3b',
    });
    firebaseAdmin = admin;
    console.log('✅ Firebase Admin initialized from serviceAccountKey.json file');
  } catch (fileError) {
    // File doesn't exist, try .env method
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id || 'techfest-85e3b',
      });
      firebaseAdmin = admin;
      console.log('✅ Firebase Admin initialized from .env');
    } else {
      throw new Error('No Firebase credentials found');
    }
  }
} catch (error) {
  console.error('❌ Firebase Admin initialization error:', error.message);
}

const getFirestore = () => {
  if (!firebaseAdmin) {
    throw new Error('Firebase Admin not initialized');
  }
  return admin.firestore();
};

const getAuth = () => {
  if (!firebaseAdmin) {
    throw new Error('Firebase Admin not initialized');
  }
  return admin.auth();
};

const FieldValue = firebaseAdmin ? firebaseAdmin.firestore.FieldValue : null;

module.exports = {
  admin: firebaseAdmin,
  getFirestore,
  getAuth,
  FieldValue,
};



