const User = require("../models/userModel");
const CustomException = require("../exception/customException");
const { verifyToken } = require("../utils/tokenUtils");
const { isValidSignup } = require("../utils/signupValidationUtils");
const { isValidLogin } = require("../utils/loginValidationUtils");
const { generateToken } = require("../utils/tokenUtils");
const { generateGuestToken } = require("../utils/tokenUtils");
const generateSessionId = require("uuid").v4;

// Generate guest token function
const handleGuest = (req, res, next) => {
  try {
    const guestId = generateSessionId();
    const token = generateGuestToken(guestId);
    return res
      .status(201)
      .json({ message: "Token Generated Successfully", token });
  } catch (error) {
    console.log("Error At Handle Guest Token", error.message);
    throw new Error(error);
  }
};

// Login user function
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Run all validations
    isValidLogin(email, password);
    const user = await User.login(email, password);
    const token = generateToken(user._id);

    return res.status(200).json({
      message: "User logged in successfully",
      user: { _id: user._id, name: user.name, email: user.email, token },
    });
  } catch (err) {
    next(err);
  }
};

//Signup user function
const signupUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    // Run all validations
    isValidSignup(email, password, name);
    // Create new user
    const user = await User.signup(email, password, name);

    // Generate token
    const token = generateToken(user._id);

    return res.status(201).json({
      message: "User signed up successfully",
      user: { _id: user._id, name: user.name, email: user.email, token },
    });
  } catch (err) {
    next(err);
  }
};

//Validate session function
const verifySession = async (req, res, next) => {
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

    return res.status(200).json({ message: "Session  valid" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(
        new CustomException("Token expired", 401, "TokenExpiredException")
      );
    }
    next(new CustomException("Unauthorized", 401, "UnauthorizedException"));
    console.log("Error at verifySession", error.message);
  }
};

module.exports = { loginUser, signupUser, handleGuest, verifySession };
