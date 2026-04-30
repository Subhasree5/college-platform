"use client";

import { useEffect, useState } from "react";

export default function SavedPage() {
  const [saved, setSaved] = useState<any[]>([]);

  useEffect(() => {
    const fetchSaved = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      try {
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
        console.log("Saved Data:", data);

        setSaved(data);

      } catch (err) {
        console.error(err);
        alert("Error loading saved colleges");
      }
    };

    fetchSaved();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Saved Colleges</h1>

      {saved.length === 0 ? (
        <p>No saved colleges</p>
      ) : (
        saved.map((c, i) => (
          <div key={i} className="border p-4 mb-3 rounded">
            <h2 className="font-semibold">{c.name}</h2>
            <p>{c.location}</p>
            <p>₹{c.fees}</p>
            <p>⭐ {c.rating}</p>
          </div>
        ))
      )}
    </div>
  );
}