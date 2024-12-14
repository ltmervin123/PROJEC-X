require("dotenv").config();
const textToSpeech = require("@google-cloud/text-to-speech");
const googleCredential = JSON.parse(process.env.GOOGLE_CREDENTIALS);

const convertTextToAudio = async (text) => {
  if (!text) {
    throw new Error("Text is required");
  }

  try {
    const client = new textToSpeech.TextToSpeechClient({
      credentials: googleCredential,
    });
    const request = {
      input: { text },
      voice: { languageCode: "en-US", ssmlGender: "MALE" },
      audioConfig: { audioEncoding: "MP3", pitch: 0, speakingRate: 0 },
    };

    // const request = {
    //   audioConfig: {
    //     audioEncoding: "MP3",
    //     effectsProfileId: ["telephony-class-application"],
    //     pitch: 0,
    //     speakingRate: 0,
    //   },
    //   input: {
    //     text: text,
    //   },
    //   voice: {
    //     languageCode: "en-US",
    //     name: "en-US-Journey-F",
    //   },
    // };

    const [response] = await client.synthesizeSpeech(request);
    const audioContent = response.audioContent.toString("base64");

    if (!audioContent) {
      throw new Error("Audio content is empty");
    }

    return audioContent;
  } catch (error) {
    console.log(error);
    throw new Error("Google text to speech error " + error.message);
  }
};

module.exports = { convertTextToAudio };
