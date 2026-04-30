"use client";

import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSignup = async () => {
    // ✅ validation
    if (!email || !password || !confirm) {
      alert("All fields required");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      // ✅ ALWAYS CALL BACKEND DIRECTLY
      const res = await fetch(
        "https://college-platform-938p.onrender.com/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      // 👇 DEBUG SAFE PARSE
      const text = await res.text();
      console.log("RESPONSE:", text);

      const data = JSON.parse(text);

      alert(data.message);

      if (data.message === "Signup successful") {
        window.location.href = "/login";
      }

    } catch (err) {
      console.error(err);
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-100 via-pink-100 to-yellow-100">
      <div className="bg-white p-6 rounded-xl shadow w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Create Account
        </h2>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <div className="relative mb-3">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-2 cursor-pointer"
          >
            {showPass ? "🙈" : "👁️"}
          </span>
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="relative mb-3">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full p-2 border rounded"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <span
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-2 cursor-pointer"
          >
            {showConfirm ? "🙈" : "👁️"}
          </span>
        </div>

        {/* BUTTON */}
        <button
          type="button"
          onClick={handleSignup}
          className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white py-2 rounded"
        >
          Signup
        </button>

        {/* SWITCH */}
        <p className="text-sm text-center mt-3">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}