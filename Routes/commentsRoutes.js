const express = require("express");
const router = express.Router();
const auth = require("../Middlewares/authMiddleware");
const {
  createComment,
  getAllComments,
  updateComment,
  deleteComment,
} = require("../Controllers/commentsControllers");

router.post("/", auth, createComment);
router.get("/:id", auth, getAllComments);
router.put("/", auth, updateComment);
router.delete("/:id", auth, deleteComment);

module.exports = router;
