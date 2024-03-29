const pool = require("../config/connectDb");
const asyncHandler = require("express-async-handler");
const {
  getUserByUserName,
  getUserByEmail,
  generateToken,
  testEmail,
} = require("../lib/userFunctions");
const bcrypt = require("bcrypt");
const uuid = require("uuid").v4;
const { saveImage, deleteImage } = require("../lib/savImages");
const validateImage = require("../lib/validateImages");
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please add all fields" });
  }
  const validEmail = testEmail(email);
  if (!validEmail) {
    return res.status(400).json({ message: "Please add valid email" });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password Have to be at least 8 characters" });
  }
  const duplicateUserName = await getUserByUserName(username);
  const duplicateEmail = await getUserByEmail(email);
  if (duplicateUserName || duplicateEmail) {
    return res.status(409).json({ message: "User already exists" });
  }
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);
  const token = generateToken(username, res);
  const user = {
    _id: uuid(),
    username,
    email,
    password: hashedPassword,
    token,
  };
  await pool.query("INSERT INTO users SET ?", [user]);

  return res.status(201).json({ _id: user._id, username, email });
});
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please add all fields" });
  }
  const validEmail = testEmail(email);
  if (!validEmail) {
    return res.status(400).json({ message: "Please add valid email" });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters" });
  }
  const findUser = await getUserByEmail(email);
  if (!findUser) {
    return res.status(404).json({ message: "Invalid Credentials" });
  }
  const match = await bcrypt.compare(password, findUser.password);
  if (!match) {
    return res.status(404).json({ message: "Invalid Credentials" });
  }
  const token = generateToken(findUser.username, res);
  findUser.token = token;
  await pool.query("UPDATE users SET token=? WHERE email=?", [token, email]);

  return res.status(201).json({
    _id: findUser._id,
    username: findUser.username,
    email: findUser.email,
  });
});
const logout = asyncHandler(async (req, res) => {
  const token = req?.cookies?.blogJWT;
  if (!token) {
    return res.sendStatus(204);
  }
  // is token in database.
  const findUser = await pool.query(`SELECT * FROM users WHERE token=?`, [
    token,
  ]);
  if (!findUser) {
    return res.sendStatus(204);
  }
  // remove token from database.
  await pool.query(`UPDATE users SET token=? WHERE token=?`, [null, token]);
  res.clearCookie("blogJWT");
  return res.sendStatus(204);
});
const profile = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return res.status(200).json({
    user,
  });
});
const editProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { username, email } = req.body;
  const img = req.file;
  if (!username && !email && !img) {
    return res.status(400).json({ message: "Please add fields to update" });
  }
  if (username) {
    const duplicateUserName = await getUserByUserName(username);
    if (duplicateUserName && duplicateUserName._id !== user._id) {
      return res.status(409).json({ message: "User already exists" });
    }
    user.username = username;
  }
  if (email) {
    const duplicateEmail = await getUserByEmail(email);
    if (duplicateEmail && duplicateEmail._id !== user._id) {
      return res.status(409).json({ message: "User already exists" });
    }
    user.email = email;
  }
  if (img) {
    if (user.img_name) {
      await deleteImage(user.img_name);
    }
    const validImage = await validateImage(img);
    if (!validImage) {
      return res.status(400).json({
        message: `Images have to be one of this types 
                  "image/jpeg",
                  "image/png",
                  "image/jpg",
                  "image/gif",
                  "image/webp",
                  "image/svg+xml", and it is size not to be more than 1Mb `,
      });
    }
    const uploadImage = await saveImage(validImage);
    if (uploadImage.status === 500) {
      return res.status(500).json({ message: uploadImage.error });
    }
    if (uploadImage.status === 201) {
      user.img_name = uploadImage.imgName;
      user.img_url = uploadImage.downloadURl;
    }
  }
  await pool.query("UPDATE users SET? WHERE _id=?", [user, user._id]);
  return res.status(201).json({ _id: user._id, username, email });
});

module.exports = { register, login, logout, profile, editProfile };
