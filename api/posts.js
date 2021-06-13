const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const UserModel = require("../models/UserModel");
const PostModel = require("../models/PostModel");
const FollowerModel = require("../models/FollowerModel");

//CREATE A POST
router.post("/", authMiddleware, async (req, res) => {
  const { text, picUrl, location } = req.body;
  if (text && text.length < 1)
    return res.status(401).send("Text must be atleast 1 character");
  try {
    const newPost = {
      user: req.userId,
      text,
    };
    if (picUrl) newPost.picUrl = picUrl;
    if (location) newPost.location = location;
    const post = await new PostModel(newPost).save();
    return res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
});

//GET ALL POSTS
router.get("/", authMiddleware, async (req, res) => {
  try {
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .populate("user")
      .populate("comments.user");
    return res.json(posts);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
});

//GET POST BY ID
router.get("/:postId", authMiddleware, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.postId);
    if (!post) return res.status(404).send("Post not found");
    return res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
});

//DELETE POST
router.delete("/:postId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;
    const { postId } = req.params;
    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).send("Post not found");
    const user = await UserModel.findById(userId);
    if (post.user.toString() !== userId) {
      if (user.role === "root") {
        await post.remove();
        return res.status(200).send("Post deleted successfully");
      } else return res.status(401).send("Unauthorized");
    }
    await post.remove();
    return res.status(200).send("Post deleted successfully");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
