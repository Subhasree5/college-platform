"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import CollegeCard from "@/components/college/CollegeCard";
import { API_URL } from "@/lib/api";

const colleges = [
  { name: "IIT Madras", location: "Chennai", fees: 200000, rating: 4.8 },
  { name: "IIT Bombay", location: "Mumbai", fees: 220000, rating: 4.9 },
  { name: "IIT Delhi", location: "Delhi", fees: 210000, rating: 4.7 },
  { name: "NIT Trichy", location: "Trichy", fees: 150000, rating: 4.5 },
  { name: "BITS Pilani", location: "Pilani", fees: 300000, rating: 4.6 },
];

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [maxFees, setMaxFees] = useState("");
  const [selected, setSelected] = useState<any[]>([]);

  // 🔍 FILTER LOGIC
  const filtered = colleges.filter((c) => {
    return (
      c.name.toLowerCase().includes(search.toLowerCase()) &&
      (locationFilter ? c.location === locationFilter : true) &&
      (maxFees ? c.fees <= Number(maxFees) : true)
    );
  });

  // ⚖️ SELECT / REMOVE
  const handleSelect = (college: any) => {
    const exists = selected.find((c) => c.name === college.name);

    if (exists) {
      setSelected(selected.filter((c) => c.name !== college.name));
    } else {
      if (selected.length >= 3) {
        alert("You can compare up to 3 colleges only");
        return;
      }
      setSelected([...selected, college]);
    }
  };

  // ❤️ SAVE (CONNECTED TO BACKEND)
  const handleSave = async (college: any) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, college }),
      });

      const data = await res.json();
      alert(data.message || "Saved!");
    } catch (err) {
      alert("Error saving college");
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen p-6 bg-gradient-to-r from-orange-100 via-pink-100 to-yellow-100">

        {/* 🔍 SEARCH */}
        <input
          type="text"
          placeholder="Search colleges..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg border"
        />

        {/* 🎛 FILTERS */}
        <div className="flex gap-4 mb-6">
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="p-2 rounded border"
          >
            <option value="">All Locations</option>
            <option>Chennai</option>
            <option>Mumbai</option>
            <option>Delhi</option>
            <option>Trichy</option>
            <option>Pilani</option>
          </select>

          <input
            type="number"
            placeholder="Max Fees"
            value={maxFees}
            onChange={(e) => setMaxFees(e.target.value)}
            className="p-2 rounded border"
          />
        </div>

        {/* ⚖️ COMPARISON TABLE */}
        {selected.length > 0 && (
          <div className="mb-6 overflow-auto">
            <table className="w-full bg-white rounded shadow">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">Name</th>
                  <th className="p-2">Location</th>
                  <th className="p-2">Fees</th>
                  <th className="p-2">Rating</th>
                </tr>
              </thead>
              <tbody>
                {selected.map((c, i) => (
                  <tr key={i} className="text-center border-t">
                    <td className="p-2">{c.name}</td>
                    <td className="p-2">{c.location}</td>
                    <td className="p-2">₹{c.fees}</td>
                    <td className="p-2">⭐ {c.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 🏫 COLLEGE CARDS */}
        <div className="grid md:grid-cols-3 gap-6">
          {filtered.map((c, i) => (
            <CollegeCard
              key={i}
              name={c.name}
              location={c.location}
              fees={c.fees}
              rating={c.rating}
              isSelected={selected.some((s) => s.name === c.name)}
              onSelect={() => handleSelect(c)}
              onSave={() => handleSave(c)}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}