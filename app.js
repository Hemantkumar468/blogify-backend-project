require("dotenv").config();

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const Blog = require("./models/blog");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

const app = express();
const PORT = process.env.PORT || 8000;

// ✅ Use fallback if .env is missing
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/blogify";

// ✅ Connect to MongoDB
mongoose
  .connect(MONGO_URL)
  .then(() => console.log(" MongoDB Connected"))


// ✅ View Engine Setup
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// ✅ Middleware
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

// ✅ Routes
app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

// ✅ Start Server
app.listen(PORT, () => console.log(` Server Started at PORT: ${PORT}`));
