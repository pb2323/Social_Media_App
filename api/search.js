const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const UserModel = require("../models/UserModel");

router.get("/:searchText", authMiddleware, async (req, res) => {
  try {
    const { searchText } = req.params;
    const { userId } = req;

    if (searchText.length === 0) return;

    let userPattern = new RegExp(`.*${searchText}.*`);

    const results = await UserModel.find({
      name: { $regex: userPattern, $options: "i" },
    });

    const resultsToBeSent =
      results.length > 0 &&
      results.filter((result) => {
        return result._id.toString() !== userId.toString();
      });

    return res
      .status(200)
      .json(resultsToBeSent.length > 0 ? resultsToBeSent : []);
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error`);
  }
});

module.exports = router;
