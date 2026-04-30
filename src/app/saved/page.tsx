"use client";

import { useEffect, useState } from "react";

export default function SavedPage() {
const [saved, setSaved] = useState<any[]>([]);

// 🔄 FETCH SAVED
const fetchSaved = async () => {
const token = localStorage.getItem("token");

if (!token) {
  alert("Login first");
  return;
}

const res = await fetch(
  "https://college-platform-938p.onrender.com/saved",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  }
);

const data = await res.json();
setSaved(data);

};

// ❌ REMOVE
const handleRemove = async (name: string) => {
const token = localStorage.getItem("token");

const res = await fetch(
  "https://college-platform-938p.onrender.com/remove",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, name }),
  }
);

const data = await res.json();

alert(data.message);

// update UI instantly
setSaved((prev) => prev.filter((c) => c.name !== name));

};

useEffect(() => {
fetchSaved();
}, []);

return (
<div className="p-6">
<h1 className="text-xl font-bold mb-4">Saved Colleges</h1>

  {saved.length === 0 ? (
    <p>No saved colleges</p>
  ) : (
    <div className="grid md:grid-cols-3 gap-4">
      {saved.map((c, i) => (
        <div key={i} className="border p-4 rounded">
          <h2 className="font-semibold">{c.name}</h2>
          <p>{c.location}</p>
          <p>₹{c.fees}</p>
          <p>⭐ {c.rating}</p>

          <button
            onClick={() => handleRemove(c.name)}
            className="mt-2 w-full bg-red-500 text-white py-2 rounded"
          >
            Remove ❌
          </button>
        </div>
      ))}
    </div>
  )}
</div>

);
}