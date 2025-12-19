// routes/employment.js
const express = require('express');
const router = express.Router();
const localStorage = require('../storage/localStorage');
const jwt = require('jsonwebtoken');


// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    req.userId = null;
    req.isAdmin = false;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    req.isAdmin = decoded.isAdmin || false;
    next();
  } catch (error) {
    req.userId = null;
    req.isAdmin = false;
    next();
  }
};

// Get all employment opportunities
router.get('/', async (req, res) => {
  try {
    const { level, education, location } = req.query;
    
    let opportunities = await localStorage.getEmploymentOpportunities();
    
    // Filter by level if provided
    if (level && level !== 'all') {
      opportunities = opportunities.filter(item => item.level === level);
    }
    
    // Filter by education if provided
    if (education) {
      opportunities = opportunities.filter(item => item.education === education);
    }
    
    // Filter by location if provided
    if (location) {
      opportunities = opportunities.filter(item => 
        item.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    // Sort by last date (urgent first)
    opportunities.sort((a, b) => {
      return new Date(a.lastDate) - new Date(b.lastDate);
    });

    console.log(`✅ Fetched ${opportunities.length} employment opportunities`);

    res.json({
      success: true,
      opportunities,
      count: opportunities.length,
    });
  } catch (error) {
    console.error('❌ Error fetching opportunities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch opportunities'
    });
  }
});

// Get opportunity by ID
router.get('/:id', async (req, res) => {
  try {
    const opportunity = await localStorage.getEmploymentOpportunityById(req.params.id);
    
    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
    }

    res.json({
      success: true,
      opportunity,
    });
  } catch (error) {
    console.error('❌ Error fetching opportunity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch opportunity'
    });
  }
});

// Post new opportunity (Admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can post opportunities'
      });
    }

    const { 
      title, 
      department, 
      description, 
      level, 
      education, 
      positions, 
      location, 
      lastDate,
      ageLimit,
      salary,
      documents,
      howToApply,
      applyLink,
      contact 
    } = req.body;

    if (!title || !department || !description || !level || !education || !positions || !location || !lastDate) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: title, department, description, level, education, positions, location, lastDate'
      });
    }

    const opportunityData = {
      title,
      department,
      description,
      level,
      education,
      positions: parseInt(positions),
      location,
      lastDate,
      ageLimit: ageLimit || '',
      salary: salary || '',
      documents: documents || '',
      howToApply,
      applyLink: applyLink || '',
      contact: contact || '',
      postedAt: new Date().toISOString(),
      postedBy: req.userId || 'admin',
    };

    const newOpportunity = await localStorage.addEmploymentOpportunity(opportunityData);
    
    console.log('✅ Opportunity posted:', newOpportunity._id);

    res.json({
      success: true,
      message: 'Opportunity posted successfully',
      opportunity: newOpportunity,
    });
  } catch (error) {
    console.error('❌ Error posting opportunity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to post opportunity'
    });
  }
});

