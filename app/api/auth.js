// Backend API structure for authentication
// Replace BASE_URL with your actual backend URL

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api'; // Change this to your backend URL

export const authAPI = {
  // Send OTP to phone number
  sendOTP: async (phoneNumber) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phoneNumber,
          countryCode: '+91',
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      return { 
        success: true, 
        sessionId: data.sessionId, 
        message: data.message,
        otp: data.otp // Include OTP if provided (development mode)
      };
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  },

  // Verify OTP
  verifyOTP: async (phoneNumber, otp, sessionId) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phoneNumber,
          otp: otp,
          sessionId: sessionId,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Invalid OTP');
      }

      return data; // Returns { success, token, user }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  },

  // Register authenticated user in database
  registerUser: async (userData) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to register user');
      }

      return data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },
};

// Example backend API endpoints structure:
/*
POST /api/auth/send-otp
Body: { phone: "9876543210", countryCode: "+91" }
Response: { success: true, message: "OTP sent successfully" }

POST /api/auth/verify-otp
Body: { phone: "9876543210", otp: "123456" }
Response: { success: true, token: "jwt_token", user: { id, phone } }

POST /api/auth/register
Body: { phone, profile: { fullName, age, ... } }
Response: { success: true, user: { id, phone, profile } }
*/

