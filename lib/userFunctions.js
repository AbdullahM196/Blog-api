require("dotenv").config();
const pool = require("../config/connectDb");
const JWT = require("jsonwebtoken");
const getUserByUserName = async (userName) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE username=?", [
    userName,
  ]);
  if (rows === undefined || rows.length === 0) {
    return null;
  }
  return rows[0];
};
const getUserByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email=?", [email]);
  if (rows === undefined || rows.length === 0) {
    return null;
  }
  return rows[0];
};
const getUserById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE _id=?", [id]);
  if (rows === undefined || rows.length === 0) {
    return null;
  }
  return rows[0];
};
const generateToken = (userName, res) => {
  const token = JWT.sign({ userName }, process.env.TOKEN_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("blogJWT", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return token;
};
const testEmail = (email) => {
  const emailReg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!email.match(emailReg)) {
    return false;
  } else {
    return true;
  }
};

module.exports = {
  getUserByUserName,
  getUserByEmail,
  getUserById,
  generateToken,
  testEmail,
};
