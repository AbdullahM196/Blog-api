const express = require("express");
const {
  register,
  login,
  logout,
  profile,
  editProfile,
} = require("../Controllers/userController");
const auth = require("../Middlewares/authMiddleware");
const router = express.Router();
const { upload } = require("../lib/savImages");
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", auth, profile);
router.put("/profile", auth, upload.single("photo"), editProfile);
module.exports = router;
