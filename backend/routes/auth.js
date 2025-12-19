// const express = require('express');
// const router = express.Router();
// const { getFirestore, getAuth, FieldValue } = require('../config/firebase');
// const jwt = require('jsonwebtoken');

// // Generate JWT Token
// const generateToken = (userId) => {
//   return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
//     expiresIn: '30d',
//   });
// };

// // Send OTP via Firebase (handled by frontend)
// // This endpoint is kept for compatibility but OTP is sent directly from frontend
// router.post('/send-otp', async (req, res) => {
//   try {
//     const { phone, countryCode } = req.body;

//     if (!phone) {
//       return res.status(400).json({ success: false, message: 'Phone number is required' });
//     }

//     const fullPhone = countryCode ? `${countryCode}${phone}` : `+91${phone}`;
    
//     console.log('Send OTP request (handled by frontend Firebase):', { phone: fullPhone });

//     // OTP is sent directly from frontend using Firebase Phone Auth
//     // This endpoint just confirms the request
//     res.json({
//       success: true,
//       message: 'OTP will be sent via Firebase Phone Auth',
//       phone: fullPhone,
//       note: 'Frontend handles OTP sending using Firebase Auth SDK',
//     });
//   } catch (error) {
//     console.error('Send OTP error:', error);
//     res.status(500).json({ success: false, message: `Failed to send OTP: ${error.message}` });
//   }
// });


// const axios = require('axios');

// router.post('/token', async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const response = await axios.post(
//       'https://eca8878fd94f.ngrok-free.app/api/auth/token/',
//       { username, password }
//     );

//     res.json(response.data);
//   } catch (err) {
//     console.error(err.response?.data || err.message);
//     res.status(401).json({
//       success: false,
//       message: 'Invalid username or password',
//     });
//   }
// });


// // Verify OTP and create/update user
// router.post('/verify-otp', async (req, res) => {
//   try {
//     const { phone, idToken } = req.body;

//     if (!idToken) {
//       return res.status(400).json({ success: false, message: 'Firebase ID token is required' });
//     }

//     const auth = getAuth();
//     const db = getFirestore();

//     // Verify Firebase ID token
//     const decodedToken = await auth.verifyIdToken(idToken);
//     const firebaseUid = decodedToken.uid;
//     const phoneNumber = decodedToken.phone_number || phone || `+91${phone}`;

//     console.log('✅ Verified Firebase user:', firebaseUid);
//     console.log('📱 Phone number:', phoneNumber);

//     // Check if user exists in Firestore
//     const userRef = db.collection('users').doc(firebaseUid);
//     const userDoc = await userRef.get();

//     let userData = {
//       phone: phoneNumber,
//       firebaseUid: firebaseUid,
//       isVerified: true,
//       updatedAt: FieldValue ? FieldValue.serverTimestamp() : new Date(),
//     };

//     if (userDoc.exists) {
//       // Update existing user
//       const existingData = userDoc.data();
//       userData = { ...existingData, ...userData };
//       await userRef.update({
//         phone: phoneNumber,
//         isVerified: true,
//         updatedAt: FieldValue ? FieldValue.serverTimestamp() : new Date(),
//       });
//       console.log('✅ User updated in Firestore');
//     } else {
//       // Create new user
//       userData.createdAt = FieldValue ? FieldValue.serverTimestamp() : new Date();
//       await userRef.set(userData);
//       console.log('✅ New user created in Firestore');
//     }

//     // Get updated user data
//     const updatedDoc = await userRef.get();
//     const finalUserData = updatedDoc.data();

//     // Generate JWT token
//     const token = generateToken(firebaseUid);

//     console.log('✅ User authenticated, JWT token generated');

//     res.json({
//       success: true,
//       token,
//       user: {
//         id: firebaseUid,
//         phone: phoneNumber,
//         profile: finalUserData.profile || {},
//       },
//     });
//   } catch (error) {
//     console.error('❌ Verify OTP error:', error);
//     console.error('Error details:', error.message, error.stack);
//     res.status(500).json({ success: false, message: `Failed to verify OTP: ${error.message}` });
//   }
// });

// // Email/Password Sign Up
// router.post('/signup', async (req, res) => {
//   try {
//     const { email, password, fullName } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ success: false, message: 'Email and password are required' });
//     }

//     const auth = getAuth();
//     const db = getFirestore();

//     // Create user in Firebase Auth
//     const userRecord = await auth.createUser({
//       email,
//       password,
//       displayName: fullName,
//     });

