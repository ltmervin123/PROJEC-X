const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");

// Function to convert WebM to MP4
const convertToMp4 = (videoPath, outputFolder, originalFileName) => {
  return new Promise((resolve, reject) => {
    // Define the converted file name and path
    const convertedFileName = `${originalFileName}.mp4`;
    const convertedFilePath = path.join(outputFolder, convertedFileName);

    console.log(`Converting video: ${videoPath}`);
    console.log(`Converted file path: ${convertedFilePath}`);

    // Convert the WebM file to MP4 using ffmpeg
    ffmpeg(videoPath)
      .output(convertedFilePath)
      .on("end", () => {
        console.log(`Video converted successfully: ${convertedFilePath}`);
        // Optionally delete the original file if needed
        fs.unlinkSync(videoPath); // Uncomment this line if you want to delete the original file
        resolve(convertedFilePath); // Resolve the promise with the converted file name
      })
      .on("error", (error) => {
        console.error("Error converting video:", error);
        reject(error); // Reject the promise if conversion fails
      })
      .run(); // Start the conversion process
  });
};

module.exports = { convertToMp4 };
