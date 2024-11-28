// const CustomException = require("../exception/customException");

const isValidVideo = (question, videoPath, interviewId) => {
  if (!question) {
    throw new error(
      "Question is required");
  }

  if (!videoPath) {
    throw new error(
      "Video file is required");
  }

  if (!interviewId) {
    throw new error(
      "InterviewId is required");
  }
};

module.exports = { isValidVideo };
