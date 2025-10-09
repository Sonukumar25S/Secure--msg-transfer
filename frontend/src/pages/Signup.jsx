import React, { useState } from "react";
import { api } from "../api/api";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      // ✅ Generate RSA Key Pair
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
      );

      // ✅ Export keys as PEM
      const publicKeyPem = await exportKeyToPEM(keyPair.publicKey, "public");
      const privateKeyPem = await exportKeyToPEM(keyPair.privateKey, "private");

      // ✅ Save private key locally
      localStorage.setItem("privateKey", privateKeyPem);

      // ✅ Send only the public key to backend
      const res = await api.post("/auth/signup", {
        ...form,
        rsaPublicKey: publicKeyPem,
      });

      setMsg(res.data.message || "Signup successful!");
    } catch (err) {
      console.error("Signup error:", err);
      setMsg(err?.response?.data?.message || "Signup failed.");
    }
  }

  // Helper function to export CryptoKey → PEM
  async function exportKeyToPEM(key, type) {
    const exported = await window.crypto.subtle.exportKey(
      type === "public" ? "spki" : "pkcs8",
      key
    );
    const exportedAsString = String.fromCharCode(...new Uint8Array(exported));
    const exportedAsBase64 = window.btoa(exportedAsString);
    const header = type === "public" ? "PUBLIC KEY" : "PRIVATE KEY";
    return `-----BEGIN ${header}-----\n${exportedAsBase64}\n-----END ${header}-----`;
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Signup</h2>
      <form onSubmit={submit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
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
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" type="submit">
          Sign up
        </button>
      </form>
      <p className="mt-4 text-green-600 text-center">{msg}</p>
    </div>
  );
}
