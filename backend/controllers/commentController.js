const Comment = require("../models/Comment");

// CREATE comment
exports.createComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      blog: req.body.blogId,
      user: req.user._id,
      content: req.body.content,
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET comments for blog
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.blogId }).populate("user", "name");
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};