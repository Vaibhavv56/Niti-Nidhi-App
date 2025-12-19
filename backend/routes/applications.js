const express = require('express');
const router = express.Router();
const localStorage = require('../storage/localStorage');
const jwt = require('jsonwebtoken');

// Middleware to verify token (optional - allow unauthenticated)
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    req.userId = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    req.userId = null;
    next();
  }
};

// Test endpoint
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Applications route is working! ✅',
    timestamp: new Date().toISOString()
  });
});

// Submit application
router.post('/submit', verifyToken, async (req, res) => {
  try {
    const { schemeId, schemeName, formData, documents, deviceId } = req.body;

    console.log('📥 Received application submission:', { 
      schemeId, 
      schemeName, 
      deviceId,
      hasFormData: !!formData,
      documentsCount: documents?.length || 0
    });

    // Validation
    if (!schemeId || !schemeName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Scheme ID and name are required' 
      });
    }

    if (!formData) {
      return res.status(400).json({ 
        success: false, 
        message: 'Form data is required' 
      });
    }

    // Generate userId if not authenticated
    const userId = req.userId || deviceId || `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('👤 Using userId:', userId);
    
    const timestamp = new Date().toISOString();
    const applicationId = `APP${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    const applicationData = {
      applicationId,
      userId,
      userName: formData.fullName || 'User',
      schemeId: parseInt(schemeId),
      schemeName,
      formData,
      documents: documents || [],
      status: 'Pending',
      submittedAt: timestamp,
      updatedAt: timestamp,
    };

    // Save to local storage
    await localStorage.addApplication(applicationData);
    console.log('✅ Application saved to local storage, applicationId:', applicationId);

    res.json({
      success: true,
      message: 'Application submitted successfully',
      application: {
        id: applicationId,
        userId,
        schemeId: applicationData.schemeId,
        schemeName: applicationData.schemeName,
        status: 'Pending',
        submittedAt: timestamp,
      },
    });
  } catch (error) {
    console.error('❌ Submit application error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to submit application' 
    });
  }
});

// Get user's applications
router.get('/my-applications', verifyToken, async (req, res) => {
  try {
    const userId = req.userId || req.query.deviceId;
    
    if (!userId) {
      return res.json({
        success: true,
        applications: [],
      });
    }

    const applications = await localStorage.getApplications(userId);
    console.log(`✅ Fetched ${applications.length} applications for userId: ${userId}`);

    // Sort by submittedAt descending
    applications.sort((a, b) => {
      const dateA = new Date(a.submittedAt || 0);
      const dateB = new Date(b.submittedAt || 0);
      return dateB - dateA;
    });

    res.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error('❌ Get applications error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch applications' 
    });
  }
});

// Get application by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const applicationId = req.params.id;
    const application = await localStorage.getApplicationById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error('❌ Get application error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch application' 
    });
  }
});

// Get all applications (Admin)
router.get('/admin/all', verifyToken, async (req, res) => {
  try {
    const applications = await localStorage.getApplications(null); // Get all

    res.json({
      success: true,
      applications,
      count: applications.length,
    });
  } catch (error) {
    console.error('❌ Get all applications error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch applications' 
    });
  }
});

// Update application status (Admin)
router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const applicationId = req.params.id;

    const validStatuses = ['Pending', 'Under Review', 'Approved', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const application = await localStorage.getApplicationById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    const updateData = {
      status,
      updatedAt: new Date().toISOString(),
    };

    if (remarks) {
      updateData.remarks = remarks;
    }

    const updatedApplication = await localStorage.updateApplication(applicationId, updateData);

    res.json({
      success: true,
      message: 'Application status updated',
      application: updatedApplication,
    });
  } catch (error) {
    console.error('❌ Update application error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update application' 
    });
  }
});

module.exports = router;