const { parseFile } = require('./fileParser');
const { sendToAI } = require('./aiService');

const handleFileUpload = async (req, res) => {
  const file = req.file;
  const field = req.body.field;

  if (!file) return res.status(400).json({ message: 'File is required' });
  if (!field) return res.status(400).json({ message: 'Field is required' });

  try {
    // Parse the uploaded file
    const resumeText = parseFile(file.path, file.mimetype);
    
    // Send resume text to AI API
    const aiResponse = await sendToAI(resumeText, field);
    
    // Process AI response (resume suggestions and interview questions)
    const formattedResponse = processAIResponse(aiResponse);
    
    res.json({ message: 'File processed successfully', result: formattedResponse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const processAIResponse = (aiResponse) => {
  return {
    suggestions: aiResponse.resume_suggestions,
    interviewQuestions: aiResponse.interview_questions
  };
};

module.exports = {
  handleFileUpload
};
