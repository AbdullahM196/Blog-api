const pool = require("../config/connectDb");
const asyncHandler = require("express-async-handler");
const uuid = require("uuid").v4;
const validateImage = require("../lib/validateImages");
const { getCategoryById } = require("../lib/categoryFunctions");
const { saveImage, deleteImage } = require("../lib/savImages");
const { getPostById } = require("../lib/postsFunctions");
const createPost = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;
  if (!userId) {
    return res.status(401).json({ message: "unAuthorized" });
  }
  const { title, content, categoryId } = req.body;
  const img = req.file;
  if (!title || !content) {
    return res.status(400).json({ message: "title and content are required" });
  }
  const post = {
    _id: uuid(),
    title,
    content,
    userId,
  };
  if (categoryId) {
    const category = await getCategoryById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found " });
    }
    post.categoryId = category._id;
  }
  if (img) {
    const validImage = await validateImage(img);
    if (!validImage) {
      return res.status(400).json({
        message: `Images have to be one of this types 'image/jpeg','image/png','image/jpg",'image/gif','image/webp','image/svg+xml', and it is size not to be more than 1Mb `,
      });
    }
    const uploadImage = await saveImage(validImage);
    if (uploadImage.status === 500) {
      return res.status(500).json({ message: uploadImage.error });
    }
    if (uploadImage.status === 201) {
      post.img_name = uploadImage.imgName;
      post.img_url = uploadImage.downloadURl;
    }
  }
  await pool.query("INSERT INTO posts SET ?", [post]);
  return res.status(201).json(post);
});
const updatePost = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const postId = req.params.id;
  const { title, content, categoryId } = req.body;
  const img = req.file;
  if (!title && !content && !categoryId && !img) {
    return res
      .status(400)
      .json({ message: "Send at least one field to update" });
  }

  const findPost = await getPostById(postId);
  if (!findPost) {
    return res.status(404).json({ message: "Post Not found" });
  }
  if (userId !== findPost.userId) {
    return res
      .status(401)
      .json({ message: "You don't have the right to update this post" });
  }
  findPost.title = title || findPost.title;
  findPost.content = content || findPost.content;

  if (categoryId) {
    const category = await getCategoryById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found " });
    }
    findPost.categoryId = category._id;
  }
  if (img) {
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
      const deletedImg = await deleteImage(findPost.img_name);
      if (deletedImg.status === 500) {
        return res.status(500).json({ message: deletedImg.error });
      }
      findPost.img_name = uploadImage.imgName;
      findPost.img_url = uploadImage.downloadURl;
    }
  }
  await pool.query("UPDATE posts SET ? WHERE _id=?", [findPost, postId]);
  return res.status(201).json(findPost);
});
const deletePost = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const postId = req.params.id;
  const findPost = await getPostById(postId);
  if (!findPost) {
    return res.status(404).json({ message: "Post Not found" });
  }
  console.log({ userId, postId, findPost });
  if (userId !== findPost.userId) {
    return res
      .status(401)
      .json({ message: "You don't have the right to update this post" });
  }
  const deletedImg = await deleteImage(findPost.img_name);
  if (deletedImg.status === 500) {
    return res.status(500).json({ message: deletedImg.message });
  }
  await pool.query("DELETE FROM posts WHERE _id=?", [postId]);
  return res.sendStatus(204);
});
const getAllPosts = asyncHandler(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM posts");
  return res.status(200).json(rows);
});
const getPost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const findPost = await getPostById(postId);
  if (!findPost) {
    return res.status(404).json({ message: "Post Not found" });
  }
  return res.status(200).json(findPost);
});

module.exports = { createPost, updatePost, deletePost, getAllPosts, getPost };
