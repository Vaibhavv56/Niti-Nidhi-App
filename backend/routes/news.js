const express = require('express');
const router = express.Router();
const localStorage = require('../storage/localStorage');
const jwt = require('jsonwebtoken');

// Middleware to verify token (optional for reading, required for posting)
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

// Test endpoint
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'News route is working! ✅',
    timestamp: new Date().toISOString()
  });
});

// Get all news
router.get('/', async (req, res) => {
  try {
    const { level, location } = req.query;
    
    let news = await localStorage.getNews();
    
    // Filter by level if provided
    if (level && level !== 'all') {
      news = news.filter(item => item.level === level);
    }
    
    // Filter by location if provided
    if (location) {
      news = news.filter(item => 
        !item.location || 
        item.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    // Sort by priority and date
    news.sort((a, b) => {
      // High priority first
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (a.priority !== 'high' && b.priority === 'high') return 1;
      
      // Then by date (newest first)
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    });

    console.log(`✅ Fetched ${news.length} news items`);

    res.json({
      success: true,
      news,
      count: news.length,
    });
  } catch (error) {
    console.error('❌ Error fetching news:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news'
    });
  }
});

// Get news by ID
router.get('/:id', async (req, res) => {
  try {
    const newsItem = await localStorage.getNewsById(req.params.id);
    
    if (!newsItem) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    res.json({
      success: true,
      news: newsItem,
    });
  } catch (error) {
    console.error('❌ Error fetching news:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news'
    });
  }
});

// Post new news (Admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    // Check if user is admin (you can customize this logic)
    if (!req.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can post news'
      });
    }

    const { title, description, level, location, priority, contact } = req.body;

    if (!title || !description || !level) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and level are required'
      });
    }

    const validLevels = ['gram_panchayat', 'zilla_parishad', 'district', 'state', 'national'];
    if (!validLevels.includes(level)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid level'
      });
    }

    const newsData = {
      title,
      description,
      level,
      location: location || '',
      priority: priority || 'normal',
      contact: contact || '',
      publishedAt: new Date().toISOString(),
      publishedBy: req.userId || 'admin',
    };

    const newNews = await localStorage.addNews(newsData);
    
    console.log('✅ News published:', newNews._id);

    res.json({
      success: true,
      message: 'News published successfully',
      news: newNews,
    });
  } catch (error) {
    console.error('❌ Error posting news:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to post news'
    });
  }
});

// Update news (Admin only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update news'
      });
    }

    const { title, description, level, location, priority, contact } = req.body;
    
    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (level) updates.level = level;
    if (location !== undefined) updates.location = location;
    if (priority) updates.priority = priority;
    if (contact !== undefined) updates.contact = contact;
    updates.updatedAt = new Date().toISOString();

    const updatedNews = await localStorage.updateNews(req.params.id, updates);

    res.json({
      success: true,
      message: 'News updated successfully',
      news: updatedNews,
    });
  } catch (error) {
    console.error('❌ Error updating news:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update news'
    });
  }
});

// Delete news (Admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete news'
      });
    }

    await localStorage.deleteNews(req.params.id);

    res.json({
      success: true,
      message: 'News deleted successfully',
    });
  } catch (error) {
    console.error('❌ Error deleting news:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete news'
    });
  }
});
// Add this to your routes/news.js file (at the bottom, before module.exports)

