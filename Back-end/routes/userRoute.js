const express = require("express");
const router = express.Router();
const {
  signupUser,
  loginUser,
  handleGuest,
} = require("../controllers/userController");
//Gerate a guest token
router.post("/guest", handleGuest);

//Log in route
router.post("/login", loginUser);

//Sign up route
router.post("/signup", signupUser);

module.exports = router;
