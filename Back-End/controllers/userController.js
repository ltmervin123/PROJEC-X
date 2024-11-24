const User = require("../models/userModel");
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

  // Run all validations
  isValidLogin(email, password);
  try {
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
  // Run all validations
  isValidSignup(email, password, name);
  try {
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

module.exports = { loginUser, signupUser, handleGuest };
