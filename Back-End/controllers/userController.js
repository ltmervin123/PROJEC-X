const User = require("../models/userModel");
const { isValidSignup } = require("../utils/signupValidationUtils");
const { isValidLogin } = require("../utils/loginValidationUtils");
const { generateToken, verifyToken } = require("../utils/tokenUtils");

// Login user function
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    isValidLogin(email, password);
    const user = await User.login(email, password);
    const token = generateToken(user._id);

    return res.status(200).json({
      message: "User logged in successfully",
      user: { _id: user._id, name: user.name, email: user.email },
      token,
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
    const { _id } = user;

    // Generate token
    const token = generateToken(user._id);

    return res.status(201).json({
      message: "User signed up successfully",
      user: { _id, name, email },
      token,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { loginUser, signupUser };
