const Blog = require("../models/Blog");

// Create
 const createBlog = async (req, res) => {
   try {
     const blog = await Blog.create({
       title: req.body.title,
       description: req.body.description,
       content: req.body.content,
       category: req.body.category,
       tags: req.body.tags || [],
      author: req.user?._id || null, 
      image: req.file ? req.file.filename : null,
     });

    res.status(201).json(blog);
   } catch (error) {
    console.log("CREATE BLOG ERROR:", error);
     res.status(500).json({ message: "Blog creation failed" });
   }
 };
exports.createBlog = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const {
      title,
      description,
      content,
      category,
      tags,
      image,
    } = req.body;

    const newBlog = new Blog({
      title,
      description,  
      content,
      category,
      tags: tags ? JSON.parse(tags) : [],
      image: req.file ? req.file.filename : null,
      author: req.user._id,
      status: "published",
    });

    await newBlog.save();

    res.status(201).json({
      message: "Blog created successfully",
      blog: newBlog,
    });
  } catch (error) {
    console.log("CREATE BLOG ERROR:", error);
    res.status(500).json({ message: "Create blog failed" });
  }
};

// List with pagination
const getBlogs = async (req, res) => {
  const { page = 1, limit = 10, category, tag, search } = req.query;
  let query = {};
  if (category) query.category = category;
  if (tag) query.tags = tag;
  if (search) query.title = { $regex: search, $options: "i" };

  const blogs = await Blog.find(query)
    .populate("author", "name")
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const count = await Blog.countDocuments(query);
  res.json({ blogs, totalPages: Math.ceil(count / limit), currentPage: page });
};

// Get single
const getBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("author", "name");
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  res.json(blog);
};

// Update
// const updateBlog = async (req, res) => {
//   const blog = await Blog.findById(req.params.id);
//   if (!blog) return res.status(404).json({ message: "Blog not found" });
//   Object.assign(blog, req.body);
//   await blog.save();
//   res.json(blog);
// };

// // Delete
// const deleteBlog = async (req, res) => {
//   const blog = await Blog.findById(req.params.id);
//   if (!blog) return res.status(404).json({ message: "Blog not found" });
//   await blog.remove();
//   res.json({ message: "Blog removed" });
// };
const deleteBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });

  // Only author can delete
  if (blog.author.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not allowed" });

  await blog.deleteOne();
  res.json({ message: "Blog removed successfully" });
};
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Only author can update
    if (blog.author.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not allowed" });

    const { title, content, description, category, tags } = req.body;

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.description = description || blog.description;
    blog.category = category || blog.category;

    // ✅ Handle tags safely
    if (tags) {
      blog.tags = typeof tags === "string" ? JSON.parse(tags) : tags;
    }

    if (req.file) blog.image = req.file.filename;

    await blog.save();
    res.json({ message: "Blog updated successfully", blog });
  } catch (error) {
    console.log("UPDATE BLOG ERROR:", error);
    res.status(500).json({ message: "Update failed" });
  }
};

// Like
const likeBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  if (blog.likes.includes(req.user._id)) {
    blog.likes.pull(req.user._id);
  } else {
    blog.likes.push(req.user._id);
  }
  await blog.save();
  res.json(blog);
};

module.exports = { createBlog, getBlogs, getBlog, updateBlog, deleteBlog, likeBlog };