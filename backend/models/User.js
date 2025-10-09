const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },

  // for email verification
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String, default: null },

  // RSA keys for end-to-end encryption
  rsaPublicKey: { type: String, required: true },
  rsaPrivateKeyEncrypted: { type: String, required: true }, // stored encrypted

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