// Temporary endpoint to seed demo news
router.post('/seed-demo', async (req, res) => {
  try {
    const demoNews = [
      {
        title: 'New Water Supply Scheme Approved',
        description: 'The gram panchayat has approved a new water supply scheme that will benefit over 500 families in the village. Construction to begin next month with an estimated budget of ₹15 lakhs.',
        level: 'gram_panchayat',
        location: 'Shivaji Nagar Gram Panchayat',
        priority: 'high',
        contact: '+91 98765 43210',
        publishedBy: 'admin',
      },
      {
        title: 'Annual Gram Sabha Meeting on December 25',
        description: 'The annual gram sabha meeting will be held on December 25th at 10 AM at the community hall. All villagers are requested to attend and participate in village development discussions.',
        level: 'gram_panchayat',
        location: 'Village Community Hall',
        priority: 'normal',
        contact: 'Sarpanch Office',
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        publishedBy: 'admin',
      },
      {
        title: 'Street Light Installation Complete',
        description: 'Installation of 50 solar-powered street lights completed in all major village roads. Inauguration ceremony scheduled for December 18th at 5 PM.',
        level: 'gram_panchayat',
        location: 'Main Village Roads',
        priority: 'normal',
        contact: 'Village Electrician',
        publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        publishedBy: 'admin',
      },
      {
        title: 'Zilla Parishad Budget Session for FY 2025-26',
        description: 'The Zilla Parishad will hold its budget session for the financial year 2025-26. Public suggestions are invited for development projects. Submit your proposals by December 30th.',
        level: 'zilla_parishad',
        location: 'Zilla Parishad Office, Pune',
        priority: 'high',
        contact: '+91 20 2345 6789',
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        publishedBy: 'admin',
      },
      {
        title: 'District Sports Championship 2025',
        description: 'Registration is now open for the district-level sports championship. Events include cricket, kabaddi, athletics, volleyball, and more. Register before December 20th at your taluka sports office.',
        level: 'district',
        location: 'District Sports Complex, Pune',
        priority: 'normal',
        contact: 'sports@pune.gov.in',
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        publishedBy: 'admin',
      },
      {
        title: 'Free Health Check-up Camp This Weekend',
        description: 'A free health check-up camp will be organized by the district health department on December 21-22. Services include BP monitoring, diabetes screening, eye check-up, and general consultation.',
        level: 'district',
        location: 'Primary Health Center, Pimpri',
        priority: 'normal',
        contact: 'Dr. Sharma: +91 98234 56789',
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        publishedBy: 'admin',
      },
      {
        title: 'State Road Construction Project Sanctioned',
        description: 'The Maharashtra government has sanctioned ₹2 crore for road construction and repair in rural areas. Work will commence in January 2025 covering 25 km of village roads.',
        level: 'state',
        location: 'Maharashtra',
        priority: 'high',
        contact: 'PWD Maharashtra',
        publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        publishedBy: 'admin',
      },
      {
        title: 'Agricultural Subsidy Scheme Deadline Extended',
        description: 'The deadline for applying to the agricultural subsidy scheme has been extended to December 31st, 2024. Farmers can apply online through the state agriculture portal or visit district agriculture offices.',
        level: 'state',
        location: 'Maharashtra',
        priority: 'normal',
        contact: 'agri.maha@gov.in',
        publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        publishedBy: 'admin',
      },
      {
        title: 'National Digital Literacy Mission Launched',
        description: 'Government launches nationwide digital literacy program aimed at making 10 crore citizens digitally literate. Free training available for citizens above 18 years. Register at your nearest Common Service Center.',
        level: 'national',
        location: 'All India',
        priority: 'normal',
        contact: '1800-3000-3468',
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        publishedBy: 'admin',
      },
      {
        title: 'PM Awas Yojana Application Deadline Extended',
        description: 'The last date to apply for PM Awas Yojana (Rural) has been extended to January 15, 2025. Eligible beneficiaries can apply through their respective gram panchayat offices with required documents.',
        level: 'national',
        location: 'India',
        priority: 'high',
        contact: 'pmay-rural@gov.in',
        publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        publishedBy: 'admin',
      },
    ];

    const addedNews = [];
    
    for (const newsItem of demoNews) {
      const added = await localStorage.addNews(newsItem);
      addedNews.push(added);
    }

    console.log(`✅ Seeded ${addedNews.length} demo news items`);

    res.json({
      success: true,
      message: `Successfully added ${addedNews.length} demo news items`,
      count: addedNews.length,
      news: addedNews,
    });
  } catch (error) {
    console.error('❌ Error seeding demo news:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed demo news',
      error: error.message,
    });
  }
});

// REMEMBER: Remove this endpoint after seeding!
module.exports = router;