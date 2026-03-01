const router = require("express").Router();
const { protect } = require("../middlewares/authMiddleware");
const { createComment, getComments } = require("../controllers/commentController");

router.get("/:blogId", getComments);
router.post("/", protect, createComment);

module.exports = router;