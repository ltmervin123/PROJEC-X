const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

// Parse the file based on its MIME type
const parseFile = async (filePath, fileType) => {
  if (fileType === "application/pdf") {
    return await parsePDF(filePath);
  } else if (
    fileType === "application/msword" ||
    fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return await parseDOC(filePath);
  } else {
    throw new Error("Unsupported file format");
  }
};

// Parse PDF using pdf-parse
const parsePDF = async (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(fileBuffer);
  return data.text; // Extracted text from the PDF
};

// Parse DOC/DOCX using mammoth
const parseDOC = async (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  const result = await mammoth.extractRawText({ buffer: fileBuffer });
  return result.value; // Extracted text from the DOCX
};

module.exports = {
  parseFile,
};
