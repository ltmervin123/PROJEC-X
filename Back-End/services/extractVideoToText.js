require("dotenv").config();

const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
const speech = require("@google-cloud/speech"); // Import the SpeechClient from Google Cloud
// Initialize Google Speech Client
const googleSpeechClient = new speech.SpeechClient(); // Automatically picks up GOOGLE_APPLICATION_CREDENTIALS


// Convert video to audio
const convertVideoToAudio = (videoFilePath) => {
  return new Promise((resolve, reject) => {
    const outputAudioPath = path.join(
      __dirname,
      "../uploads",
      "audio-output.mp3"
    );

    ffmpeg(videoFilePath)
      .output(outputAudioPath)
      .on("end", () => {
        console.log("Conversion finished successfully.");
        resolve(outputAudioPath);
      })
      .on("error", (err) => {
        console.error("Error during conversion:", err.message);
        reject(new Error(`Conversion failed: ${err.message}`));
      })
      .run();
  });
};

// Convert audio to text using Google Cloud Speech-to-Text API
const convertAudioToText = async (audioFilePath) => {
  if (!googleSpeechClient) {
    throw new Error("Google Cloud Speech-to-Text client not initialized");
  }

  try {
    const audioBytes = fs.readFileSync(audioFilePath).toString("base64");
    const request = {
      audio: { content: audioBytes },
      config: {
        encoding: "MP3",
        sampleRateHertz: 16000,
        languageCode: "en-US",
      },
    };

    // Detects speech in the audio file
    const [response] = await googleSpeechClient.recognize(request);
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");
    return transcription;
  } catch (error) {
    console.error("Error during transcription:", error);
    throw new Error(`Transcription failed: ${error.message}`);
  }
};

// Process the video file: convert it to audio, then transcribe the audio to text
exports.processVideoFile = async (videoFilePath) => {
  try {
    const audioFilePath = await convertVideoToAudio(videoFilePath);
    const transcription = await convertAudioToText(audioFilePath);

    // Cleanup audio file after processing
    fs.unlinkSync(audioFilePath);

    return transcription;
  } catch (error) {
    console.error("Error during file processing:", error);
    throw error;
  }
};
