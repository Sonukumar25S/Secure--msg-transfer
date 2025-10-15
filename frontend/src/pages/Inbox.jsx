import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import  { JSEncrypt }from  "jsencrypt";
import { aesDecryptBase64WithKeyHex } from "../utils/cryptoClient";

export default function Inbox({ user }) {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      setLoading(true);
      const res = await api.get("/message/inbox");
      setMessages(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load inbox.");
    } finally {
      setLoading(false);
    }
  }

  async function handleView(msg) {
    try {
      
      const privateKey = localStorage.getItem("privateKey")?.trim();
if (!privateKey) throw new Error("Private key missing");

const encryptedAESKey = msg.encryptedAESKey?.trim();
if (!encryptedAESKey) throw new Error("No AES key");

const jse = new JSEncrypt();
jse.setPrivateKey(privateKey);

const aesKeyHex = jse.decrypt(encryptedAESKey);
if (!aesKeyHex) {
    console.error("Private key:", privateKey);
    console.error("Encrypted AES key:", encryptedAESKey);
    throw new Error("AES key decryption failed");
}


    
      const payloadObj = JSON.parse(msg.payload);
      const decryptedText = await aesDecryptBase64WithKeyHex(payloadObj, aesKeyHex);

      alert(`📨 Message:\n${decryptedText}`);
    } catch (err) {
      console.error("Error decrypting:", err);
      alert("❌ Failed to decrypt message. Check console.");
    }
  }

  async function handleDownload(msg) {
    try {
      if (!msg.file?.originalname) {
        alert("No file attached to this message.");
        return;
      }

      const res = await api.get(`/message/download/${msg._id}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", msg.file.originalname);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("File download error:", err);
      alert("Failed to download file. Check console.");
    }
  }

  async function handleDelete(msgId) {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      await api.delete(`/message/delete/${msgId}`);
      setMessages(prev => prev.filter(m => m._id !== msgId));
      alert("Message deleted successfully.");
    } catch (err) {
      console.error("Delete message error:", err);
      alert("Failed to delete message. Check console.");
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">📥 Inbox</h2>
      {error && <p className="text-red-600">{error}</p>}
      {loading && <p>Loading messages...</p>}
      {messages.length === 0 ? (
        <p className="text-gray-500">No messages found.</p>
      ) : (
        messages.map(msg => (
          <div key={msg._id} className="border-b border-gray-300 py-3 flex flex-col gap-2">
            <p><strong>From:</strong> {msg.sender?.email}</p>

            <button
              onClick={() => handleView(msg)}
              className="bg-blue-500 text-white px-3 py-1 rounded w-fit hover:bg-blue-600"
            >
              📩 View Message
            </button>

            {msg.file?.originalname && (
              <button
                onClick={() => handleDownload(msg)}
                className="bg-green-500 text-white px-3 py-1 rounded w-fit hover:bg-green-600"
              >
                ⬇️ Download {msg.file.originalname}
              </button>
            )}

            <button
              onClick={() => handleDelete(msg._id)}
              className="bg-red-500 text-white px-3 py-1 rounded w-fit hover:bg-red-600"
            >
              🗑️ Delete Message
            </button>
          </div>
        ))
      )}
    </div>
  );
}
