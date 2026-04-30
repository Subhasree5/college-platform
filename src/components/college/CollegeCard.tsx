"use client";

import { useRouter } from "next/navigation";

type Props = {
  name: string;
  location: string;
  fees: string;
  rating: number;
  onSelect?: () => void;
  onSave?: () => void;
  isSelected?: boolean;
};

export default function CollegeCard({
  name,
  location,
  fees,
  rating,
  onSelect,
  onSave,
  isSelected,
}: Props) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/college/${encodeURIComponent(name)}`)}
      className="cursor-pointer bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-md border hover:shadow-xl transition duration-300"
    >
      {/* Name */}
      <h3 className="text-lg font-semibold text-gray-800">{name}</h3>

      {/* Location */}
      <p className="text-sm text-gray-500 mt-1">{location}</p>

      {/* Fees + Rating */}
      <div className="flex justify-between items-center mt-5">
        <span className="text-orange-500 font-semibold text-lg">
          {fees}
        </span>

        <span className="text-yellow-500 font-semibold">
          ⭐ {rating}
        </span>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={(e) => {
            e.stopPropagation(); // 🚀 prevents navigation
            onSelect?.();
          }}
          className={`w-1/2 py-2 rounded-lg text-white font-medium ${
            isSelected
              ? "bg-red-400 hover:bg-red-500"
              : "bg-gradient-to-r from-orange-400 to-pink-400 hover:opacity-90"
          }`}
        >
          {isSelected ? "Remove" : "Select"}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation(); // 🚀 prevents navigation
            onSave?.();
          }}
          className="w-1/2 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
        >
          ❤️ Save
        </button>
      </div>
    </div>
  );
}