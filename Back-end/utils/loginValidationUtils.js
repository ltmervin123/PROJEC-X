const CustomException = require("../exception/customException");

const isValidLogin = (email, password) => {
  if (!email && !password) {
    throw new CustomException(
      "All fields must be filled",
      400,
      "AllFieldsRequiredException"
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
};

module.exports = { isValidLogin };
