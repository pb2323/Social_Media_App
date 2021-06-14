const express = require("express");
const router = express.Router();
const uuid = require("uuid").v4;
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
    const postCreated = await PostModel.findById(post._id).populate("user");
    return res.json(postCreated);
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

//LIKE A POST
router.post("/like/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req;
    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).send("Post not found");
    const isLiked =
      post.likes.filter((like) => like.user.toString() === userId).length > 0;
    if (isLiked) return res.status(401).send("Post already liked");
    await post.likes.unshift({ user: userId });
    await post.save();
    return res.status(200).send("Post liked");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
});

//UNLIKE A POST
router.post("/unlike/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req;
    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).send("Post not found");
    const notLiked =
      post.likes.filter((like) => like.user.toString() === userId).length === 0;
    if (notLiked) return res.status(401).send("Post not liked before");
    const index = post.likes
      .map((like) => like.user.toString())
      .indexOf(userId);
    await post.likes.splice(index, 1);
    await post.save();
    return res.status(200).send("Post unliked");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
});

//GET ALL LIKES
router.get("/like/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await PostModel.findById(postId).populate("likes.user");
    if (!post) return res.status(404).send("Post not found");
    return res.json(post.likes);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
});

//CREATE A COMMENT
router.post("/comment/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req;
    const { text } = req.body;
    if (text.length < 1)
      return res.status(401).send("Comment should have atleast one character");
    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).send("Post not found");
    const newComment = {
      _id: uuid(),
      text,
      user: userId,
      date: Date.now(),
    };
    await post.comments.unshift(newComment);
    await post.save();
    return res.status(200).json(newComment._id);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
});

//DELETE A COMMENT
router.delete("/:postId/:commentId", authMiddleware, async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { userId } = req;
    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).send("Post not found");
    const comment = post.comments.find((comment) => comment._id === commentId);
    if (!comment) return res.status(404).send("No comment found");
    const user = await UserModel.findById(userId);

    const deleteComment = async () => {
      const index = post.comments
        .map((comment) => comment._id.toString())
        .indexOf(commentId);
      await post.comments.splice(index, 1);
      await post.save();
      return res.status(200).send("Comment deleted");
    };

    if (comment.user.toString() !== userId) {
      if (user.role === "root") {
        await deleteComment();
      } else return res.status(401).send("Unauthorized");
    }
    await deleteComment();
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
