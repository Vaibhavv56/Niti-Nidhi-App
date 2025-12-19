// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const path = require('path');

// dotenv.config();

// const app = express();

// // Initialize Firebase
// require('./config/firebase');

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/users', require('./routes/users'));
// app.use('/api/schemes', require('./routes/schemes'));
// app.use('/api/applications', require('./routes/applications'));
// app.use('/api/documents', require('./routes/documents'));
// app.use('/api/chatbot', require('./routes/chatbot'));
// app.use('/api/complaints', require('./routes/complaints'));
// app.use('/api/employment', require('./routes/employment'));
// // In server.js, add this line with your other routes:
// app.use('/api/news', require('./routes/news'));

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`Access from network: http://YOUR_IP:${PORT}`);
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });










const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Initialize Firebase
require('./config/firebase');

// Enhanced CORS configuration for web development
app.use(cors({
  origin: '*', // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/schemes', require('./routes/schemes'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/employment', require('./routes/employment'));
app.use('/api/news', require('./routes/news'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

// Remove duplicate listen - keep only one
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Local: http://localhost:${PORT}`);
  console.log(`✅ Network: http://YOUR_IP:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
  console.log(`✅ Chatbot API: http://localhost:${PORT}/api/chatbot/chat`);
});