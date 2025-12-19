const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (idToken) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };
  } catch (error) {
    console.error('Google token verification error:', error);
    return null;
  }
};

module.exports = {
  verifyGoogleToken,
};




