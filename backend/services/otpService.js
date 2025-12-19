const twilio = require('twilio');

// For development, store OTPs in memory
// In production, use Redis or database
const otpStore = new Map();

// Initialize Twilio client (use environment variables)
// Note: TWILIO_PHONE_NUMBER should be your Twilio phone number (bought from Twilio)
// This is NOT your personal phone number - it's the number Twilio provides you
let twilioClient = null;

if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via SMS
const sendOTP = async (phone, countryCode) => {
  try {
    // Ensure phone number is properly formatted
    let cleanPhone = phone.replace(/\D/g, ''); // Remove non-digits
    const fullPhone = countryCode + cleanPhone;
    const otp = generateOTP();
    const sessionId = Date.now().toString();

    console.log(`Sending OTP to: ${fullPhone}`);
    console.log(`Generated OTP: ${otp}`);

    // Store OTP with expiration (5 minutes)
    otpStore.set(sessionId, {
      phone: fullPhone,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    // Send SMS via Twilio (if configured)
    if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
      try {
        const message = await twilioClient.messages.create({
          body: `Your Niti Nidhi OTP is: ${otp}. Valid for 5 minutes.`,
          from: process.env.TWILIO_PHONE_NUMBER.trim(), // Your Twilio number
          to: fullPhone, // User's phone number
        });
        console.log(`✅ OTP sent via Twilio to ${fullPhone}. Message SID: ${message.sid}`);
      } catch (twilioError) {
        console.error('❌ Twilio error:', twilioError.message);
        console.error('Twilio error code:', twilioError.code);
        // Continue with stored OTP - user can still verify using console log
        console.log(`⚠️ OTP for ${fullPhone} (SMS failed, check console): ${otp}`);
      }
    } else {
      // If Twilio not configured, log OTP for testing
      console.log(`⚠️ Twilio not configured. OTP for ${fullPhone}: ${otp}`);
      console.log('To enable SMS, set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in .env');
    }

    return {
      success: true,
      sessionId,
      message: 'OTP sent successfully',
      // Include OTP in response for testing (remove in production)
      otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    };
  } catch (error) {
    console.error('Send OTP error:', error);
    return {
      success: false,
      message: `Failed to send OTP: ${error.message}`,
    };
  }
};

// Verify OTP
const verifyOTP = (phone, otp, sessionId) => {
  try {
    const stored = otpStore.get(sessionId);

    if (!stored) {
      return {
        success: false,
        message: 'Invalid session. Please request a new OTP.',
      };
    }

    if (Date.now() > stored.expiresAt) {
      otpStore.delete(sessionId);
      return {
        success: false,
        message: 'OTP has expired. Please request a new one.',
      };
    }

    const fullPhone = phone.startsWith('+') ? phone : `+91${phone}`;

    if (stored.phone !== fullPhone) {
      return {
        success: false,
        message: 'Phone number mismatch.',
      };
    }

    if (stored.otp !== otp) {
      return {
        success: false,
        message: 'Invalid OTP.',
      };
    }

    // OTP verified, remove from store
    otpStore.delete(sessionId);

    return {
      success: true,
      message: 'OTP verified successfully',
    };
  } catch (error) {
    console.error('Verify OTP error:', error);
    return {
      success: false,
      message: 'Failed to verify OTP',
    };
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
};

