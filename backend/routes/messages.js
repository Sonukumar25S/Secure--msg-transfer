const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const {
  sendMessage,
  getInbox,
  downloadFile,
  deleteMessage,
} = require("../controllers/messageController");
const auth = require("../middleware/auth");

// 📂 File upload storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure 'uploads' folder exists
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ROUTES

// 📤 Send encrypted message (text + optional file)
router.post("/send", auth, upload.single("file"), sendMessage);

// 📥 Get inbox messages
router.get("/inbox", auth, getInbox);

// 📄 Download attached file
router.get("/download/:id", auth, downloadFile);

// 🗑️ Delete a message (receiver only)
router.delete("/delete/:id", auth, deleteMessage);

module.exports = router;
