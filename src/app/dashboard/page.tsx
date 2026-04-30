"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";

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

// LOAD SAVED
const loadSaved = async () => {
const token = localStorage.getItem("token");
if (!token) return;

const res = await apiPost("/saved", { token });

if (!res.ok) return;

setSavedData(res.data);
setSavedNames(res.data.map((c: any) => c.name));

};

useEffect(() => {
loadSaved();
}, []);

// SAVE
const handleSave = async (college: any) => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Login again");
    return;
  }

  const res = await apiPost("/save", {
    token,
    college: {
      name: college.name,
      location: college.location,
      fees: college.fees,
      rating: college.rating,
    },
  });

  console.log("SAVE RESPONSE:", res); // 👈 DEBUG

  if (!res.ok) {
    alert(res.data.message || "Save failed");
    return;
  }

  loadSaved();
};

// REMOVE
const handleRemove = async (name: string) => {
const token = localStorage.getItem("token");

const res = await apiPost("/remove", { token, name });

if (!res.ok) {
  alert(res.data?.message || "Remove error");
  return;
}

loadSaved();

};

// COMPARE
const handleCompare = (college: any) => {
const exists = selected.find((c) => c.name === college.name);

if (exists) {
  setSelected(selected.filter((c) => c.name !== college.name));
} else {
  if (selected.length >= 3) return alert("Max 3 colleges");
  setSelected([...selected, college]);
}

};

// LOGOUT
const logout = () => {
localStorage.removeItem("token");
router.push("/login");
};

// FILTER
const filtered = colleges.filter((c) =>
c.name.toLowerCase().includes(search.toLowerCase()) &&
(location ? c.location === location : true) &&
(maxFees ? c.fees <= Number(maxFees) : true)
);

return (
<div className="p-6 bg-gradient-to-br from-indigo-50 to-white min-h-screen">

  {/* HEADER */}
  <div className="flex justify-between mb-6">
    <h1 className="text-3xl font-bold">🎓 Dashboard</h1>

    <div className="flex gap-3">
      <button
        onClick={() => setShowSaved(!showSaved)}
        className="bg-black text-white px-4 py-2 rounded-xl"
      >
        {showSaved ? "All" : "Saved"}
      </button>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded-xl"
      >
        Logout
      </button>
    </div>
  </div>

  {/* SEARCH */}
  <input
    placeholder="Search college..."
    className="border p-3 w-full mb-4 rounded-xl"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  {/* FILTER */}
  <div className="flex gap-3 mb-6">
    <select
      value={location}
      onChange={(e) => setLocation(e.target.value)}
      className="border p-3 rounded-xl"
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
      className="border p-3 rounded-xl"
      value={maxFees}
      onChange={(e) => setMaxFees(e.target.value)}
    />
  </div>

  {/* CARDS */}
  <div className="grid md:grid-cols-3 gap-6">
    {(showSaved ? savedData : filtered).map((c: any, i) => (
      <div
        key={i}
        onClick={() =>
          router.push(`/college/${encodeURIComponent(c.name)}`)
        }
        className="bg-white p-5 rounded-2xl shadow-md cursor-pointer hover:shadow-lg"
      >
        <h2 className="font-bold">{c.name}</h2>
        <p>{c.location}</p>
        <p>₹{c.fees}</p>
        <p>⭐ {c.rating}</p>

        {!showSaved && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSave(c);
              }}
              className="bg-blue-500 text-white w-full mt-2 py-2 rounded-xl"
            >
              {savedNames.includes(c.name) ? "Saved ❤️" : "Save"}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCompare(c);
              }}
              className="bg-green-500 text-white w-full mt-2 py-2 rounded-xl"
            >
              {selected.find((s) => s.name === c.name)
                ? "Remove Compare"
                : "Compare"}
            </button>
          </>
        )}

        {showSaved && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRemove(c.name);
            }}
            className="bg-red-500 text-white w-full mt-2 py-2 rounded-xl"
          >
            Remove
          </button>
        )}
      </div>
    ))}
  </div>

  {/* COMPARISON */}
  {selected.length > 1 && (
    <div className="mt-8 bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">⚖️ Comparison</h2>

      <table className="w-full text-center">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Fees</th>
            <th>Rating</th>
          </tr>
        </thead>

        <tbody>
          {selected.map((c, i) => (
            <tr key={i}>
              <td>{c.name}</td>
              <td>{c.location}</td>
              <td>₹{c.fees}</td>
              <td>{c.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>

);
}