"use client";

import { useState } from "react";

const colleges = [
  {
    name: "IIT Madras",
    location: "Chennai",
    fees: 200000,
    rating: 4.8,
  },
  {
    name: "IIT Bombay",
    location: "Mumbai",
    fees: 220000,
    rating: 4.9,
  },
  {
    name: "IIT Delhi",
    location: "Delhi",
    fees: 210000,
    rating: 4.7,
  },
];

export default function DashboardPage() {
  const [savedNames, setSavedNames] = useState<string[]>([]);

  // ✅ SAVE FUNCTION
  const handleSave = async (college: any) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      const res = await fetch(
        "https://college-platform-938p.onrender.com/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            college,
          }),
        }
      );

      const data = await res.json();
      alert(data.message);

      // ✅ update UI instantly
      if (data.message === "Saved successfully") {
        setSavedNames((prev) => [...prev, college.name]);
      }

    } catch (err) {
      console.error(err);
      alert("Error saving");
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* COLLEGE LIST */}
      <div className="grid md:grid-cols-3 gap-6">
        {colleges.map((college, i) => {
          const isSaved = savedNames.includes(college.name);

          return (
            <div
              key={i}
              className="border p-4 rounded shadow bg-white"
            >
              <h2 className="text-lg font-semibold">{college.name}</h2>
              <p className="text-gray-600">{college.location}</p>

              <p className="text-orange-500 font-bold mt-2">
                ₹{college.fees}
              </p>

              <p className="text-yellow-500 mt-1">
                ⭐ {college.rating}
              </p>

              <button
                onClick={() => handleSave(college)}
                disabled={isSaved}
                className={`mt-3 w-full py-2 rounded text-white ${
                  isSaved
                    ? "bg-gray-400"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isSaved ? "Saved ❤️" : "Save"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}