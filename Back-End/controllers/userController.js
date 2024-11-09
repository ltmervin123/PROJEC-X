const User = require("../models/userModel");
const CustomException = require("../exception/customException");
const validator = require("validator");

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
    if (!name && !email && !password) {
      throw new CustomException(
        "All fields must be filled",
        400,
        "AllFieldsRequiredException"
      );
    }

    if (!name) {
      throw new CustomException(
        "Name is required",
        400,
        "NameRequiredException"
      );
    }

    if (!email) {
      throw new CustomException(
        "Email is required",
        400,
        "EmailRequiredException"
      );
    }

    if (!password) {
      throw new CustomException(
        "Password is required",
        400,
        "PasswordRequiredException"
      );
    }

    if (!validator.isEmail(email)) {
      throw new CustomException(
        "Email is not valid",
        400,
        "EmailNotValidException"
      );
    }

    if (!validator.isStrongPassword(password)) {
      throw new CustomException(
        "Password must be at least 8 characters long, contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character.",
        400,
        "PasswordNotStrongException"
      );
    }

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
