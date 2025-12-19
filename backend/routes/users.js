// const express = require('express');
// const router = express.Router();
// const { getFirestore } = require('../config/firebase');
// const jwt = require('jsonwebtoken');
// const { FieldValue } = require('../config/firebase');

// // Middleware to verify token
// const verifyToken = (req, res, next) => {
//   const token = req.headers.authorization?.replace('Bearer ', '');
  
//   if (!token) {
//     return res.status(401).json({ success: false, message: 'Authentication required' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
//     req.userId = decoded.userId;
//     next();
//   } catch (error) {
//     res.status(401).json({ success: false, message: 'Invalid token' });
//   }
// };

// // Get User Profile
// router.get('/profile', verifyToken, async (req, res) => {
//   try {
//     const db = getFirestore();
//     const userRef = db.collection('users').doc(req.userId);
//     const userDoc = await userRef.get();

//     if (!userDoc.exists) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     const userData = userDoc.data();

//     res.json({
//       success: true,
//       user: {
//         id: req.userId,
//         phone: userData.phone,
//         email: userData.email,
//         profile: userData.profile || {},
//         language: userData.language || 'en',
//       },
//     });
//   } catch (error) {
//     console.error('Get profile error:', error);
//     res.status(500).json({ success: false, message: 'Failed to fetch profile' });
//   }
// });

// // Update User Profile
// router.put('/profile', verifyToken, async (req, res) => {
//   try {
//     const db = getFirestore();
//     const userRef = db.collection('users').doc(req.userId);

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
//         id: req.userId,
//         phone: userData.phone,
//         email: userData.email,
//         profile: userData.profile || {},
//         language: userData.language || 'en',
//       },
//     });
//   } catch (error) {
//     console.error('Update profile error:', error);
//     res.status(500).json({ success: false, message: 'Failed to update profile' });
//   }
// });

// module.exports = router;




























const express = require('express');
const router = express.Router();
const jwtDecode = require('jwt-decode');

/**
 * Middleware: Verify JWT (Django-issued)
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authorization token missing',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwtDecode(token);

    /**
     * Django JWT usually contains:
     * decoded.user_id
     * decoded.username
     * decoded.exp
     */
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

/**
 * GET /api/users/me
 * Get logged-in user info
 */
router.get('/me', verifyToken, async (req, res) => {
  res.json({
    success: true,
    user: {
      user_id: req.user.user_id,
      username: req.user.username,
    },
  });
});

/**
 * Example protected route
 */
router.get('/dashboard', verifyToken, async (req, res) => {
  res.json({
    success: true,
    message: 'Access granted to protected dashboard',
    user: req.user,
  });
});

module.exports = router;
