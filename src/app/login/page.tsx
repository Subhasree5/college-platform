"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await apiPost("/login", { email, password });

    if (!res.ok) {
      alert(res.data.message || "Login failed");
      return;
    }

    localStorage.setItem("token", res.data.token);
    router.push("/dashboard"); // ✅ FIXED REDIRECT
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4 text-center">🔐 Login</h2>

        <input
          className="border p-2 w-full mb-3 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full mb-3 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="bg-blue-500 text-white w-full py-2 rounded"
        >
          Login
        </button>

        <p className="text-sm mt-3 text-center">
          Don’t have account?{" "}
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