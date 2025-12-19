const express = require('express');
const router = express.Router();
const localStorage = require('../storage/localStorage');
const jwt = require('jsonwebtoken');

// Middleware to verify token (optional)
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

// Get all schemes
router.get('/', (req, res) => {
  const schemes = [
    { 
      id: 1, 
      name: 'Pradhan Mantri Awas Yojana (PMAY)', 
      category: 'Housing',
      description: 'Housing scheme to provide affordable pucca houses to urban and rural poor',
      eligibility: 'Below poverty line'
    },
    { 
      id: 2, 
      name: 'Pradhan Mantri Jan Dhan Yojana (PMJDY)', 
      category: 'Business',
      description: 'Financial inclusion mission to provide no-frills bank accounts',
      eligibility: 'All citizens'
    },
    { 
      id: 3, 
      name: 'Ayushman Bharat', 
      category: 'Health',
      description: 'Health insurance for poor families',
      eligibility: 'Below poverty line'
    },
    { 
      id: 4, 
      name: 'Pradhan Mantri Kisan Samman Nidhi', 
      category: 'Agriculture',
      description: 'Income support for small and marginal farmers',
      eligibility: 'Small and marginal farmers'
    },
    { 
      id: 5, 
      name: 'Beti Bachao Beti Padhao', 
      category: 'Women',
      description: 'Save and educate the girl child scheme',
      eligibility: 'Girl child'
    },
    { 
      id: 6, 
      name: 'Scholarship for Higher Education', 
      category: 'Education',
      description: 'Financial aid for meritorious students',
      eligibility: 'Students below 25 years'
    },
  ];

  res.json({ success: true, schemes });
});

// Get scheme by ID
router.get('/:id', (req, res) => {
  const schemes = [
    { 
      id: 1, 
      name: 'Pradhan Mantri Awas Yojana (PMAY)', 
      category: 'Housing',
      description: 'Housing scheme to provide affordable pucca houses to urban and rural poor with amenities by a target year.',
      eligibility: 'Below poverty line',
      benefits: [
        'Financial assistance for house construction',
        'Interest subsidy on home loans',
        'Affordable housing for all'
      ],
      documents: [
        'Aadhaar Card',
        'Income Certificate',
        'Residence Proof',
        'Bank Account Details'
      ]
    },
    { 
      id: 2, 
      name: 'Pradhan Mantri Jan Dhan Yojana (PMJDY)', 
      category: 'Business',
      description: 'Financial inclusion mission to provide no-frills bank accounts, RuPay cards, and access to financial services to all households.',
      eligibility: 'All citizens',
      benefits: [
        'Zero balance bank account',
        'RuPay debit card',
        'Accident insurance cover',
        'Overdraft facility'
      ],
      documents: [
        'Aadhaar Card',
        'Address Proof',
        'Passport size photo'
      ]
    },
    { 
      id: 3, 
      name: 'Ayushman Bharat', 
      category: 'Health',
      description: 'Health insurance for poor families',
      eligibility: 'Below poverty line',
      benefits: [
        'Health insurance up to ₹5 lakh',
        'Cashless treatment',
        'Free medicines'
      ],
      documents: [
        'Aadhaar Card',
        'Ration Card',
        'Income Certificate'
      ]
    },
    { 
      id: 4, 
      name: 'Pradhan Mantri Kisan Samman Nidhi', 
      category: 'Agriculture',
      description: 'Income support of ₹6,000 per year in three installments to eligible small and marginal farmers.',
      eligibility: 'Small and marginal farmers',
      benefits: [
        'Direct income support',
        '₹6,000 per year in 3 installments',
        'Financial security for farmers'
      ],
      documents: [
        'Aadhaar Card',
        'Land ownership documents',
        'Bank Account Details'
      ]
    },
    { 
      id: 5, 
      name: 'Beti Bachao Beti Padhao', 
      category: 'Women',
      description: 'Save and educate the girl child scheme providing financial support for girls\' education and welfare.',
      eligibility: 'Girl child',
      benefits: [
        'Financial support for education',
        'Awareness campaigns',
        'Gender equality initiatives'
      ],
      documents: [
        'Birth Certificate',
        'Aadhaar Card',
        'Bank Account Details'
      ]
    },
    { 
      id: 6, 
      name: 'Scholarship for Higher Education', 
      category: 'Education',
      description: 'Financial aid for meritorious students pursuing higher education in recognized institutions.',
      eligibility: 'Students below 25 years',
      benefits: [
        'Financial assistance for education',
        'Tuition fee support',
        'Book allowance'
      ],
      documents: [
        'Aadhaar Card',
        'Mark sheets',
        'Income Certificate',
        'Admission proof'
      ]
    },
  ];

  const schemeId = parseInt(req.params.id);
  const scheme = schemes.find(s => s.id === schemeId);

  if (!scheme) {
    return res.status(404).json({ success: false, message: 'Scheme not found' });
  }

  res.json({ success: true, scheme });
});

// Submit scheme application
router.post('/apply', verifyToken, async (req, res) => {
  try {
    const { schemeId, schemeName, applicationData, userName, deviceId } = req.body;

    console.log('📥 Received scheme application:', { schemeId, schemeName, userName, deviceId });

    if (!schemeId || !schemeName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Scheme ID and name are required' 
      });
    }

    if (!applicationData) {
      return res.status(400).json({ 
        success: false, 
        message: 'Application data is required' 
      });
    }

    // Generate userId if not authenticated
    const userId = req.userId || deviceId || `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('👤 Using userId:', userId);
    
    const timestamp = new Date().toISOString();
    const applicationId = `APP${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    const application = {
      applicationId,
      userId,
      userName: userName || 'User',
      schemeId,
      schemeName,
      applicationData,
      status: 'Pending',
      submittedAt: timestamp,
      updatedAt: timestamp,
    };

    // Save to local storage (you'll need to add this function to localStorage.js)
    await localStorage.addApplication(application);
    console.log('✅ Application saved to local storage, applicationId:', applicationId);

    res.json({
      success: true,
      message: 'Application submitted successfully',
      application: {
        id: applicationId,
        userId,
        schemeId,
        schemeName,
        status: 'Pending',
        submittedAt: timestamp,
      },
    });
  } catch (error) {
    console.error('❌ Submit application error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit application' 
    });
  }
});

// Get user's applications
router.get('/applications/my', verifyToken, async (req, res) => {
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

// Test endpoint
router.get('/test/connection', (req, res) => {
  res.json({
    success: true,
    message: 'Schemes route is working! ✅',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;