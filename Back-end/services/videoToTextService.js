require("dotenv").config();
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
const speech = require("@google-cloud/speech");
const googleCredential = JSON.parse(process.env.GOOGLE_CREDENTIALS);
const googleSpeechClient = new speech.SpeechClient({
  credentials: googleCredential,
});
const { Storage } = require("@google-cloud/storage");
const storage = new Storage({ credentials: googleCredential });

//Dynamic set ffmpeg path that should both works on development and production
const ffmpegPath =
  process.env.NODE_ENV === "production" ? "/app/vendor/ffmpeg/ffmpeg" : null;

//Set the ffmpeg path to the ffmpegPath variable on production
if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
}

const uploadToGCS = async (bucketName, filePath) => {
  const fileName = path.basename(filePath);
  const bucket = storage.bucket(bucketName);

  // Upload file to GCS bucket
  await bucket.upload(filePath, {
    destination: fileName,
  });

  console.log(`File uploaded to GCS: gs://${bucketName}/${fileName}`);
  return `gs://${bucketName}/${fileName}`;
};

// Convert video to audio
const convertVideoToAudio = async (convertedFileName, interviewId) => {
  try {
    if (!fs.existsSync(convertedFileName)) {
      throw new Error(
        `Video file does not exist at path: ${convertedFileName}`
      );
    }

    const outputAudioPath = path.join(
      __dirname,
      "../uploads",
      `${interviewId}audio-output.wav`
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
    const bucketName = process.env.GCS_BUCKET_NAME;
    const gcsUri = await uploadToGCS(bucketName, audioFilePath);
    // const audioBytes = fs.readFileSync(audioFilePath).toString("base64");
    const request = {
      audio: { uri: gcsUri },
      config: {
        encoding: "LINEAR16",
        sampleRateHertz: 16000,
        languageCode: "en-US",
        enableAutomaticPunctuation: true,
        model: "video",
        speechContexts: [
          {
            phrases: ["specific", "domain", "terms", "example phrase"], // Add context-specific phrases
          },
        ],
      },
    };

    // Step 3: Use longRunningRecognize for transcription
    const [operation] = await googleSpeechClient.longRunningRecognize(request);
    const [response] = await operation.promise();

    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");

    console.log("Transcription completed!");
    return transcription;
  } catch (error) {
    console.log("Error during transcription:", error);
  }
};

// Process the video file: convert it to audio, then transcribe the audio to text
const processVideoFile = async (convertedFileName, interviewId) => {
  try {
    const audioFilePath = await convertVideoToAudio(
      convertedFileName,
      interviewId
    );
    const transcription = await convertAudioToText(audioFilePath);
    // Cleanup audio file after processing
    fs.unlinkSync(audioFilePath);
    //delete the video file
    fs.unlinkSync(convertedFileName);
    return transcription;
  } catch (error) {
    console.log("Error at processVideoFile: ", error);
    throw new Error("Error during while processing the video");
  }
};

module.exports = { processVideoFile };
