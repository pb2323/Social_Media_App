const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },

    bio: { type: String, required: true },

    social: {
      youtube: { type: String },
      twitter: { type: String },
      instagram: { type: String },
      facebook: { type: String },
    },

    wallet: {type: String, required:true}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", ProfileSchema);

