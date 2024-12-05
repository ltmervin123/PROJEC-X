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
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(fileBuffer);
    return data.text;
  } catch (error) {
    console.error("Error while parsing PDF:", err);
    throw new Error("Error while parsing  PDF");
  }
};

// Parse DOC/DOCX using mammoth
const parseDOC = async (filePath) => {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value;
  } catch (error) {
    console.error("Error while parsing DOC/DOCX:", error);
    throw new Error("Error while parsing DOC/DOCX");
  }
};

module.exports = {
  parseFile,
};
