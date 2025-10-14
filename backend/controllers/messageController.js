const fs = require("fs");
const path = require("path");
const Message = require("../models/Message");
const User = require("../models/User");
const cryptoUtils = require("../utils/crypto");

// 📤 Send message (text + optional file)
exports.sendMessage = async (req, res) => {
  try {
    const { receiverEmail, encryptedAESKey, payload } = req.body;
    const file = req.file;

    const senderId = req.user.id;
    const receiver = await User.findOne({ email: receiverEmail });
    if (!receiver) return res.status(404).json({ message: "Receiver not found" });

    let fileInfo = null;
    if (file) {
      if (!fs.existsSync(file.path)) {
        console.error("🚫 File upload failed - file missing after multer");
        return res.status(500).json({ message: "File upload failed. Try again." });
      }

      fileInfo = {
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        path: file.path,
        size: file.size,
      };
    }

    const message = new Message({
      sender: senderId,
      receiver: receiver._id,
      encryptedAESKey,
      payload,
      file: fileInfo,
    });

    await message.save();
    console.log("✅ Message saved successfully");
    res.json({ message: "Message sent successfully" });
  } catch (err) {
    console.error("❌ Send message error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// 📥 Get all messages for logged-in user (Inbox)
exports.getInbox = async (req, res) => {
  try {
    const userId = req.user.id;
    const messages = await Message.find({ receiver: userId })
      .populate("sender", "email name")
      .sort({ createdAt: -1 });

    console.log(`📬 ${messages.length} message(s) fetched for user ${userId}`);
    return res.json(messages);
  } catch (err) {
    console.error("❌ Get inbox error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// 📄 Download file attached to a message
exports.downloadFile = async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg || !msg.file || !msg.file.path) {
      console.error("⚠️ File not found in message record");
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.resolve(msg.file.path);
    console.log(`⬇️ Attempting to download file: ${filePath}`);

    // Ensure file exists on disk
    if (!fs.existsSync(filePath)) {
      console.error(`🚫 File missing from disk: ${filePath}`);
      return res.status(404).json({
        message: "File data exists in DB but missing on server disk.",
      });
    }

    // Stream file to client
    return res.download(filePath, msg.file.originalname);
  } catch (err) {
    console.error("❌ File download error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// 🗑️ Delete message
exports.deleteMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const msgId = req.params.id;

    // Find message to ensure it belongs to the current user
    const msg = await Message.findOne({ _id: msgId, receiver: userId });

    if (!msg) {
      return res.status(404).json({ message: "Message not found or not authorized" });
    }

    // If there’s a file, remove it from disk
    if (msg.file && msg.file.path) {
      const filePath = path.resolve(msg.file.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`🗑️ File deleted: ${filePath}`);
      }
    }

    // Delete message document
    await Message.findByIdAndDelete(msgId);

    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error("Delete message error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
