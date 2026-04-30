"use client";

import { useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/dashboard";
      } else {
        alert(data.message);
      }
    } catch (e) {
      alert("Login failed");
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-100 via-pink-100 to-yellow-100">
      <div className="bg-white p-6 rounded-xl shadow w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative mb-3">
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            onClick={() => setShow(!show)}
            className="absolute right-3 top-2 cursor-pointer"
          >
            👁
          </span>
        </div>

        <button
          type="button"
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white py-2 rounded"
        >
          Login
        </button>

        <p className="text-sm text-center mt-3">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-500">Signup</Link>
        </p>
      </div>
    </div>
  );
}