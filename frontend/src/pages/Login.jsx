import React, { useState } from "react";
import { api, setAuthToken } from "../api/api";
import { useNavigate } from "react-router-dom";
import crypto from "crypto-js";
import { Buffer } from "buffer";


window.Buffer = Buffer;


export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      const { token, user } = res.data;

      // Store token and user
      setAuthToken(token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ Step 1: Decrypt private key from user.rsaPrivateKeyEncrypted
      if (user.rsaPrivateKeyEncrypted) {
        const { data, salt } = JSON.parse(user.rsaPrivateKeyEncrypted);

        // Derive AES key from password and salt
        const derivedKey = crypto.PBKDF2(form.password, salt, {
          keySize: 256 / 32,
          iterations: 1000,
        }).toString();

        // In your current backend, the private key is only Base64-encoded (not AES-encrypted)
        // So we can directly decode it for now.
let decryptedPrivateKey = atob(data);                  // decode Base64
decryptedPrivateKey = decryptedPrivateKey.replace(/\\n/g, "\n").trim();

       decryptedPrivateKey = decryptedPrivateKey.replace(/\\n/g, "\n");
        // ✅ Step 2: Save keys to localStorage
        localStorage.setItem("privateKey", decryptedPrivateKey);
        localStorage.setItem("publicKey", user.rsaPublicKey);
      }

      onLogin(user);
      navigate("/inbox");
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || "Login failed.");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={submit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="w-full p-2 border rounded"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          type="submit"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-red-600 text-center">{err}</p>
    </div>
  );
}
