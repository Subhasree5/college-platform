"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSignup = async () => {
    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    const res = await apiPost("/signup", { email, password });

    if (!res.ok) {
      alert(res.data.message);
      return;
    }

    alert("Signup success 🎉");
    router.push("/login");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-80">

        <h2 className="text-2xl font-bold text-center mb-6">📝 Signup</h2>

        <input
          placeholder="Email"
          className="border p-3 w-full mb-3 rounded-xl"
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            className="border p-3 w-full mb-3 rounded-xl"
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-3 cursor-pointer"
          >
            {showPass ? "🙈" : "👁️"}
          </span>
        </div>

        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            className="border p-3 w-full mb-3 rounded-xl"
            onChange={(e) => setConfirm(e.target.value)}
          />
          <span
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-3 cursor-pointer"
          >
            {showConfirm ? "🐵" : "👀"}
          </span>
        </div>

        <button
          onClick={handleSignup}
          className="bg-green-500 text-white w-full py-2 rounded-xl"
        >
          Signup
        </button>

        <p className="text-center mt-4 text-sm">
          Already have account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}