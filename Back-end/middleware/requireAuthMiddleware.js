const { verifyToken } = require("../utils/tokenUtils");
const CustomException = require("../exception/customException");
const User = require("../models/userModel");
require("dotenv").config();

const requireAuthMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;

  try {
    // Validate Authorization Header
    if (!authorization) {
      throw new Error("Authorization is required");
    }

    // Extract Token
    const token = authorization.split(" ")[1];

    if (!token) {
      throw new Error("Invalid Authorization Format");
    }

    const decoded = verifyToken(token);

    if (decoded.isGuest) {
      handleGuest(decoded, req, res, next);
    } else {
      handleLoggedInUser(decoded, req, next);
    }
  } catch (error) {
    console.log(`[Auth Middleware] Error: ${error.name} - ${error.message}`);
    if (error.name === "TokenExpiredError") {
      return next(
        new CustomException("Token expired", 401, "TokenExpiredException")
      );
    }
    next(error);
  }
};

// Handle Guest Logic
const handleGuest = (decoded, req, res, next) => {
  const { guestId, usageCount, maxUsage } = decoded;

  if (usageCount + 1 > maxUsage) {
    return next(
      new CustomException(
        "Guest usage limit reached. Please sign up.",
        403,
        "GuestLimitReachedException"
      )
    );
  }

  // Generate New Token
  const newToken = jwt.sign(
    {
      guestId,
      isGuest: true,
      usageCount: usageCount + 1,
      maxUsage,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 1-day expiration
    },
    process.env.JWT_SECRET
  );
  req.guestId = guestId;
  req.guestData = { guestId, usageCount: usageCount + 1, maxUsage };
  res.setHeader("x-refresh-token", newToken);
  next();
};

// Handle Logged-In User Logic
const handleLoggedInUser = async (decoded, req, next) => {
  //attach user id to request object
  req.user = decoded._id;
  next();
};

module.exports = requireAuthMiddleware;
