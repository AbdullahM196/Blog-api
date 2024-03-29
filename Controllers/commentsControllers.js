const pool = require("../config/connectDb");
const asyncHandler = require("express-async-handler");
const uuid = require("uuid").v4;
const { getPostById } = require("../lib/postsFunctions");
const createComment = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { content, postId } = req.body;
  if (!content || !postId) {
    return res.status(400).json({ message: "Please add all fields" });
  }
  const post = await getPostById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  const commentObj = {
    _id: uuid(),
    postId,
    userId,
    content,
  };
  await pool.query("INSERT INTO comment SET ?", commentObj);
  return res.status(201).json(commentObj);
});
const getAllComments = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const post = await getPostById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  const [rows] = await pool.query("SELECT * FROM comment WHERE postId = ?", [
    postId,
  ]);
  return res.status(200).json(rows);
});
const updateComment = asyncHandler(async (req, res) => {
  const { content, commentId } = req.body;
  const userId = req.user._id;
  if (!commentId || !content) {
    return res
      .status(400)
      .json({ message: "CommentId and content are required" });
  }
  const [rows] = await pool.query("SELECT * FROM comment WHERE _id = ?", [
    commentId,
  ]);
  const comment = rows[0];
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }
  if (userId !== comment.userId) {
    return res
      .status(401)
      .json({ message: "You don't have the right to update this post" });
  }
  await pool.query("UPDATE comment SET content =? WHERE _id =?", [
    content,
    commentId,
  ]);
  return res
    .status(201)
    .json({ commentId, content, postId: comment.postId, userId });
});
const deleteComment = asyncHandler(async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user._id;
  const [rows] = await pool.query("SELECT * FROM comment WHERE _id = ?", [
    commentId,
  ]);
  const comment = rows[0];
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }
  if (userId !== comment.userId) {
    return res
      .status(401)
      .json({ message: "You don't have the right to delete this post" });
  }
  await pool.query("DELETE FROM comment WHERE _id = ?", [commentId]);
  return res.sendStatus(204);
});
module.exports = {
  createComment,
  getAllComments,
  updateComment,
  deleteComment,
};
