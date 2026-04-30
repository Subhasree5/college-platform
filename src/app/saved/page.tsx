"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";

export default function SavedPage() {
  const [saved, setSaved] = useState<any[]>([]);

  const fetchSaved = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/saved", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const data = await res.json();

    if (Array.isArray(data)) {
      setSaved(data);
    } else {
      setSaved([]);
    }
  };

  const handleRemove = async (name: string) => {
    const token = localStorage.getItem("token");

    await fetch("http://localhost:5000/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, name }),
    });

    fetchSaved();
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  return (
    <MainLayout>
      <h1 className="text-2xl font-semibold mb-6">Saved Colleges ❤️</h1>

      {saved.length === 0 ? (
        <p>No saved colleges yet.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {saved.map((c, i) => (
            <div key={i} className="p-4 border rounded-lg bg-white shadow">
              <h3 className="font-semibold">{c?.name}</h3>
              <p className="text-sm text-gray-500">{c?.location}</p>
              <p className="text-orange-500 mt-2">{c?.fees}</p>
              <p>⭐ {c?.rating}</p>

              <button
                onClick={() => handleRemove(c.name)}
                className="mt-3 w-full bg-red-400 text-white py-2 rounded"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
}