const CustomException = require("../exception/customException");

const isValidVideo = (question, videoPath, interviewId) => {
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

  if (!interviewId) {
    throw new CustomException(
      "InterviewId is required",
      400,
      "NoInterviewIdException"
    );
  }
};

module.exports = { isValidVideo };
