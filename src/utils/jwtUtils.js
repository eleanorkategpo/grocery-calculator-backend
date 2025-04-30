import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
// Generate JWT token
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Verify JWT token
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Set JWT cookie
export const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = generateToken(user._id);
  
  // Parse the JWT_EXPIRES_IN value to milliseconds
  let expiresInMs;
  const expiresInValue = process.env.JWT_EXPIRES_IN;
  
  if (expiresInValue.endsWith('h')) {
    // If in hours (e.g., 12h)
    const hours = parseInt(expiresInValue);
    expiresInMs = hours * 60 * 60 * 1000;
  } else if (expiresInValue.endsWith('d')) {
    // If in days (e.g., 30d)
    const days = parseInt(expiresInValue);
    expiresInMs = days * 24 * 60 * 60 * 1000;
  } else if (expiresInValue.endsWith('m')) {
    // If in minutes (e.g., 30m)
    const minutes = parseInt(expiresInValue);
    expiresInMs = minutes * 60 * 1000;
  } else {
    // Default to seconds if no unit provided
    expiresInMs = parseInt(expiresInValue) * 1000;
  }

  const cookieOptions = {
    expires: new Date(Date.now() + expiresInMs),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  // Remove password from output
  user.password = undefined;

  res.status(statusCode)
    .cookie('jwt', token, cookieOptions)
    .json({
      status: 'success',
      token,
      data: {
        user
      }
    });
}; 