// Seed demo opportunities
router.post('/seed-demo', async (req, res) => {
  try {
    const demoOpportunities = [
      {
        title: 'Junior Clerk',
        department: 'Gram Panchayat Office',
        description: 'Applications are invited for the post of Junior Clerk in Gram Panchayat. Candidate should have basic computer knowledge and typing skills in Marathi and English.',
        level: 'local',
        education: '12th',
        positions: 5,
        location: 'Shivaji Nagar Gram Panchayat, Pune',
        lastDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        ageLimit: '18-35 years',
        salary: '₹15,000 - ₹20,000 per month',
        documents: 'Aadhaar Card, Educational Certificates, Domicile Certificate',
        howToApply: 'Visit Gram Panchayat office with documents or apply online through official portal',
        applyLink: '',
        contact: '+91 20 2345 6789',
        postedBy: 'admin',
      },
      {
        title: 'Anganwadi Worker',
        department: 'Women & Child Development',
        description: 'Recruitment for Anganwadi Workers in various villages. Preference will be given to local candidates. Should be able to communicate in local language.',
        level: 'local',
        education: '10th',
        positions: 12,
        location: 'Pimpri-Chinchwad, Multiple locations',
        lastDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        ageLimit: '18-40 years',
        salary: '₹10,000 - ₹12,000 per month',
        documents: 'Aadhaar, Educational Certificates, Residence Proof',
        howToApply: 'Apply online at WCD Maharashtra portal or visit district office',
        contact: 'wcd.pune@gov.in',
        postedBy: 'admin',
      },
      {
        title: 'Police Constable',
        department: 'Maharashtra Police',
        description: 'Maharashtra Police recruitment for Constable posts. Physical fitness test, written exam, and interview will be conducted. Candidates should meet physical standards.',
        level: 'state',
        education: '12th',
        positions: 150,
        location: 'Maharashtra (All Districts)',
        lastDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        ageLimit: '18-28 years',
        salary: '₹25,000 - ₹35,000 per month',
        documents: 'Aadhaar, Educational Certificates, Caste Certificate (if applicable), Medical Fitness Certificate',
        howToApply: 'Apply online at mahapolice.gov.in. Physical test dates will be announced later.',
        applyLink: 'https://mahapolice.gov.in',
        contact: '1800-220-330',
        postedBy: 'admin',
      },
      {
        title: 'Assistant Engineer (Civil)',
        department: 'Public Works Department',
        description: 'Recruitment for Assistant Engineer posts in PWD Maharashtra. Diploma or Degree in Civil Engineering required. Experience in government projects will be an advantage.',
        level: 'state',
        education: 'diploma',
        positions: 25,
        location: 'Pune Division',
        lastDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
        ageLimit: '21-35 years',
        salary: '₹35,000 - ₹50,000 per month',
        documents: 'Engineering Degree/Diploma, Experience Certificate, Caste Certificate (if applicable)',
        howToApply: 'Apply online through Maharashtra PWD recruitment portal',
        contact: 'pwd.maha@gov.in',
        postedBy: 'admin',
      },
      {
        title: 'Staff Nurse',
        department: 'Health & Family Welfare',
        description: 'Government hospital recruitment for Staff Nurse positions. BSc Nursing or GNM required. Night shift duty may be required.',
        level: 'state',
        education: 'diploma',
        positions: 40,
        location: 'Government Hospitals, Maharashtra',
        lastDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
        ageLimit: '21-40 years',
        salary: '₹30,000 - ₹45,000 per month',
        documents: 'Nursing Degree/Diploma, Registration Certificate, Experience Certificate',
        howToApply: 'Apply online at health.maharashtra.gov.in',
        contact: 'recruitment.health@gov.in',
        postedBy: 'admin',
      },
      {
        title: 'Postal Assistant',
        department: 'India Post',
        description: 'India Post recruitment for Postal Assistant/Sorting Assistant. Computer knowledge is mandatory. Written exam and typing test will be conducted.',
        level: 'central',
        education: '12th',
        positions: 80,
        location: 'Maharashtra Circle',
        lastDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
        ageLimit: '18-27 years',
        salary: '₹25,500 - ₹81,000 per month (Pay Level 4)',
        documents: 'Educational Certificates, Aadhaar, Caste Certificate (if applicable)',
        howToApply: 'Apply online at indiapost.gov.in careers section',
        applyLink: 'https://indiapost.gov.in',
        contact: '1800-266-6868',
        postedBy: 'admin',
      },
      {
        title: 'SSC CHSL (10+2)',
        department: 'Staff Selection Commission',
        description: 'SSC Combined Higher Secondary Level Exam for LDC, DEO, PA, SA posts in various ministries. Computer-based exam followed by skill test.',
        level: 'central',
        education: '12th',
        positions: 4500,
        location: 'All India',
        lastDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        ageLimit: '18-27 years',
        salary: '₹19,900 - ₹63,200 per month',
        documents: 'Educational Certificates, Aadhaar, Caste/EWS Certificate (if applicable)',
        howToApply: 'Apply online at ssc.nic.in. Admit card will be available 2 weeks before exam.',
        applyLink: 'https://ssc.nic.in',
        contact: 'https://ssc.nic.in/contact-us',
        postedBy: 'admin',
      },
      {
        title: 'Railway Group D',
        department: 'Indian Railways',
        description: 'Recruitment for various Group D posts including Track Maintainer, Helper, Porter etc. Physical efficiency test will be conducted.',
        level: 'central',
        education: '10th',
        positions: 1200,
        location: 'Central Railway Zone',
        lastDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString(),
        ageLimit: '18-33 years',
        salary: '₹18,000 - ₹56,900 per month',
        documents: 'Educational Certificates, Medical Fitness Certificate, Community Certificate',
        howToApply: 'Apply online at rrbcdg.gov.in. PET dates will be announced after CBT.',
        applyLink: 'https://rrbcdg.gov.in',
        contact: '139 (Railway Enquiry)',
        postedBy: 'admin',
      },
    ];

    const addedOpportunities = [];
    
    for (const opportunity of demoOpportunities) {
      const added = await localStorage.addEmploymentOpportunity(opportunity);
      addedOpportunities.push(added);
    }

    console.log(`✅ Seeded ${addedOpportunities.length} demo opportunities`);

    res.json({
      success: true,
      message: `Successfully added ${addedOpportunities.length} demo opportunities`,
      count: addedOpportunities.length,
      opportunities: addedOpportunities,
    });
  } catch (error) {
    console.error('❌ Error seeding opportunities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed opportunities',
      error: error.message,
    });
  }
});

// Update opportunity (Admin only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update opportunities'
      });
    }

    const updates = { ...req.body };
    updates.updatedAt = new Date().toISOString();

    const updatedOpportunity = await localStorage.updateEmploymentOpportunity(req.params.id, updates);

    res.json({
      success: true,
      message: 'Opportunity updated successfully',
      opportunity: updatedOpportunity,
    });
  } catch (error) {
    console.error('❌ Error updating opportunity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update opportunity'
    });
  }
});

// Delete opportunity (Admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete opportunities'
      });
    }

    await localStorage.deleteEmploymentOpportunity(req.params.id);

    res.json({
      success: true,
      message: 'Opportunity deleted successfully',
    });
  } catch (error) {
    console.error('❌ Error deleting opportunity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete opportunity'
    });
  }
});

module.exports = router;