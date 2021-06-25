const UserModel = require("../models/UserModel");
const NotificationModel = require("../models/NotificationModel");

const setNotificationToUnread = async (userId) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user.unreadNotification) {
      user.unreadNotification = true;
      user.save();
    }
    return;
  } catch (err) {
    console.error(err);
  }
};

const newLikeNotification = async (userId, postId, userToNotifyId) => {
  try {
    const userToNotify = await NotificationModel.findOne({
      user: userToNotifyId,
    });

    const newNotification = {
      type: "newLike",
      user: userId,
      post: postId,
      date: Date.now(),
    };

    await userToNotify.notifications.unshift(newNotification);
    await userToNotify.save();

    await setNotificationToUnread(userToNotifyId);
    return;
  } catch (err) {
    console.error(err);
  }
};

const removeLikeNotification = async (userId, postId, userToNotifyId) => {
  try {
    const user = await NotificationModel.findOne({ user: userToNotifyId });
    const notificationToRemove = await user.notifications.find(
      (notification) =>
        notification.user.toString() === userId &&
        notification.type === "newLike" &&
        notification.post.toString() === postId
    );

    const indexOf = user.notifications
      .map((notification) => notification._id.toString())
      .indexOf(notificationToRemove._id.toString());
    await user.notifications.splice(indexOf, 1);
    await user.save();
    return;
  } catch (err) {
    console.error(err);
  }
};

const newCommentNotification = async (
  postId,
  commentId,
  userId,
  userToNotifyId,
  text
) => {
  try {
    const userToNotify = await NotificationModel.findOne({
      user: userToNotifyId,
    });

    const newNotification = {
      type: "newComment",
      user: userId,
      post: postId,
      commentId,
      text,
      date: Date.now(),
    };

    await userToNotify.notifications.unshift(newNotification);
    await userToNotify.save();

    await setNotificationToUnread(userToNotifyId);
  } catch (err) {
    console.error(err);
  }
};

const removeCommentNotification = async (
  postId,
  commentId,
  userId,
  userToNotifyId
) => {
  try {
    const user = await NotificationModel.findOne({
      user: userToNotifyId,
    });

    const notificationToRemove = await user.notifications.find(
      (notification) =>
        notification.post.toString() === postId &&
        notification.user.toString() === userId &&
        notification.commentId === commentId &&
        notification.type === "newComment"
    );

    const indexOf = await user.notifications
      .map((notification) => notification._id.toString())
      .indexOf(notificationToRemove._id.toString());

    await user.notifications.splice(indexOf, 1);
    await user.save();
    return;
  } catch (err) {
    console.error(err);
  }
};

const newFollowerNotification = async (userId, userToNotifyId) => {
  try {
    const user = await NotificationModel.findOne({ user: userToNotifyId });

    const newNotification = {
      type: "newFollower",
      user: userId,
      date: Date.now(),
    };

    await user.notifications.unshift(newNotification);
    await user.save();

    await setNotificationToUnread(userToNotifyId);
    return;
  } catch (err) {
    console.error(err);
  }
};

const removeFollowerNotification = async (userId, userToNotifyId) => {
  try {
    const user = await NotificationModel.findOne({
      user: userToNotifyId,
    });

    const notificationToRemove = await user.notifications.find(
      (notification) =>
        notification.user.toString() === userId &&
        notification.type === "newFollower"
    );

    const indexOf = await user.notifications
      .map((notification) => notification._id.toString())
      .indexOf(notificationToRemove._id.toString());

    await user.notifications.splice(indexOf, 1);
    await user.save();
    return;
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  newLikeNotification,
  removeLikeNotification,
  newCommentNotification,
  removeCommentNotification,
  newFollowerNotification,
  removeFollowerNotification,
};
