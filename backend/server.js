const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// ✅ Load ENV first
dotenv.config();

const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blogs");
const commentRoutes = require("./routes/comments");

const app = express();

/* =========================
   GLOBAL MIDDLEWARES
========================= */

// CORS
app.use(cors());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =========================
   ROUTES
========================= */

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/comments", commentRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("API Running ✅");
});

/* =========================
   DATABASE CONNECTION
========================= */

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URL) // ✅ FIXED (removed old options)
  .then(() => {

    console.log("✅ MongoDB Connected Successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });

  })
  .catch((err) => {

    console.error("❌ MongoDB Connection Error:", err.message);

    process.exit(1);

  });