//     // Create user document in Firestore
//     const userRef = db.collection('users').doc(userRecord.uid);
//     await userRef.set({
//       email,
//       firebaseUid: userRecord.uid,
//       profile: {
//         fullName: fullName || '',
//       },
//       isVerified: false,
//       createdAt: FieldValue ? FieldValue.serverTimestamp() : new Date(),
//       updatedAt: FieldValue ? FieldValue.serverTimestamp() : new Date(),
//     });

//     // Generate JWT token
//     const token = generateToken(userRecord.uid);

//     res.json({
//       success: true,
//       token,
//       user: {
//         id: userRecord.uid,
//         email,
//         profile: { fullName: fullName || '' },
//       },
//     });
//   } catch (error) {
//     console.error('Sign up error:', error);
//     res.status(500).json({ success: false, message: `Failed to sign up: ${error.message}` });
//   }
// });

// // Email/Password Sign In
// router.post('/signin', async (req, res) => {
//   try {
//     const { email, idToken } = req.body;

//     if (!idToken) {
//       return res.status(400).json({ success: false, message: 'Firebase ID token is required' });
//     }

//     const auth = getAuth();
//     const db = getFirestore();

//     // Verify Firebase ID token
//     const decodedToken = await auth.verifyIdToken(idToken);
//     const firebaseUid = decodedToken.uid;

//     // Get user from Firestore
//     const userRef = db.collection('users').doc(firebaseUid);
//     const userDoc = await userRef.get();

//     if (!userDoc.exists) {
//       // Create user document if doesn't exist
//       await userRef.set({
//         email: decodedToken.email,
//         firebaseUid: firebaseUid,
//         isVerified: true,
//         createdAt: FieldValue ? FieldValue.serverTimestamp() : new Date(),
//         updatedAt: FieldValue ? FieldValue.serverTimestamp() : new Date(),
//       });
//     } else {
//       // Update last login
//       await userRef.update({
//         updatedAt: FieldValue ? FieldValue.serverTimestamp() : new Date(),
//       });
//     }

//     const userData = userDoc.exists ? userDoc.data() : {};

//     // Generate JWT token
//     const token = generateToken(firebaseUid);

//     res.json({
//       success: true,
//       token,
//       user: {
//         id: firebaseUid,
//         email: decodedToken.email,
//         phone: userData.phone,
//         profile: userData.profile || {},
//       },
//     });
//   } catch (error) {
//     console.error('Sign in error:', error);
//     res.status(500).json({ success: false, message: `Failed to sign in: ${error.message}` });
//   }
// });

// // Register/Update User Profile
// router.post('/register', async (req, res) => {
//   try {
//     const token = req.headers.authorization?.replace('Bearer ', '');
    
//     if (!token) {
//       return res.status(401).json({ success: false, message: 'Authentication required' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
//     const userId = decoded.userId;

//     const db = getFirestore();
//     const userRef = db.collection('users').doc(userId);

//     const updateData = {
//       updatedAt: FieldValue ? FieldValue.serverTimestamp() : new Date(),
//     };

//     if (req.body.profile) {
//       updateData.profile = req.body.profile;
//     }
//     if (req.body.language) {
//       updateData.language = req.body.language;
//     }

//     await userRef.update(updateData);

//     const userDoc = await userRef.get();
//     const userData = userDoc.data();

//     res.json({
//       success: true,
//       user: {
//         id: userId,
//         phone: userData.phone,
//         email: userData.email,
//         profile: userData.profile || {},
//         language: userData.language,
//       },
//     });
//   } catch (error) {
//     console.error('Register error:', error);
//     res.status(500).json({ success: false, message: 'Failed to register user' });
//   }
// });

// module.exports = router;


















const express = require('express');
const router = express.Router();
const axios = require('axios');

/**
 * POST /api/auth/token
 * Proxies credentials to Django JWT API
 */
router.post('/token', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      });
    }

    const response = await axios.post(
      'https://eca8878fd94f.ngrok-free.app/api/auth/token/',
      {
        username,
        password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Forward Django JWT response directly
    res.json({
      success: true,
      access: response.data.access,
      refresh: response.data.refresh,
    });
  } catch (error) {
    console.error('Auth token error:', error.response?.data || error.message);

    res.status(401).json({
      success: false,
      message: 'Invalid username or password',
    });
  }
});

module.exports = router;
