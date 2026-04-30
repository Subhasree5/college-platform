"use client";

import { useRouter } from "next/navigation";

export default function Welcome() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-orange-100 via-pink-100 to-yellow-100">
      
      {/* LEFT SIDE */}
      <div className="w-1/2 flex flex-col justify-center px-16">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
          CollegeHub 🎓
        </h1>

        <p className="text-gray-600 mb-8 text-lg">
          Discover, compare, and choose the best college for your future.
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-orange-400 to-pink-400 text-white"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/signup")}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-orange-400 to-pink-400 text-white"
          >
            Signup
          </button>
        </div>
      </div>

      {/* RIGHT IMAGE FULL */}
      <div className="w-1/2 h-screen">
        <img
          src="/college.png"
          alt="college"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}