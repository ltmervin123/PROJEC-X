const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET_KEY, { expiresIn: "1d" });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.SECRET_KEY);
};

const generateGuestToken = (guestId, usageCount = 0) => {
  return jwt.sign(
    {
      guestId,
      isGuest: true,
      usageCount,
      maxUsage: 5,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
    },
    process.env.SECRET_KEY
  );
};

module.exports = { generateToken, verifyToken, generateGuestToken };
