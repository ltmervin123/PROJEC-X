const sanitizeData = (data) => {
  return data
    .trim()
    .replace(/[\n\r]+/g, " ")
    .replace(/\s+/g, " ");
};

module.exports = { sanitizeData };
