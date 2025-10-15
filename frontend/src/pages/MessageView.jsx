import React, { useEffect, useState } from "react";
import { aesDecryptBase64WithKeyHex } from "../utils/cryptoClient";
import JSEncrypt from "jsencrypt";

export default function MessageView({ msg, onClose }) {
  const [plaintext, setPlaintext] = useState("Decrypting...");

  useEffect(() => {
    async function decrypt() {
      try {
        // 🔑 Get private key from localStorage
        const privateKey = localStorage.getItem("privateKey");
        if (!privateKey) {
          setPlaintext("Private key not found. Please log in again.");
          return;
        }

        // 🧩 RSA decrypt AES key
        const jse = new JSEncrypt();
        jse.setPrivateKey(privateKey);
        const aesKeyHex = jse.decrypt(msg.encryptedAESKey);
        if (!aesKeyHex) throw new Error("Failed to decrypt AES key");

        // 🔓 AES decrypt message
        const payloadObj = JSON.parse(msg.payload);
        const plain = await aesDecryptBase64WithKeyHex(payloadObj, aesKeyHex);
        setPlaintext(plain);
      } catch (e) {
        console.error("Decryption error:", e);
        setPlaintext("Error decrypting message.");
      }
    }
    decrypt();
  }, [msg]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-500 font-bold"
        >
          X
        </button>

        <h3 className="text-xl font-bold mb-4">
          Message from {msg.sender?.email || "Unknown Sender"}
        </h3>

        <div className="bg-gray-100 p-4 rounded max-h-80 overflow-auto">
          <p className="mb-2 whitespace-pre-wrap">{plaintext}</p>

          {msg.file && msg.file.originalname && (
            <div className="mt-4 border-t pt-2">
              <p className="font-semibold text-sm mb-1">Attached File:</p>
              <a
                href={`/api/message/download/${msg._id}`}
                download={msg.file.originalname}
                className="text-blue-600 underline hover:text-blue-800"
              >
                ⬇️ Download: {msg.file.originalname} (
                {Math.round(msg.file.size / 1024)} KB)
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
