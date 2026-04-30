"use client";

import { useParams } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";

const colleges = [
  { name: "IIT Madras", location: "Chennai", fees: 200000, rating: 4.8 },
  { name: "IIT Bombay", location: "Mumbai", fees: 220000, rating: 4.9 },
  { name: "IIT Delhi", location: "Delhi", fees: 210000, rating: 4.7 },
  { name: "NIT Trichy", location: "Trichy", fees: 150000, rating: 4.5 },
  { name: "BITS Pilani", location: "Pilani", fees: 300000, rating: 4.6 },
];

export default function CollegeDetail() {
  const params = useParams();
  const name = decodeURIComponent(params.name as string);

  const college = colleges.find((c) => c.name === name);

  if (!college) {
    return <div className="p-6">College not found</div>;
  }

  return (
    <MainLayout>
      <div className="min-h-screen p-6 bg-gradient-to-r from-orange-100 via-pink-100 to-yellow-100">

        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-2">{college.name}</h1>
        <p className="text-gray-600">{college.location}</p>

        <div className="mt-4 flex gap-6">
          <span className="text-orange-500 font-semibold">
            Fees: ₹{college.fees}
          </span>
          <span className="text-yellow-600 font-semibold">
            ⭐ {college.rating}
          </span>
        </div>

        {/* COURSES */}
        <div className="mt-8 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Courses Offered</h2>
          <ul className="list-disc ml-5 text-gray-700">
            <li>B.Tech</li>
            <li>M.Tech</li>
            <li>MBA</li>
          </ul>
        </div>

        {/* PLACEMENTS */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Placements</h2>
          <p>Average Package: ₹15 LPA</p>
          <p>Placement Rate: 90%</p>
        </div>

        {/* REVIEWS */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Reviews</h2>
          <p>👍 Great faculty and campus.</p>
          <p>👍 Strong placement opportunities.</p>
        </div>
      </div>
    </MainLayout>
  );
}