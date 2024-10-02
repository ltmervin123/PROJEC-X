require("dotenv").config();
const textToSpeech = require("@google-cloud/text-to-speech");

const convertTextToAudio = async (text) => {
  if (!text) {
    return res.status(400).json({ message: "Text is required" });
  }

  try {
    const client = new textToSpeech.TextToSpeechClient();
    const request = {
      input: { text },
      voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
      audioConfig: { audioEncoding: "MP3", pitch: 0, speakingRate: 0 },
    };

    const [response] = await client.synthesizeSpeech(request);
    // const audioContent = response.audioContent.toString("base64");

    console.log("Text converted to audio");
    return response.audioContent;
    // return audioContent;
  } catch (error) {
    console.error("Error converting text to audio", error);
    throw new Error("Failed to convert text to audio");
  }
};

module.exports = { convertTextToAudio };
