import React, { useState } from "react";
import { api } from "../api/api";
import { aesEncryptBase64 } from "../utils/cryptoClient";
import JSEncrypt from "jsencrypt";

export default function SendMessage() {
  const [receiverEmail, setReceiverEmail] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  async function handleSend(e) {
    e.preventDefault();
    try {
      setStatus("Encrypting message...");

      // AES key (random hex)
      const aesKey = crypto.getRandomValues(new Uint8Array(16));
      const aesKeyHex = Array.from(aesKey).map(b => b.toString(16).padStart(2, "0")).join("");

      // Encrypt message text
      const encrypted = await aesEncryptBase64(message, aesKeyHex);

      // Encrypt AES key with receiver’s public RSA key
      // (for testing, fetch receiver from API or use stored one)
      const receiverRes = await api.get(`/auth/public-key?email=${receiverEmail}`);
      const jse = new JSEncrypt();
      jse.setPublicKey(receiverRes.data.publicKey);
      const encryptedAESKey = jse.encrypt(aesKeyHex);

      if (!encryptedAESKey) throw new Error("AES encryption failed");

      // ✅ Prepare FormData (text + file)
      const formData = new FormData();
      formData.append("receiverEmail", receiverEmail);
      formData.append("encryptedAESKey", encryptedAESKey);
      formData.append("payload", JSON.stringify(encrypted));
      if (file) formData.append("file", file);

      await api.post("/message/send", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setStatus("Message sent successfully!");
    } catch (err) {
      console.error("Send error:", err);
      setStatus("Failed to send message.");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Send Message</h2>
      <form onSubmit={handleSend} className="space-y-3">
        <input
          className="w-full p-2 border rounded"
          placeholder="Recipient Email"
          value={receiverEmail}
          onChange={(e) => setReceiverEmail(e.target.value)}
        />
        <textarea
          className="w-full p-2 border rounded"
          rows="4"
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <input
          type="file"
          className="w-full p-2 border rounded"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" type="submit">
          Send
        </button>
      </form>
      <p className="mt-3 text-center text-green-600">{status}</p>
    </div>
  );
}
