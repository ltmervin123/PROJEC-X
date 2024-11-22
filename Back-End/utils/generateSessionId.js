const generateSessionId = require("uuid").v4;

const getSessionId = (req) => {
  // Check if the user is logged in
  if (req.user && req.user._id) {
    return req.user._id.toString(); // For logged-in users
  }

  // // Check if the user is a guest
  // if (!req.session.guestId) {
  //   req.session.guestId = generateSessionId(); // For guests
  // }

  return req.guestId.toString();
};

module.exports = { getSessionId };
