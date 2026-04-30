"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const handleSignup = async () => {
  const res = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (data.message === "User already exists") {
    alert("User already exists ❌");
    return;
  }

  alert("Signup successful ✅");
  router.push("/login");
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-pink-100">
      <div className="bg-white p-6 rounded-xl shadow w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Create Account
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-3 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <div className="relative mb-3">
          <input
            type={show1 ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 border rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            onClick={() => setShow1(!show1)}
            className="absolute right-3 top-3 cursor-pointer"
          >
            {show1 ? "🙈" : "👁️"}
          </span>
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="relative mb-4">
          <input
            type={show2 ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full p-3 border rounded-lg"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          <span
            onClick={() => setShow2(!show2)}
            className="absolute right-3 top-3 cursor-pointer"
          >
            {show2 ? "🙈" : "👁️"}
          </span>
        </div>

        <button
          onClick={handleSignup}
          className="w-full bg-gradient-to-r from-orange-400 to-pink-400 text-white py-2 rounded-lg"
        >
          Signup
        </button>

        {/* SWITCH TO LOGIN */}
        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-pink-500 cursor-pointer font-medium"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}