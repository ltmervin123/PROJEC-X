// const CustomException = require("../exception/customException");

// const isValidVideo = (question, videoPath, interviewId) => {
//   if (!question) {
//     throw new Error("Question is required");
//   }

//   if (!videoPath) {
//     throw new Error("Video file is required");
//   }

//   if (!interviewId) {
//     throw new Error("InterviewId is required");
//   }
// };

const isValidVideo = (question, transcript, interviewId) => {
  if (!question) {
    throw new Error("Question is required");
  }

  if (!transcript) {
    throw new Error("Transcript  is required");
  }

  if (!interviewId) {
    throw new Error("InterviewId is required");
  }
};

module.exports = { isValidVideo };
