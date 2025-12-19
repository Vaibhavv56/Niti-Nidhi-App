# Exact Commands to Run - Step by Step

## Prerequisites
- Node.js installed
- MongoDB installed (or MongoDB Atlas account)
- Twilio account
- Groq API key

## Step 1: Backend Setup

### Open Terminal/Command Prompt and run these commands:

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
# Windows:
copy .env.example .env
# Mac/Linux:
cp .env.example .env

# Edit .env file and add your credentials:
# - MONGODB_URI=mongodb://localhost:27017/niti-nidhi
# - JWT_SECRET=your-secret-key-here
# - TWILIO_ACCOUNT_SID=your_twilio_account_sid
# - TWILIO_AUTH_TOKEN=your_twilio_auth_token
# - TWILIO_PHONE_NUMBER=+1234567890 (your Twilio number)
# - GROQ_API_KEY=your_groq_api_key

# Start MongoDB (if using local MongoDB)
# Windows:
# Open another terminal and run:
mongod

# Mac/Linux:
mongod

# Or use MongoDB Atlas (cloud) - no local installation needed
# Just set MONGODB_URI in .env to your Atlas connection string

# Start backend server
npm start
# or for development with auto-reload:
npm run dev
```

**Expected Output:**
```
Server running on port 5000
MongoDB Connected Successfully
Database: niti-nidhi
```

## Step 2: Frontend Setup

### Open a NEW Terminal/Command Prompt window:

```bash
# Navigate to project root (NOT backend folder)
cd "c:\Users\Vedika\OneDrive\Desktop\Techfest\governmentapp\myapp - Copy"

# Create .env file in root directory
# Windows:
echo EXPO_PUBLIC_API_URL=http://localhost:5000/api > .env
# Mac/Linux:
echo EXPO_PUBLIC_API_URL=http://localhost:5000/api > .env

# Or manually create .env file with:
# EXPO_PUBLIC_API_URL=http://localhost:5000/api

# For Android emulator, use:
# EXPO_PUBLIC_API_URL=http://10.0.2.2:5000/api

# For physical device on same network, use your computer's IP:
# EXPO_PUBLIC_API_URL=http://192.168.1.XXX:5000/api

# Install dependencies (if not already done)
npm install

# Start Expo
npm start
```

## Step 3: Testing Twilio OTP

### In backend/.env file, make sure you have:
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+14155552671
```

**Important:**
- TWILIO_PHONE_NUMBER is the number you BUY from Twilio dashboard
- NOT your personal phone number
- Format: +1234567890 (with country code)

### To get Twilio credentials:
1. Go to https://www.twilio.com/console
2. Copy Account SID and Auth Token
3. Go to Phone Numbers → Buy a number
4. Copy the number you bought

### Check backend console when sending OTP:
- If Twilio works: "✅ OTP sent via Twilio to +91..."
- If Twilio fails: "⚠️ OTP for +91... (check console): 123456"

## Step 4: Testing Groq Chatbot

### Get Groq API Key:
1. Go to https://console.groq.com/
2. Sign up (free, no credit card)
3. Go to API Keys section
4. Create new API key
5. Copy the key

### Add to backend/.env:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### Test:
- Open chatbot in app
- Select language (English/Hindi)
- Ask a question
- Check backend console for any errors

## Step 5: MongoDB Setup

### Option A: Local MongoDB
```bash
# Install MongoDB (if not installed)
# Windows: Download from mongodb.com
# Mac: brew install mongodb-community
# Linux: sudo apt-get install mongodb

# Start MongoDB
mongod

# In backend/.env:
MONGODB_URI=mongodb://localhost:27017/niti-nidhi
```

### Option B: MongoDB Atlas (Cloud - Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a cluster (free tier)
4. Get connection string
5. In backend/.env:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/niti-nidhi
```

## Troubleshooting

### Backend not starting?
```bash
cd backend
npm install
npm start
```

### Frontend can't connect to backend?
- Check if backend is running on port 5000
- Check EXPO_PUBLIC_API_URL in .env
- For Android emulator: use http://10.0.2.2:5000/api
- For physical device: use your computer's IP address

### OTP not sending?
- Check backend console for errors
- Verify Twilio credentials in .env
- Check Twilio phone number format (+1234567890)
- OTP will be logged to console if SMS fails

### Chatbot not working?
- Check if GROQ_API_KEY is set in backend/.env
- Check backend console for errors
- Verify API key at https://console.groq.com/

### MongoDB connection error?
- Check if MongoDB is running (for local)
- Verify MONGODB_URI in .env
- Server will continue without DB (for testing)

## Quick Test Commands

```bash
# Test backend is running
curl http://localhost:5000/api/schemes

# Check MongoDB connection
# In backend folder:
node -e "require('mongoose').connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/niti-nidhi').then(() => console.log('Connected')).catch(e => console.error(e))"
```




