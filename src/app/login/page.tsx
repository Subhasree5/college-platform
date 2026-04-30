"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const handleLogin = async () => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-pink-100">
      <div className="bg-white p-6 rounded-xl shadow w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-3 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD WITH EYE */}
        <div className="relative mb-4">
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 border rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            onClick={() => setShow(!show)}
            className="absolute right-3 top-3 cursor-pointer"
          >
            {show ? "🙈" : "👁️"}
          </span>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-orange-400 to-pink-400 text-white py-2 rounded-lg"
        >
          Login
        </button>

        {/* SWITCH TO SIGNUP */}
        <p className="text-center mt-4 text-sm">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-pink-500 cursor-pointer font-medium"
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}