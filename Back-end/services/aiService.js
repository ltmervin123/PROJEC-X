const { URL, API_KEY } = require("../constant/aiServiceConstant");
const axios = require("axios");
const { getPrompt } = require("../utils/getPromptUtils");

const setPayload = (prompt) => {
  return {
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 3000,
    temperature: 0,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  };
};

const resumeFeedBack = async (resumeText, field) => {
  const prompt = `
  Task:
  Based on this resume: ${resumeText} for ${field} field, complete the following tasks:
  Analyze resume and rate (1.0-10.0)
  Generate overall Score, market strength, areas for improvement based on the analyzed resume

  Rules:
  Both Market Strength and Areas for improvement should be in paragraph form and presented as if you're talking in person.
  Only show the overall Score, resume strength, areas for improvement
  Remove any bullets
  Be brief and concise`;

  const payload = setPayload(prompt);

  try {
    const response = await axios.post(URL, payload, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error in AI API request",
      error.response?.data || error.message || error
    );
    throw new Error("An error occurred while processing the resume");
  }
};

const interviewAnswersFeeback = async (question, answer) => {
  const prompt = `
  Complete the designated task in a numerical order:
  Question: ${question}
  Answer: ${answer}
  1. Task 1: Briefly analyze the Answer base on the Question, suggest friendly improvements.
  2. Task 2: Generate a friendly feedback based on Task 1.
  3. Task 3: Present the feedback as if you're speaking to them in person.
  
  Important Rules:
  Do not show the analysis and the suggestions. Only the feedback.
  The feedback should be presented in paragraph form; maximum 100 word limit.
  `;
  const payload = setPayload(prompt);

  try {
    const response = await axios.post(URL, payload, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error in AI API request",
      error.response?.data || error.message || error
    );
    throw new Error("An error occurred while processing the answer");
  }
};

const generateFirstQuestion = async (resumeText) => {
  const prompt = `Based on this resume: ${resumeText}, generate one random interview question without any additional explanation or context. Respond with just the question.`;

  const payload = setPayload(prompt);

  try {
    const response = await axios.post(URL, payload, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Generating first question failed",
      error.response?.data || error.message || error
    );
    throw new Error("An error occurred while generating the first question");
  }
};

const generateFirstTwoQuestions = async (resumeText) => {
  const prompt = `Generate 2 questions base on this resume: ${resumeText}
  1 a priming question based on a randomly selected criterion from the following: Course, Skill, Experience, Achievements, Education, and Projects.
  2 a dynamic, synthesized probing question (based on the criterion) that validates the applicant's depth of skill.
  
  Rules:
  All questions are asked in friendly- personal form
  Present the questions as if youre talking in person
  Remove all labeling.
  Show only the questions Nothing more`;

  const payload = setPayload(prompt);

  try {
    const response = await axios.post(URL, payload, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Generating first two questions failed",
      error.response?.data || error.message || error
    );
    throw new Error(
      "An error occurred while generating the first two question"
    );
  }
};

const generateQuestions = async (
  resumeText,
  category,
  jobDescription,
  prevQuestions
) => {
  const prompt = getPrompt(resumeText, category, jobDescription, prevQuestions);

  const data = setPayload(prompt);

  try {
    const response = await axios.post(URL, data, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Generating  questions failed",
      error.response?.data || error.message || error
    );
    throw new Error("An error occurred while generating question");
  }
};

