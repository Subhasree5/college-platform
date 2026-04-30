"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [token, setToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setMounted(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    router.push("/login");
  };

  if (!mounted) return null;

  const hideButtons =
    pathname === "/welcome" ||
    pathname === "/login" ||
    pathname === "/signup";

  return (
    <div className="w-full bg-white/70 border-b">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        
        <h1
          onClick={() => router.push("/dashboard")}
          className="text-xl font-semibold text-orange-500 cursor-pointer"
        >
          CollegeHub
        </h1>

        {!hideButtons && (
          <div className="flex gap-3">
            {token && (
              <button
                onClick={() => router.push("/saved")}
                className="px-4 py-2 bg-blue-400 text-white rounded-lg"
              >
                Saved
              </button>
            )}

            {token ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-400 text-white rounded-lg"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="px-4 py-2 bg-orange-400 text-white rounded-lg"
              >
                Login
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}