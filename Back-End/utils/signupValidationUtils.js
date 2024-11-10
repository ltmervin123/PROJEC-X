const CustomException = require("../exception/customException");
const validator = require("validator");

const isValidSignup = (email, password, name) => {
  if (!name && !email && !password) {
    throw new CustomException(
      "All fields must be filled",
      400,
      "AllFieldsRequiredException"
    );
  }

  if (!name) {
    throw new CustomException("Name is required", 400, "NameRequiredException");
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
      "Password is not strong enough",
      400,
      "PasswordNotStrongException"
    );
  }
};

module.exports = { isValidSignup };
