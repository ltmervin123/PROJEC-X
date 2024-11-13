const CustomException = require("../exception/customException");

const isGenerateQuestionValid = (
  file,
  difficulty,
  jobDescription,
  category
) => {
  // check if file is present
  if (!file) {
    throw new CustomException("Resume is required", 400, "NoResumeException");
  }

  // check if difficulty is present
  if (!difficulty) {
    throw new CustomException(
      "Difficulty is required",
      400,
      "NoDifficultyException"
    );
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
};

module.exports = { isGenerateQuestionValid };
