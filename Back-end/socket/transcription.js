require("dotenv").config();
const googleCredential = JSON.parse(process.env.GOOGLE_CREDENTIALS);
const speech = require("@google-cloud/speech");

class TranscriptionSession {
  constructor(socket) {
    this.socket = socket;
    this.recognizeStream = null;
    this.sessionId = socket.id;
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.socket.on("audio-stream", this.handleAudioStream.bind(this));
    this.socket.on("stop-transcription", this.cleanup.bind(this));
  }

  async handleAudioStream(audioChunk) {
    try {
      if (this.recognizeStream === null) {
        await this.createRecognizeStream();
      }
      const buffer = Buffer.from(audioChunk);
      this.recognizeStream.write(buffer); // Write buffer directly to the stream
    } catch (error) {
      console.error(`Transcription error in session ${this.sessionId}:`, error);
      this.socket.emit("transcription-error", {
        message: "Error processing audio stream",
      });
      this.cleanup();
    }
  }

  async createRecognizeStream() {
    try {
      const speechClient = new speech.SpeechClient({
        credentials: googleCredential,
      });

      const request = {
        config: {
          encoding: "WEBM_OPUS", // Ensure the encoding is correct
          sampleRateHertz: 48000, // Ensure this matches the client's audio stream
          languageCode: "en-US",
          enableAutomaticPunctuation: true,
          useEnhanced: true,
          model: "video",
          speechContexts: [
            {
              phrases: [
                "specific terms",
                "domain vocabulary",
                "technical terms",
              ],
            },
          ],
          maxAlternatives: 5, // Increase alternatives
          profanityFilter: true, // Optional: helps with cleaner text
        },
        interimResults: true,
      };
      this.recognizeStream = speechClient
        .streamingRecognize(request)
        .on("error", (error) => {
          console.error(
            `Recognition error in session ${this.sessionId}:`,
            error
          );
          this.socket.emit("transcription-error", {
            message: "Speech recognition error",
          });
          this.cleanup();
        })
        .on("data", (data) => {
          const result = data.results[0];
          if (result?.alternatives[0]) {
            this.socket.emit("transcription", {
              text: result.alternatives[0].transcript,
              isFinal: result.isFinal,
              sessionId: this.sessionId,
            });
          }
        });
    } catch (error) {
      console.error(
        `Failed to create recognition stream for session ${this.sessionId}:`,
        error
      );
      throw error;
    }
  }

  cleanup() {
    if (this.recognizeStream) {
      try {
        this.recognizeStream.end();
        this.recognizeStream = null;
        console.log(`Session ${this.sessionId} cleaned up`);
      } catch (error) {
        console.error(`Cleanup error in session ${this.sessionId}:`, error);
      }
    }
  }
}

function createTranscriptionSession(socket) {
  return new TranscriptionSession(socket);
}

module.exports = { createTranscriptionSession };
