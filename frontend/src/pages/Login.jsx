import React, { useState } from "react";
import { api, setAuthToken } from "../api/api";
import { useNavigate } from "react-router-dom";
import crypto from "crypto-js";

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

      // Decrypt Base64-encoded private key
      if (user.rsaPrivateKeyEncrypted) {
        const { data } = JSON.parse(user.rsaPrivateKeyEncrypted);

        // Decode Base64 → string
        let decryptedPrivateKey = atob(data);
        decryptedPrivateKey = decryptedPrivateKey.replace(/\\n/g, "\n").trim();

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
