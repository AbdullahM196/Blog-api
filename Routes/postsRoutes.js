const express = require("express");
const auth = require("../Middlewares/authMiddleware");
const router = express.Router();
const {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  getPost,
} = require("../Controllers/postsController");
const { upload } = require("../lib/savImages");

router.post("/", auth, upload.single("photo"), createPost);
router.get("/", getAllPosts);
router.get("/:id", getPost);
router.put("/:id", auth, upload.single("photo"), updatePost);
router.delete("/:id", auth, deletePost);

module.exports = router;
