import apiError from "../utils/apiError.js";

export default (err, req, res, next) => {
  console.error(err);
  if (err instanceof apiError) {
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message });
  }
  res.status(500).json({ success: false, message: "Internal Server Error" });
};
