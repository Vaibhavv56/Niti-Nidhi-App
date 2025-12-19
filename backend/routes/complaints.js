const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');

const EXTERNAL_API = 'https://2ae4b041fab2.ngrok-free.app/api';

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

// Submit Complaint - Proxy to external API
router.post('/submit', verifyToken, async (req, res) => {
  try {
    const { title, category, description, location_name, attachments, citizen_name, citizen_phone, citizen_username, priority, is_urban } = req.body;

    console.log('📥 Received complaint submission:', { title, category, location_name });

    if (!title || !category || !description || !location_name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, category, description, and location are required' 
      });
    }

    // Prepare data for external API
    const complaintData = {
      title: title.trim(),
      description: description.trim(),
      category: category.toLowerCase(),
      location_name: location_name.trim(),
      citizen_name: citizen_name || 'User',
      citizen_phone: citizen_phone || '',
      citizen_username: citizen_username || 'user',
      priority: priority || 'medium',
      is_urban: is_urban !== undefined ? is_urban : true,
      attachments: attachments || [],
    };

    // Forward to external API
    const response = await axios.post(`${EXTERNAL_API}/complaints`, complaintData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ Complaint submitted to external API:', response.data);

    res.json({
      success: true,
      message: 'Complaint submitted successfully',
      ticket_number: response.data.ticket_number,
      complaint: response.data,
    });
  } catch (error) {
    console.error('Submit complaint error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      success: false, 
      message: error.response?.data?.message || 'Failed to submit complaint' 
    });
  }
});

// Get User Complaints - Fetch from external API
router.get('/my-complaints', verifyToken, async (req, res) => {
  try {
    const userId = req.userId || req.query.deviceId;
    
    if (!userId) {
      return res.json({
        success: true,
        complaints: [],
      });
    }

    // Fetch all complaints from external API
    const response = await axios.get(`${EXTERNAL_API}/complaints`);
    
    // Filter by citizen_username or citizen_phone if available
    // This is a simplified approach - you may need to adjust based on your auth system
    let complaints = response.data || [];
    
    console.log(`✅ Fetched ${complaints.length} total complaints from external API`);

    // Sort by created_at descending
    complaints.sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return dateB - dateA;
    });

    res.json({
      success: true,
      complaints: complaints.map(c => ({
        id: c.id,
        ticket_number: c.ticket_number,
        title: c.title,
        description: c.description,
        category: c.category,
        status: c.status,
        priority: c.priority,
        location_name: c.location_name,
        citizen_name: c.citizen_name,
        citizen_phone: c.citizen_phone,
        attachments: c.attachments,
        created_at: c.created_at,
        updated_at: c.updated_at,
        resolved_at: c.resolved_at,
      })),
    });
  } catch (error) {
    console.error('Get complaints error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      success: false, 
      message: 'Failed to fetch complaints' 
    });
  }
});

// Get All Complaints - Fetch from external API
router.get('/all', verifyToken, async (req, res) => {
  try {
    const response = await axios.get(`${EXTERNAL_API}/complaints`);
    const complaints = response.data || [];

    console.log(`✅ Fetched ${complaints.length} complaints from external API`);

    res.json({
      success: true,
      complaints: complaints.map(c => ({
        id: c.id,
        ticket_number: c.ticket_number,
        title: c.title,
        description: c.description,
        category: c.category,
        status: c.status,
        priority: c.priority,
        location_name: c.location_name,
        citizen_name: c.citizen_name,
        citizen_phone: c.citizen_phone,
        attachments: c.attachments,
        created_at: c.created_at,
        updated_at: c.updated_at,
        resolved_at: c.resolved_at,
      })),
    });
  } catch (error) {
    console.error('Get all complaints error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      success: false, 
      message: 'Failed to fetch complaints' 
    });
  }
});

// Get Single Complaint by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const response = await axios.get(`${EXTERNAL_API}/complaints/${req.params.id}`);
    
    res.json({
      success: true,
      complaint: response.data,
    });
  } catch (error) {
    console.error('Get complaint error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      success: false, 
      message: 'Failed to fetch complaint' 
    });
  }
});

// Update Complaint Status - Forward to external API
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status, remarks } = req.body;
    
    const response = await axios.put(
      `${EXTERNAL_API}/complaints/${req.params.id}/status`, 
      { status, remarks },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Complaint status updated:', response.data);

    res.json({
      success: true,
      message: 'Complaint status updated',
      complaint: response.data,
    });
  } catch (error) {
    console.error('Update complaint error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      success: false, 
      message: 'Failed to update complaint' 
    });
  }
});

module.exports = router;