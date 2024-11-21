const { verifyToken } = require("../utils/tokenUtils");
const CustomException = require("../exception/customException");
const User = require("../models/userModel");

const requireAuthMiddleware = async (req, res, next) => {
  // Middleware to check if the user is authenticated
  const { authorization } = req.headers;

  // Check if the Authorization header is present
  if (!authorization) {
    return next(
      new CustomException(
        "Authorization is required",
        401,
        "AuthorizationIsRequiredException"
      )
    );
  }

  // Extract the token from the Authorization header
  const token = authorization.split(" ")[1];

  // Verify the token
  if (!token) {
    return next(
      new CustomException(
        "Invalid Authorization Format",
        401,
        "InvalidAuthorizationFormatException"
      )
    );
  }

  try {
    // Verify the token
    const { _id } = verifyToken(token);

    req.user = await User.findOne({ _id }).select("_id");

    // Call the next middleware
    next();
  } catch (error) {
    console.error(`[Auth Middleware] Error: ${error.name} - ${error.message}`);
    if (error.name === "TokenExpiredError") {
      next(new CustomException("Token expired", 401, "TokenExpiredException"));
    }
  }
};

module.exports = requireAuthMiddleware;