const generateOverAllFeedback = async (formattedData) => {
  const prompt = `
 1. Using a conversational and supportive tone, assess the provided Question and Answer data (${formattedData}) and generate feedback based on the following criteria:

- **Grammar**: Language accuracy, fluency, and complexity. (For transcribed text) Clarity and coherence reflected in writing.
- **Filler Words**: Number of all filler words used (e.g., *um*, *like*, *so*).
- **Skill Level**: Expertise and depth of knowledge demonstrated.
- **Experience**: Practical or theoretical insights shown in the response.
- **Relevance**: How well the response addresses the question.
- **Overall Performance**: A holistic score based on all criteria.

2. Analyze and refine the answer:
- Improve sentence structure to ensure clarity and conciseness.
2.1 Log and count all filler words based on the sample given below:
Hesitation Fillers: "um," "uh"
Discourse Markers: "like," "you know," "so"
Hedge Words: "kind of," "sort of," "actually," "basically"
Qualifiers: "honestly," "I mean"
Pauses for Thought: "well," "let me think"
2.2 Add detected filler words to the list in the JSON format below.

3. Calculate scores using:
- **Criterion Scores**: Assign 0-10 points for Grammar, Skill Level, Experience, and Relevance.
- **Filler Word Penalty**: Inverse scoring based on the following scale:
- 0-1 words: 10 points
- 2-5 words: 8 points
- 6-9 words: 6 points
- 10-15 words: 4 points
- 16-20 words: 2 points
- 20+ words: 1 point

- **Overall Score**: (Grammar + Skill + Experience + Relevance + Filler Score) / 5. Round down to the nearest whole number.

4. Double-check both accuracy in Filler List counting.

*strict JSON format* only, ensuring valid JSON syntax with no extra line breaks or mis formatted characters. Here’s the required format:

{
"criteriaScores": [
{
"criterion": "Grammar level",
"score": "score" (whole numbers only).
},
{
"criterion": "Demonstrated skill level",
"score": "score" (whole numbers only).
},
{
"criterion": "Experience shown",
"score": "score" (whole numbers only).
},
{
"criterion": "Relevance to question",
"score": "score" (whole numbers only).
},
{
"criterion": "Filler words",
"score": "count" (whole numbers only).
},
{
"criterion": "Overall Score",
"score": "score" (averaged based on all criterion scores).
},
{
"count": ("Count of all filler words found"),
"list": ["List here all filler words detected based on step 2.1"]
}
}],

"questionsFeedback": [
"Feedback for question 1",
"Feedback for question 2",
"Feedback for question 3",
"Feedback for question 4",
"Feedback for question 5",
],

"improvedAnswer": [
"improvedAnswer 1",
"improvedAnswer 2",
"improvedAnswer 3",
"improvedAnswer 4",
"improvedAnswer 5",
]
}

Format Guidelines:
1. **Contextual Relevance**:
- All feedback and optimizations must directly address the question and response, maintaining contextual alignment.

2. **Rating Scale**:
- Use a scale from 0 to 10, with no scores exceeding 10.

3. **JSON Formatting**:
- Ensure the output adheres to valid JSON syntax, avoiding errors like missing commas, mismatched brackets, or extra whitespace.

4. **Tone and Style**:
- Use a conversational, constructive tone to encourage improvement.
- Highlight strengths while providing actionable and specific suggestions for improvement.

5. **Feedback Quality**:
- Ensure feedback is dynamic, unique, and tailored to each question.
- Avoid repetitive or generic comments.

6. **Settings**:
- Configuration: [Temperature: 0.4, Role: Assistant].
- Maintain balance between creativity and adherence to guidelines.
  `;
  const payload = setPayload(prompt);

  try {
    const response = await axios.post(URL, payload, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
      },
    });

    if (!response.data) {
      throw new error("No response data");
    }
    return response.data;
  } catch (error) {
    console.error(
      "Generating overall feedback failed",
      error.response?.data || error.message || error
    );
    throw new Error("Claude API error " + error.message);
  }
};

const generateFinalGreeting = async (data) => {
  const { greeting, userResponse } = data;
  const prompt = `
    Act as Steve a friendly but professional interviewer.
    Use this greeting \n${greeting}\n and user response \n${userResponse}\nto generate a personal-tailored response to the user as reply.

    Make the conversation brief and, flows naturally to this follow up script:{To begin the interview please click the "Start Interview" button.}.

    Be sympathetic, friendly and professional but remove the invitation for further discussion.

    Strict JSON format only, ensuring valid JSON syntax with no extra line breaks or mis formatted characters. Here’s the required format:
      {
      "finalGreeting": "final greeting here"
      }
    Ensure that the response is only the final greeting and is in valid JSON syntax format and also exclude any symbol characters except ",.!?
`;

  const payload = setPayload(prompt);

  try {
    const response = await axios.post(URL, payload, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
      },
    });

    if (!response.data) {
      throw new Error("No response data");
    }
    return response.data;
  } catch (error) {
    console.error(
      "Generating final greeting failed",
      error.response?.data || error.message || error
    );
    throw new Error("Claude API error " + error.message);
  }
};

module.exports = {
  resumeFeedBack,
  interviewAnswersFeeback,
  generateFirstQuestion,
  generateFirstTwoQuestions,
  generateQuestions,
  generateOverAllFeedback,
  generateFinalGreeting,
};
