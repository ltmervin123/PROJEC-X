// const CustomException = require("../exception/customException");

const isGenerateMockQuestionValid = (type, file, jobDescription, category,sessionId) => {
  // check if type is present
  if (!type) {
    throw new error("Type is required");
  }

  if (type === "Expert") {
    // check if file is present
    if (!file) {
      throw new error("Resume is required");
    }

    // check if job description is present
    if (!jobDescription) {
      throw new error("Job description is required" );
    }

    // check if category is present
    if (!category) {
      throw new error("Category is required");
    }

    if(!sessionId){
      throw new error("Session id is required")
    }
  } else if (type === "Basic") {
    // check if category is present
    if (!category) {
      throw new error("Category is required");
    }

    if(!sessionId){
      throw new error("Session id is required")
    }
  }
};

const isGenerateBehaviorQuestionValid = (type, category) => {
  // check if type is present
  if (!type) {
    throw new error("Type is required");
  }

  // check if category is present
  if (!category) {
    throw new error("Category is required");
  }
};

module.exports = {
  isGenerateMockQuestionValid,
  isGenerateBehaviorQuestionValid,
};
