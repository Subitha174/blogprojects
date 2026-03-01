const express = require("express");
const router = express.Router();

const { protect, authorOnly } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
} = require("../controllers/blogController");

// ✅ CREATE BLOG (WITH IMAGE)
router.post("/", protect, authorOnly, upload.single("image"), createBlog);

router.get("/", getBlogs);
router.get("/:id", getBlog);

router.put("/:id", protect, authorOnly, upload.single("image"), updateBlog);

router.delete("/:id", protect, authorOnly, deleteBlog);

router.put("/:id/like", protect, likeBlog);

module.exports = router;