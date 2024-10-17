require("dotenv").config();

const URL = "https://api.anthropic.com/v1/messages";
const API_KEY = process.env.API_KEY;

module.exports = {
    URL,
    API_KEY
}
