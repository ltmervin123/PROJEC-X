const User = require("../models/userModel");
const { isValidUser } = require("../utils/signupValidationUtils");

// Login user function
const loginUser = async (req, res, next) => {
  return res.status(200).json({
    message: "User logged in successfully",
  });
};

//Signup user function
const signupUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    // Run all validations
    isValidUser(email, password, name);
    
    const user = await User.signup(email, password, name);

    return res.status(200).json({
      message: "User signed up successfully",
      user,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { loginUser, signupUser };
