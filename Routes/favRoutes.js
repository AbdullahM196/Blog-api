const express = require("express");
const router = express.Router();
const auth = require("../Middlewares/authMiddleware");
const {
  addToFavorites,
  getUserFavorites,
  removeFromFavorites,
} = require("../Controllers/favorites");

router.post("/:id", auth, addToFavorites);
router.get("/", auth, getUserFavorites);
router.delete("/:id", auth, removeFromFavorites);

module.exports = router;
