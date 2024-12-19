// const generateSessionId = require("uuid").v4;

const getSessionId = (req) => {
  // Check if the user is logged in
  if (req.user) {
    return req.user.toString();
  }

  return req.guestId.toString();
};

module.exports = { getSessionId };
