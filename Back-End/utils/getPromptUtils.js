const getPrompt = (resumeText, difficulty, jobDescription, prevQuestions) => {
  switch (difficulty) {
    case "Beginner":
      return beginnerPrompt(prevQuestions);
    case "Intermediate":
      return intermediatePrompt(resumeText, jobDescription, prevQuestions);
    case "Advanced":
      return advancedPrompt(resumeText, jobDescription, prevQuestions);
  }
};

const beginnerPrompt = (prevQuestion) => {
  const prompt = `
    Settings: [Temperature: 0.4, Role: Assistant]
      Task:
      1. Generate three unique, straightforward, and beginner-level interview questions applicable to a general audience of job seekers.
      2. Each question should be designed with one of the following purposes:
          - Purpose: Assess communication skills and understand the candidate's background.
          - Purpose: Evaluate self-awareness and ability to articulate personal traits.
          - Purpose: Test motivation and research about the company.
      3. Review the previous questions Previous Question: "${prevQuestion}" to ensure no duplicates or questions with overlapping ideas.
      4. Present the selected questions.

      Example Questions:
      1. "Tell me about yourself." (Purpose: Assess communication skills and understand the candidate's background.)
      2. "What are your strengths and weaknesses?" (Purpose: Evaluate self-awareness and ability to articulate personal traits.)
      3. "Why are you interested in this role?" (Purpose: Test motivation and research about the company.)

      Desired Output: Present only the three selected questions. No introductions, labels, or explanations. Output must adhere strictly to the following JSON format:

      {
        "questions": ["Question 1 text", "Question 2 text", "Question 3 text"]
      }

  `;

  //   const prompt = `Settings: [Temperature: 0.4, Role: Assistant]
  //   Task:
  //   1. Generate three unique, beginner-level interview questions for job seekers.
  //   2. Each question should assess:
  //       - Communication skills,
  //       - Self-awareness,
  //       - Motivation for the role.
  //   3. Exclude duplicates or similar questions from "${prevQuestions}".
  //   4. Present only the questions selected on JSON format Output.

  //   Example:
  //   1. "Tell me about yourself." (Purpose: Communication skills)
  //   2. "What are your strengths and weaknesses?" (Purpose: Self-awareness)
  //   3. "Why are you interested in this role?" (Purpose: Motivation)

  //   Output:
  //   {
  //     "questions": ["Question 1", "Question 2", "Question 3"]
  //   }
  // `;
  return prompt;
};

const intermediatePrompt = (resumeText, jobDescription, prevQuestion) => {
  const prompt = `
    Settings: [Temperature: 0.4, Role: Assistant]
    Task:
    1. Generate three unique, intermediate-level interview questions based on "${resumeText}" and "${jobDescription}".
    2. Ensure the questions assess:
        - Problem-solving and critical thinking skills,
        - Time management and organizational skills,
        - Conflict resolution and interpersonal skills.
    3. Review the previous questions Previous Question: "${prevQuestion}" to ensure no duplicates or questions with overlapping ideas.    
    3. Exclude any duplicates or similar questions from "${prevQuestion}".

    Example:
    1. "Describe a time you solved a challenging problem." (Purpose: Problem-solving skills)
    2. "How do you prioritize tasks when managing multiple deadlines?" (Purpose: Time management)
    3. "Can you provide an example of how you resolved a conflict with a colleague?" (Purpose: Conflict resolution)

    Desired Output: Present only the three selected questions. No introductions, labels, or explanations. Output must adhere strictly to the following JSON format:

    {
      "questions": ["Question 1 text", "Question 2 text", "Question 3 text"]
    }
  `;

  //   const prompt = ` Settings: [Temperature: 0.4, Role: Assistant]
  //   Task:
  //   1. Generate 3 unique intermediate-level questions based on "${resumeText}" and "${jobDescription}".
  //   2. Questions must assess:
  //       - Problem-solving, time management, conflict resolution.
  //   3. Exclude duplicates or similar questions from "${prevQuestion}".
  //   4. Present only the questions selected on JSON format Output.

  //   Example:
  //   1. "Describe a time you solved a challenging problem."
  //   2. "How do you prioritize tasks?"
  //   3. "How did you resolve a conflict with a colleague?"

  //   Output:
  //   {
  //     "questions": ["Question 1", "Question 2", "Question 3"]
  //   }
  // `;
  return prompt;
};

const advancedPrompt = (resumeText, jobDescription, prevQuestion) => {
  // const prompt = `
  // Objective:
  // Develop three unique and dynamic, advanced-level interview questions based on the candidate's ${resumeText} and ${jobDescription}. These questions should assess the candidate's suitability for the position and create a conversational flow.

  // Question Types (Link resume and job qualifications):
  // 1. Priming
  // 2. Probing
  // 3. Practical

  // Criteria to Consider:
  // Job-specific requirements
  // Relevance
  // Skills and qualifications
  // Cultural fit and soft skills
  // Experience and achievements

  // **strict JSON format** only, ensuring valid JSON syntax with no extra line breaks or misformatted characters. Here’s the required format:
  // {
  //   "questions": ["Question 1 text", "Question 2 text", "Question 3 text"]
  // }

  // Guidelines:
  // Always  use appropriate honorifics.
  // Ensure a smooth narrative flow with natural and engaging language.
  // Present only the question.
  // Avoid labels and unnecessary elements or jargon.
  // Concise Questions.

  // Settings:
  // [Temperature: 0.3, Role: Assistant, Tone: Friendly-Warm, Style: Realistic-Personal]`;

  const prompt = `Objective:
  Generate three unique, advanced-level interview questions based on the candidate's ${resumeText} and ${jobDescription}. Ensure the questions assess the candidate's fit for the position and create a conversational flow.

  Question Types:
  1. Priming
  2. Probing
  3. Practical

  Criteria:
  - Job-specific requirements
  - Relevance, skills, and qualifications
  - Cultural fit, soft skills, experience, and achievements

  Exclude any questions found in "${prevQuestion}" to avoid repetition.

  Example:
  1. "Can you discuss a project where you took the lead? What was the outcome?" (Purpose: Leadership, decision-making, project management)
  2. "How do you keep up with industry trends? Can you share a recent development?" (Purpose: Industry knowledge, professional development)
  3. "If you could improve one aspect of our company, what would it be and why?" (Purpose: Analytical skills, constructive feedback)

  Desired Output: Present only the three selected questions. No introductions, labels, or explanations. Output must adhere strictly to the following JSON format:

  {
    "questions": ["Question 1 text", "Question 2 text", "Question 3 text"]
  }

  Settings:
  [Temperature: 0.3, Role: Assistant, Tone: Friendly-Warm, Style: Realistic-Personal]
  `;

  // const prompt = `Objective:
  // 1. Generate three unique, advanced-level interview questions based on ${resumeText} and ${jobDescription}. Exclude questions from "${prevQuestion}".
  // 2. Present only the questions selected on JSON format Output.

  // Types: Priming, Probing, Practical

  // Criteria:
  // - Job relevance, skills, qualifications
  // - Soft skills, cultural fit, experience

  // Example:
  // 1. "Describe a project you led. What was the outcome?" (Leadership, decision-making)
  // 2. "How do you stay updated with industry trends?" (Industry knowledge)
  // 3. "What would you improve about our company and why?" (Analytical skills)

  // Output:
  // {
  //   "questions": ["Question 1", "Question 2", "Question 3"]
  // }

  // Settings: [Temperature: 0.3, Role: Assistant, Tone: Friendly, Style: Personal]
  // `;
  return prompt;
};

module.exports = { getPrompt };
