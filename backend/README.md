# Niti Nidhi Backend API

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your credentials:
   - MongoDB URI (or use MongoDB Atlas)
   - JWT Secret
   - Twilio credentials (for SMS OTP) - See TWILIO_SETUP.md
   - Google Client ID (for OAuth)
   - Groq API Key (for chatbot) - See GROQ_SETUP.md

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Run the server:
```bash
npm start
# or for development
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/google-signin` - Google OAuth sign in
- `POST /api/auth/register` - Register/Update user profile

### Applications
- `POST /api/applications/submit` - Submit scheme application
- `GET /api/applications/my-applications` - Get user's applications (Check Status)
- `GET /api/applications/:id` - Get application details

### Chatbot
- `POST /api/chatbot/chat` - Chat with AI assistant

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Environment Variables

See `.env.example` for all required variables.

## Important Notes

### Twilio Phone Number
- **TWILIO_PHONE_NUMBER** is NOT your personal phone number
- It's the phone number you **buy/rent from Twilio**
- You get this from Twilio dashboard after purchasing a number
- This number will **send** SMS to users
- See `TWILIO_SETUP.md` for detailed instructions

### Groq API (Chatbot)
- Free and fast alternative to OpenAI
- Get API key from https://console.groq.com/
- No credit card required for free tier
- See `GROQ_SETUP.md` for setup instructions

