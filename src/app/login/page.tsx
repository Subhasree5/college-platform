"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API = "https://college-platform-938p.onrender.com";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // 🔥 IMPORTANT FIX (prevents JSON crash)
      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        alert("Server response invalid (check backend URL)");
        return;
      }

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // ✅ STORE TOKEN
      localStorage.setItem("token", data.token);

      // ✅ REDIRECT
      window.location.href = "/dashboard";

    } catch (err) {
      console.error(err);
      alert("Cannot connect to backend");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl w-[350px]">

        <h1 className="text-2xl font-bold text-center mb-6">
          🔐 Login
        </h1>

        <input
          type="email"
          placeholder="Enter email"
          className="border p-3 w-full mb-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter password"
          className="border p-3 w-full mb-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-xl hover:opacity-90"
        >
          Login
        </button>

        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => router.push("/signup")}
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}