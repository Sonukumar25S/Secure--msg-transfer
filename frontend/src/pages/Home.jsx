import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Lock, FileText, Mail } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center text-center p-6">
      {/* 🌟 Hero Section */}
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          🔐 Secure Message & File Transfer
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          End-to-end encrypted communication that keeps your data private, safe,
          and only in the right hands.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow hover:bg-blue-700 transition"
          >
            Login
          </Link>
         
        </div>
      </div>

      {/* 💡 Interesting Facts Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 max-w-5xl">
        <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition">
          <ShieldCheck className="mx-auto text-blue-600 w-10 h-10 mb-3" />
          <h3 className="font-semibold text-lg text-gray-800 mb-2">
            End-to-End Encryption
          </h3>
          <p className="text-gray-600 text-sm">
            Every message is encrypted on your device before it’s sent. Only the
            receiver can decrypt it — not even the server can read your data.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition">
          <Lock className="mx-auto text-blue-600 w-10 h-10 mb-3" />
          <h3 className="font-semibold text-lg text-gray-800 mb-2">
            AES + RSA Security
          </h3>
          <p className="text-gray-600 text-sm">
            Messages and files are protected using a hybrid encryption model:
            AES for speed and RSA for key safety.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition">
          <Mail className="mx-auto text-blue-600 w-10 h-10 mb-3" />
          <h3 className="font-semibold text-lg text-gray-800 mb-2">
            Zero Data Leakage
          </h3>
          <p className="text-gray-600 text-sm">
            We never store your private keys or plaintext messages. Your
            communication stays 100% private and local to you.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition">
          <FileText className="mx-auto text-blue-600 w-10 h-10 mb-3" />
          <h3 className="font-semibold text-lg text-gray-800 mb-2">
            Secure File Transfer
          </h3>
          <p className="text-gray-600 text-sm">
            Share files of any format with the same encryption as your messages.
            Every byte is securely protected.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition">
          <ShieldCheck className="mx-auto text-blue-600 w-10 h-10 mb-3" />
          <h3 className="font-semibold text-lg text-gray-800 mb-2">
            Real-Time Privacy
          </h3>
          <p className="text-gray-600 text-sm">
            Once you delete a message, it’s gone forever — even from the
            database. Control your communication completely.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition">
          <Lock className="mx-auto text-blue-600 w-10 h-10 mb-3" />
          <h3 className="font-semibold text-lg text-gray-800 mb-2">
            Built for Security Enthusiasts
          </h3>
          <p className="text-gray-600 text-sm">
            Inspired by top secure messaging systems — designed for students,
            developers, and professionals who care about data integrity.
          </p>
        </div>
      </div>

      {/* 🌐 Footer */}
      <footer className="mt-12 text-gray-500 text-sm">
        © {new Date().getFullYear()} Secure Transfer | Built with ❤️ and Encryption
      </footer>
    </div>
  );
}
