// const CustomException = require("../exception/customException");

const isValidVideo = (question, videoPath, interviewId) => {
  if (!question) {
    throw new Error("Question is required");
  }

  if (!videoPath) {
    throw new Error("Video file is required");
  }

  if (!interviewId) {
    throw new Error("InterviewId is required");
  }
};

module.exports = { isValidVideo };
