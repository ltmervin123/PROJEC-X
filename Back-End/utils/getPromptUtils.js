const getPrompt = (resumeText, category, jobDescription, prevQuestions) => {
  switch (category) {
    case "Basic":
      return beginnerPrompt(prevQuestions);
    case "Intermediate":
      return intermediatePrompt(resumeText, jobDescription, prevQuestions);
    case "Expert":
      return advancedPrompt(resumeText, jobDescription, prevQuestions);
  }
};

const beginnerPrompt = (prevQuestion) => {
  // const prompt = `
  //   Settings: [Temperature: 0.4, Role: Assistant]
  //     Task:
  //     1. Generate five unique, straightforward, and beginner-level interview questions applicable to a general audience of job seekers.
  //     2. Each question should be designed with one of the following purposes:
  //         - Purpose: Assess communication skills and understand the candidate's background.
  //         - Purpose: Evaluate self-awareness and ability to articulate personal traits.
  //         - Purpose: Test motivation and research about the company.
  //     3. Review the previous questions Previous Question: "${prevQuestion}" to ensure no duplicates or questions with overlapping ideas.
  //     4. Present the selected questions.

  //     Example Questions:
  //     1. "Tell me about yourself." (Purpose: Assess communication skills and understand the candidate's background.)
  //     2. "What are your strengths and weaknesses?" (Purpose: Evaluate self-awareness and ability to articulate personal traits.)
  //     3. "Why are you interested in this role?" (Purpose: Test motivation and research about the company.)

  //     Desired Output: Present only the three selected questions. No introductions, labels, or explanations. Output must adhere strictly to the following JSON format:

  //     {
  //       "questions": ["Question 1 text", "Question 2 text", "Question 3 text", "Question 4 text", "Question 5 text"]
  //     }
  // `;
  const prompt = `
  Settings: [Temperature: 0.4, Role: Assistant, Tone: Friendly-Warm, Style: Realistic-Personal]

  Task:
  1. Generate unique, open-ended, and beginner-friendly interview questions designed to understand the applicant's:
      - General background
      - Career aspirations
      - Education
      - Motivation and passion
      - Professional goals
      - Skills and competencies
      - Values and ethics
  2. The first question must be "Tell me about yourself."
  3. Review the previous question Previous Question: "${prevQuestion}" to ensure no duplicates or questions with overlapping ideas.
  4. Ensure the questions are simple, non-technical (under 30 words), and easy to understand for a general audience.
  5. Avoid jargon, unnecessary elements, or redundant ideas. Focus on extracting meaningful insights about the candidate.
  
  Desired Output:
  Present five clear and straightforward interview questions in the following strict JSON format:
  
  {
    "questions": ["Question 1 text", "Question 2 text", "Question 3 text", "Question 4 text", "Question 5 text"]
  }
    
  `;

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
  return prompt;
};

const advancedPrompt = (resumeText, jobDescription, prevQuestion) => {
  const prompt = `Objective:
  Generate five unique, advanced-level interview questions based on the candidate's ${resumeText} and ${jobDescription}. Ensure the questions assess the candidate's fit for the position and create a conversational flow.

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
    "questions": ["Question 1 text", "Question 2 text", "Question 3 text", "Question 4 text", "Question 5 text"]
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
