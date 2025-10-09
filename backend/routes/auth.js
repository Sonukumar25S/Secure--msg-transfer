const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// ✅ Auth Routes
router.post("/signup", authController.signup);
router.get("/verify", authController.verify);
router.post("/login", authController.login);
router.get("/public-key", authController.getPublicKey); // ✅ Fix: properly imported

module.exports = router;
