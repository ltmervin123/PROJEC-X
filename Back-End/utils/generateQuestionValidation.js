const CustomException = require("../exception/customException");

const isGenerateMockQuestionValid = (type, file, jobDescription, category) => {
  // check if type is present
  if (!type) {
    throw new CustomException("Type is required", 400, "NoTypeException");
  }

  if (type === "Expert") {
    // check if file is present
    if (!file) {
      throw new CustomException("Resume is required", 400, "NoResumeException");
    }

    // check if job description is present
    if (!jobDescription) {
      throw new CustomException(
        "Job description is required",
        400,
        "NoJobDescriptionException"
      );
    }

    // check if category is present
    if (!category) {
      throw new CustomException(
        "Category is required",
        400,
        "NoCategoryException"
      );
    }
  } else if (type === "Basic") {
    // check if category is present
    if (!category) {
      throw new CustomException(
        "Category is required",
        400,
        "NoCategoryException"
      );
    }
  }
};

const isGenerateBehaviorQuestionValid = (type, category) => {
  // check if type is present
  if (!type) {
    throw new CustomException("Type is required", 400, "NoTypeException");
  }

  // check if category is present
  if (!category) {
    throw new CustomException(
      "Category is required",
      400,
      "NoCategoryException"
    );
  }
};

module.exports = {
  isGenerateMockQuestionValid,
  isGenerateBehaviorQuestionValid,
};
