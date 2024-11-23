// const generateSessionId = require("uuid").v4;

const getSessionId = (req) => {
  // Check if the user is logged in
  if (req.user) {
    console.log(`User Id : ${req.user}`);
    return req.user.toString(); // For logged-in users
  }
  // Check if the user is a guest
  console.log(`Guest Id : ${req.guestId}`);
  return req.guestId.toString();
};

module.exports = { getSessionId };
