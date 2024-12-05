require("dotenv").config();
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
const speech = require("@google-cloud/speech");
const googleSpeechClient = new speech.SpeechClient();

//Dynamic set ffmpeg path that should both works on development and production
const ffmpegPath = (process.env.NODE_ENV === "production") ? "/app/vendor/ffmpeg/ffmpeg" : null;

if(ffmpegPath){
  ffmpeg.setFfmpegPath(ffmpegPath);
}

// Convert video to audio
const convertVideoToAudio = async (convertedFileName) => {
  try {
    if (!fs.existsSync(convertedFileName)) {
      throw new Error(
        `Video file does not exist at path: ${convertedFileName}`
      );
    }

    const outputAudioPath = path.join(
      __dirname,
      "../uploads",
      "audio-output.wav"
    );

    await new Promise((resolve, reject) => {
      ffmpeg(convertedFileName)
        .toFormat("wav")
        .audioFrequency(16000) // Ensure sample rate is 16 kHz
        .audioChannels(1) // Mono audio improves recognition
        .output(outputAudioPath)
        .on("end", () => resolve(outputAudioPath))
        .on("error", (err) => {
          console.error("Error during conversion:", err);
          reject(new Error("Conversion failed"));
        })
        .run();
    });

    return outputAudioPath;
  } catch (error) {
    throw new Error("Error during audio conversion");
  }
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
        encoding: "LINEAR16", // WAV format
        sampleRateHertz: 16000,
        languageCode: "en-US",
        enableAutomaticPunctuation: true,
        model: "video", // Choose a domain-specific model
        speechContexts: [
          {
            phrases: ["specific", "domain", "terms", "example phrase"], // Add context-specific phrases
          },
        ],
      },
    };

    // Detects speech in the audio file
    const [response] = await googleSpeechClient.recognize(request);
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");
    return transcription;
  } catch (error) {
    console.log("Error during transcription:", error);
  }
};

// Process the video file: convert it to audio, then transcribe the audio to text
const processVideoFile = async (convertedFileName) => {
  try {
    const audioFilePath = await convertVideoToAudio(convertedFileName);
    const transcription = await convertAudioToText(audioFilePath);
    // Cleanup audio file after processing
    fs.unlinkSync(audioFilePath);
    //delete the video file
    fs.unlinkSync(convertedFileName);
    return transcription;
  } catch (error) {
    console.log("Error at processVideoFile: ", error.message);
    throw new Error("Error during while processing the video");
  }
};

module.exports = { processVideoFile };
