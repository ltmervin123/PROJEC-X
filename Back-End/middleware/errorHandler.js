const CustomException = require("../exception/customException");

const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomException) {
    console.log("Custom Exception:", err.message, err.status);
    res.status(err.status).json({ error: err.message });
  } else {
    console.log("Unhandle Exception:", err.message);
    res
      .status(500)
      .json({ error: "Something went wrong to the server, Please try again" });
  }
};

module.exports = { errorHandlerMiddleware };
