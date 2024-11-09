const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CustomException = require("../exception/customException");
const bcrypt = require("bcrypt");


const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//Signup static method
userSchema.statics.signup = async function (email, password, name) {
  // Find email if exist or not
  const isEmailExists = await this.findOne({ email });

  // If user exist, throw an exception
  if (isEmailExists) {
    throw new CustomException(
      "Email already exists",
      409,
      "EmailAlreadyExistsException"
    );
  }

  //Generate salt
  const salt = await bcrypt.genSalt(10);

  //Hash password
  const hashedPassword = await bcrypt.hash(password, salt);

  //Create new user
  const user = this.create({
    email,
    password: hashedPassword,
    name,
  });

  //Return user
  return user;
};

module.exports = mongoose.model("User", userSchema);
