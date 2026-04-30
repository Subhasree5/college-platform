"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// ✅ YOUR DEPLOYED BACKEND
const API = "https://college-platform-938p.onrender.com";

const colleges = [
{ name: "IIT Madras", location: "Chennai", fees: 200000, rating: 4.8 },
{ name: "IIT Bombay", location: "Mumbai", fees: 220000, rating: 4.9 },
{ name: "IIT Delhi", location: "Delhi", fees: 210000, rating: 4.7 },
{ name: "IIT Kanpur", location: "Kanpur", fees: 205000, rating: 4.7 },
{ name: "IIT Roorkee", location: "Roorkee", fees: 198000, rating: 4.5 },
{ name: "NIT Trichy", location: "Trichy", fees: 150000, rating: 4.4 },
];

export default function Dashboard() {
const router = useRouter();

const [search, setSearch] = useState("");
const [location, setLocation] = useState("");
const [maxFees, setMaxFees] = useState("");
const [savedNames, setSavedNames] = useState<string[]>([]);
const [savedData, setSavedData] = useState<any[]>([]);
const [selected, setSelected] = useState<any[]>([]);
const [showSaved, setShowSaved] = useState(false);

// ================= LOAD SAVED =================
const loadSaved = async () => {
try {
const token = localStorage.getItem("token");

  if (!token) {
    router.push("/login");
    return;
  }

  const res = await fetch(`${API}/saved`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Error loading saved");
    return;
  }

  setSavedData(data);
  setSavedNames(data.map((c: any) => c.name));
} catch (err) {
  console.error(err);
  alert("Server error");
}

};

useEffect(() => {
loadSaved();
}, []);

// ================= FILTER =================
const filtered = colleges.filter((c) => {
return (
c.name.toLowerCase().includes(search.toLowerCase()) &&
(location ? c.location === location : true) &&
(maxFees ? c.fees <= Number(maxFees) : true)
);
});

// ================= SAVE =================
const handleSave = async (college: any) => {
try {
const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login");
    router.push("/login");
    return;
  }

  const res = await fetch(`${API}/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, college }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Save failed");
    return;
  }

  loadSaved();
} catch (err) {
  console.error(err);
  alert("Server error");
}

};

// ================= REMOVE =================
const handleRemove = async (name: string) => {
try {
const token = localStorage.getItem("token");

  const res = await fetch(`${API}/remove`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, name }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Remove failed");
    return;
  }

  loadSaved();
} catch (err) {
  console.error(err);
  alert("Server error");
}

};

// ================= COMPARE =================
const handleCompare = (college: any) => {
const exists = selected.find((c) => c.name === college.name);

if (exists) {
  setSelected(selected.filter((c) => c.name !== college.name));
} else {
  if (selected.length >= 3) return alert("Max 3 colleges");
  setSelected([...selected, college]);
}

};

// ================= LOGOUT =================
const logout = () => {
localStorage.removeItem("token");
router.push("/login");
};

return (
<div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-6">

  {/* HEADER */}
  <div className="flex justify-between mb-6">
    <h1 className="text-3xl font-bold text-gray-800">
      🎓 College Dashboard
    </h1>

    <div className="flex gap-3">
      <button
        onClick={() => setShowSaved(!showSaved)}
        className="bg-black text-white px-4 py-2 rounded-lg"
      >
        {showSaved ? "All Colleges" : "Saved"}
      </button>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg"
      >
        Logout
      </button>
    </div>
  </div>

  {/* SEARCH */}
  <input
    placeholder="🔍 Search college..."
    className="border p-3 rounded-xl w-full mb-4 shadow-sm"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  {/* FILTER */}
  <div className="flex gap-3 mb-6">
    <select
      onChange={(e) => setLocation(e.target.value)}
      className="border p-3 rounded-xl shadow-sm"
    >
      <option value="">All Locations</option>
      <option>Chennai</option>
      <option>Mumbai</option>
      <option>Delhi</option>
      <option>Kanpur</option>
      <option>Roorkee</option>
      <option>Trichy</option>
    </select>

    <input
      type="number"
      placeholder="Max Fees"
      className="border p-3 rounded-xl shadow-sm"
      onChange={(e) => setMaxFees(e.target.value)}
    />
  </div>

  {/* SAVED VIEW */}
  {showSaved ? (
    <div className="grid md:grid-cols-3 gap-6">
      {savedData.map((c, i) => (
        <div
          key={i}
          className="bg-white/70 backdrop-blur-md p-5 rounded-2xl shadow-md"
        >
          <h2 className="text-lg font-semibold">{c.name}</h2>
          <p>{c.location}</p>
          <p className="text-red-500">₹{c.fees}</p>
          <p className="text-yellow-500">⭐ {c.rating}</p>

          <button
            onClick={() => handleRemove(c.name)}
            className="mt-3 w-full bg-red-500 text-white py-2 rounded-xl"
          >
            Remove ❌
          </button>
        </div>
      ))}
    </div>
  ) : (
    <>
      {/* COLLEGES */}
      <div className="grid md:grid-cols-3 gap-6">
        {filtered.map((c, i) => (
          <div
            key={i}
            className="bg-white/70 backdrop-blur-md p-5 rounded-2xl shadow-md hover:shadow-xl transition"
          >
            <div
              onClick={() =>
                router.push(`/college/${encodeURIComponent(c.name)}`)
              }
              className="cursor-pointer"
            >
              <h2 className="text-lg font-semibold">{c.name}</h2>
              <p>{c.location}</p>

              <div className="flex justify-between mt-2">
                <p className="text-red-500">₹{c.fees}</p>
                <p className="text-yellow-500">⭐ {c.rating}</p>
              </div>
            </div>

            <button
              onClick={() => handleSave(c)}
              disabled={savedNames.includes(c.name)}
              className={`mt-4 w-full py-2 rounded-xl text-white ${
                savedNames.includes(c.name)
                  ? "bg-gray-400"
                  : "bg-gradient-to-r from-blue-500 to-indigo-500"
              }`}
            >
              {savedNames.includes(c.name) ? "Saved ❤️" : "Save"}
            </button>

            <button
              onClick={() => handleCompare(c)}
              className={`mt-2 w-full py-2 rounded-xl text-white ${
                selected.find((s) => s.name === c.name)
                  ? "bg-orange-500"
                  : "bg-green-500"
              }`}
            >
              {selected.find((s) => s.name === c.name)
                ? "Remove from Compare"
                : "Compare"}
            </button>
          </div>
        ))}
      </div>

      {/* COMPARISON */}
      {selected.length > 1 && (
        <div className="mt-8 bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">⚖️ Comparison</h2>

          <table className="w-full text-center">
            <thead>
              <tr className="border-b">
                <th>Name</th>
                <th>Location</th>
                <th>Fees</th>
                <th>Rating</th>
              </tr>
            </thead>

            <tbody>
              {selected.map((c, i) => (
                <tr key={i} className="border-b">
                  <td>{c.name}</td>
                  <td>{c.location}</td>
                  <td className="text-red-500">₹{c.fees}</td>
                  <td className="text-yellow-500">{c.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )}
</div>

);
}