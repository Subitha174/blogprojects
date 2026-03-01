const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  // image: { type: String },
  image: String,
 author: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null,
},
  category: { type: String },
  tags: [{ type: String }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  status: { type: String, enum: ["draft", "published"], default: "draft" },
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogSchema);