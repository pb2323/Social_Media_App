const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const UserModel = require("../models/UserModel");
const NotificationModel = require("../models/NotificationModel");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;
    const user = await NotificationModel.findOne({ user: userId })
      .populate("notifications.user")
      .populate("notifications.post");

    return res.json(user.notifications);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;
    const user = await UserModel.findById(userId);

    if (user.unreadNotification) {
      user.unreadNotification = false;
      await user.save();
    }

    return res.status(200).send("Updated");

    return res.json(user.notifications);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
