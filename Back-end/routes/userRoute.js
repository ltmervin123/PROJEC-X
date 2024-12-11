const express = require("express");
const router = express.Router();
const {
  signupUser,
  loginUser,
  handleGuest,
  verifySession
} = require("../controllers/userController");
//Gerate a guest token
router.post("/guest", handleGuest);

//Log in route
router.post("/login", loginUser);

//Sign up route
router.post("/signup", signupUser);

//Verify session
router.post("/verify-session", verifySession);

module.exports = router;
