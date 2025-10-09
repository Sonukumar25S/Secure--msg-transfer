const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    encryptedAESKey: { type: String, required: true },
    payload: { type: String, required: true },
    file: {
      filename: String,
      originalname: String,
      mimetype: String,
      path: String,
      size: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
