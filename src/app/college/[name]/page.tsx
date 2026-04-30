"use client";

import { useParams } from "next/navigation";

const colleges: any = {
"IIT Madras": {
location: "Chennai",
fees: 200000,
rating: 4.8,
courses: ["CSE", "Mechanical", "Civil"],
placements: "95% placement",
reviews: ["Top IIT", "Excellent faculty"],
},
"IIT Bombay": {
location: "Mumbai",
fees: 220000,
rating: 4.9,
courses: ["CSE", "Aerospace", "Electrical"],
placements: "98% placement",
reviews: ["Best IIT", "Great campus life"],
},
"IIT Delhi": {
location: "Delhi",
fees: 210000,
rating: 4.7,
courses: ["CSE", "Mechanical", "Chemical"],
placements: "96% placement",
reviews: ["Strong placements", "Top recruiters"],
},
"IIT Kanpur": {
location: "Kanpur",
fees: 205000,
rating: 4.7,
courses: ["CSE", "Electrical", "AI"],
placements: "94% placement",
reviews: ["Good research", "Nice campus"],
},
"IIT Roorkee": {
location: "Roorkee",
fees: 198000,
rating: 4.5,
courses: ["Civil", "Mechanical", "CSE"],
placements: "93% placement",
reviews: ["Oldest IIT", "Great alumni"],
},
"NIT Trichy": {
location: "Trichy",
fees: 150000,
rating: 4.4,
courses: ["CSE", "ECE", "EEE"],
placements: "90% placement",
reviews: ["Top NIT", "Affordable"],
},
};

export default function CollegeDetail() {
const params = useParams();
const name = decodeURIComponent(params.name as string);

const college = colleges[name];

if (!college) {
return (
<div className="p-10 text-center text-red-500">
College not found
</div>
);
}

return (
<div className="min-h-screen p-6 bg-gradient-to-br from-indigo-50 to-white">

  {/* HEADER */}
  <h1 className="text-3xl font-bold mb-4">{name}</h1>
  <p className="text-gray-600">{college.location}</p>

  {/* OVERVIEW */}
  <div className="grid md:grid-cols-3 gap-6 mt-6">

    <div className="bg-white p-5 rounded-2xl shadow">
      <h2 className="font-bold mb-2">💰 Fees</h2>
      <p>₹{college.fees}</p>
    </div>

    <div className="bg-white p-5 rounded-2xl shadow">
      <h2 className="font-bold mb-2">⭐ Rating</h2>
      <p>{college.rating}</p>
    </div>

    <div className="bg-white p-5 rounded-2xl shadow">
      <h2 className="font-bold mb-2">📍 Location</h2>
      <p>{college.location}</p>
    </div>

  </div>

  {/* DETAILS */}
  <div className="grid md:grid-cols-3 gap-6 mt-8">

    {/* COURSES */}
    <div className="bg-white p-5 rounded-2xl shadow">
      <h2 className="font-bold mb-3">📚 Courses</h2>
      {college.courses.map((c: string, i: number) => (
        <p key={i}>• {c}</p>
      ))}
    </div>

    {/* PLACEMENTS */}
    <div className="bg-white p-5 rounded-2xl shadow">
      <h2 className="font-bold mb-3">💼 Placements</h2>
      <p>{college.placements}</p>
    </div>

    {/* REVIEWS */}
    <div className="bg-white p-5 rounded-2xl shadow">
      <h2 className="font-bold mb-3">⭐ Reviews</h2>
      {college.reviews.map((r: string, i: number) => (
        <p key={i}>• {r}</p>
      ))}
    </div>

  </div>

  {/* BACK BUTTON */}
  <div className="mt-10">
    <button
      onClick={() => window.history.back()}
      className="bg-blue-500 text-white px-5 py-2 rounded-lg"
    >
      ← Back
    </button>
  </div>

</div>

);
}