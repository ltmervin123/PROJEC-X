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

// Stream audio conversion directly to GCS
const convertVideoToAudioAndStream = async (
  videoPath,
  interviewId,
  bucketName
) => {
  try {
    if (!fs.existsSync(videoPath)) {
      throw new Error(`Video file does not exist at path: ${videoPath}`);
    }

    const bucket = storage.bucket(bucketName);
    const gcsFileName = `${interviewId}-audio-output.wav`;
    const file = bucket.file(gcsFileName);

    const gcsStream = file.createWriteStream({
      metadata: {
        contentType: "audio/wav",
      },
      resumable: false,
    });

    // ffmpeg stream setup: Convert video to audio (WAV) and pipe to GCS
    return await new Promise((resolve, reject) => {
      const ffmpegProcess = ffmpeg(videoPath)
        .toFormat("wav")
        .audioFrequency(16000)
        .audioChannels(1)
        .pipe(gcsStream);

      gcsStream
        .on("finish", () => {
          resolve(`gs://${bucketName}/${gcsFileName}`);
        })
        .on("error", (err) => {
          console.error("Error during GCS upload:", err);
          reject(new Error("Streaming upload failed"));
        });

      ffmpegProcess.on("error", (err) => {
        console.error("Error during ffmpeg processing:", err);
        reject(new Error("ffmpeg conversion failed"));
      });
    });
  } catch (error) {
    throw new Error(`Error during audio streaming: ${error.message}`);
  }
};

// Convert audio to text using Google Cloud Speech-to-Text API
const convertAudioToText = async (gcsUri) => {
  if (!googleSpeechClient) {
    throw new Error("Google Cloud Speech-to-Text client not initialized");
  }

  try {
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
            phrases: ["specific", "domain", "terms", "example phrase"],
          },
        ],
      },
    };

    const [operation] = await googleSpeechClient.longRunningRecognize(request);
    const [response] = await operation.promise();

    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");

    return transcription;
  } catch (error) {
    console.log("Error during transcription:", error);
  }
};

// Process video file: Convert video to audio and transcribe to text
const processVideoFile = async (videoPath, interviewId) => {
  try {
    const bucketName = process.env.GCS_BUCKET_NAME;
    const gcsUri = await convertVideoToAudioAndStream(
      videoPath,
      interviewId,
      bucketName
    );
    const transcription = await convertAudioToText(gcsUri);
    return transcription;
  } catch (error) {
    console.log("Error at processVideoFile: ", error);
    throw new Error("Error during while processing the video");
  } finally {
    fs.unlinkSync(videoPath);
  }
};

module.exports = { processVideoFile };
