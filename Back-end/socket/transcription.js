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
      if (!this.recognizeStream) {
        await this.createRecognizeStream();
      }
      this.recognizeStream.write(audioChunk);
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
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      });

      const request = {
        config: {
          encoding: "LINEAR16",
          sampleRateHertz: 48000,
          languageCode: "en-US",
          enableAutomaticPunctuation: true,
          model: "default",
          useEnhanced: true,
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
