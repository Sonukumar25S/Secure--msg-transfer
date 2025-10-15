const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const cryptoUtils = require("../utils/crypto");
const { sendVerificationEmail } = require("../utils/mailer");
const User = require("../models/User");

/**
 * 🟢 SIGNUP: Register new user with RSA keypair generation and encrypted private key
 */
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required." });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists." });

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Generate RSA key pair (2048 bits)
    const { publicKey, privateKey } = cryptoUtils.generateRSAKeyPair();

    // Encrypt private key using password-derived key
    const salt = crypto.randomBytes(16).toString("hex");
    const derivedKey = crypto.scryptSync(password, salt, 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", derivedKey, iv);

    let encryptedPrivateKey = cipher.update(privateKey, "utf8", "base64");
    encryptedPrivateKey += cipher.final("base64");

    const privateKeyEncrypted = JSON.stringify({
      iv: iv.toString("hex"),
      data: encryptedPrivateKey,
      salt,
    });

    // Generate verification token
    const verificationToken = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Save user
    const user = new User({
      name,
      email,
      passwordHash,
      verificationToken,
      rsaPublicKey: publicKey,
      rsaPrivateKeyEncrypted: privateKeyEncrypted,
    });

    await user.save();

    // Optionally send email (you can disable if not configured)
    await sendVerificationEmail(email, verificationToken);

    return res.json({ message: "Signup successful! Please verify your email." });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * 🟢 VERIFY EMAIL
 */
exports.verify = async (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(400).send("Missing token");

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: payload.email });
    if (!user) return res.status(400).send("Invalid token");

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    return res.json({ message: "Email verified successfully." });
  } catch (err) {
    console.error("Verify error:", err);
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

/**
 * 🟢 LOGIN: authenticate + send encrypted private key and public key
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "No user found." });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ message: "Incorrect password." });

    if (!user.isVerified)
      return res.status(403).json({ message: "Please verify your email first." });

    // 🔓 Decrypt private key
    const { iv, data, salt } = JSON.parse(user.rsaPrivateKeyEncrypted);

    const derivedKey = crypto.scryptSync(password, salt, 32);
    const decipher = crypto.createDecipheriv("aes-256-cbc", derivedKey, Buffer.from(iv, "hex"));

    let decrypted = decipher.update(data, "base64", "utf8");
    decrypted += decipher.final("utf8");

    // 🔍 Validation check
    console.log("Private key valid start:", decrypted.startsWith("-----BEGIN"));
    console.log("Private key valid end:", decrypted.endsWith("-----END RSA PRIVATE KEY-----"));

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        rsaPublicKey: user.rsaPublicKey,
        rsaPrivateKey: decrypted, // ✅ decrypted PEM text
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * 🟢 GET PUBLIC KEY (for sending encrypted messages)
 * /api/auth/public-key?email=receiver@example.com
 */
exports.getPublicKey = async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ publicKey: user.rsaPublicKey });
  } catch (err) {
    console.error("Get public key error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
