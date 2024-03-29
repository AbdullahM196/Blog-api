require("dotenv").config();
const asyncHandler = require("express-async-handler");
const JWT = require("jsonwebtoken");
const pool = require("../config/connectDb");

const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req?.cookies?.blogJWT;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: missing token" });
  }
  try {
    const decoded = JWT.verify(token, process.env.TOKEN_SECRET);
    const [rows] = await pool.query("SELECT * FROM users WHERE username=?", [
      decoded.userName,
    ]);
    req.user = rows[0];

    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized: invalid token" });
  }
});
module.exports = authMiddleware;
