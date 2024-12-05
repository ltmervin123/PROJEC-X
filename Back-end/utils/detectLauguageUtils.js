const franc = require("franc");

const detectLanguage = (text) => {
  const languageCode = franc(text);
  const iso6391Map = {
    eng: "English",
    jpn: "Japanese",
    und: "Undetermined", // undetermined
  };

  return iso6391Map[languageCode] || "Undetermined";
};

module.exports = detectLanguage;
