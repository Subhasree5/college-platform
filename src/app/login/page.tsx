"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API = "https://college-platform-938p.onrender.com";

export default function Login() {
const router = useRouter();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const handleLogin = async () => {
try {
const res = await fetch("${API}/login", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({ email, password }),
});

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Login failed");
    return;
  }

  localStorage.setItem("token", data.token);

  alert("Login successful 🎉");

  router.push("/dashboard");
} catch (err) {
  console.error(err);
  alert("Server error");
}

};

return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white">

  <div className="bg-white p-8 rounded-2xl shadow-xl w-[350px]">

    <h2 className="text-2xl font-bold mb-6 text-center">
      🔐 Login
    </h2>

    <input
      type="email"
      placeholder="Email"
      className="w-full border p-3 rounded-xl mb-4"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

    <input
      type="password"
      placeholder="Password"
      className="w-full border p-3 rounded-xl mb-4"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    <button
      onClick={handleLogin}
      className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 rounded-xl"
    >
      Login
    </button>

    <p className="mt-4 text-sm text-center">
      Don't have an account?{" "}
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