const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Get user documents (for pre-filling forms)
router.get('/user-documents', verifyToken, async (req, res) => {
  try {
    // In a real app, fetch from database
    // For now, return structure
    res.json({
      success: true,
      documents: [],
      message: 'Documents will be fetched from database',
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch documents' });
  }
});

module.exports = router;



