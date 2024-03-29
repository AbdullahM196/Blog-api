const pool = require("../config/connectDb");
const asyncHandler = require("express-async-handler");
const uuid = require("uuid").v4;
const { getPostById } = require("../lib/postsFunctions");
// todo add to favorite.
const addToFavorites = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const postId = req.params.id;
  const findPost = await getPostById(postId);
  if (!findPost) {
    return res.status(404).json({ message: "Post not found" });
  }
  const [rows] = await pool.query(
    "SELECT * FROM favorites WHERE userId =? AND postId =?",
    [userId, postId]
  );
  if (rows.length > 0) {
    return res.status(409).json({ message: "Post already in favorite" });
  }
  const fav = {
    _id: uuid(),
    userId,
    postId,
  };
  await pool.query("INSERT INTO favorites SET ?", [fav]);
  return res.status(201).json(fav);
});
// todo remove from favorite.

const removeFromFavorites = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const postId = req.params.id;
  const findPost = await getPostById(postId);
  if (!findPost) {
    return res.status(404).json({ message: "Post not found" });
  }
  const [rows] = await pool.query(
    "SELECT * FROM favorites WHERE userId =? AND postId =?",
    [userId, postId]
  );
  if (rows.length === 0) {
    return res.status(404).json({ message: "Post is not in user favorite" });
  }
  await pool.query("DELETE FROM favorites WHERE userId =? AND postId =?", [
    userId,
    postId,
  ]);
  return res.sendStatus(204);
});
// todo get user favorite.
const getUserFavorites = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const [rows] = await pool.query("SELECT * FROM favorites WHERE userId=?", [
    userId,
  ]);
  if (rows.length === 0) {
    return res.status(404).json({ message: "No favorite found" });
  }
  return res.status(200).json(rows);
});
module.exports = { addToFavorites, getUserFavorites, removeFromFavorites };
