const CustomException = require("../exception/customException");

const isValidVideo = (question, videoPath, InterviewId) => {
  if (!question) {
    throw new CustomException(
      "Question is required",
      400,
      "NoQuestionException"
    );
  }

  if (!videoPath) {
    throw new CustomException(
      "Video file is required",
      400,
      "NoVideoFileException"
    );
  }

  if (!InterviewId) {
    throw new CustomException(
      "InterviewId is required",
      400,
      "NoInterviewIdException"
    );
  }

  return true;
};

module.exports = { isValidVideo };
