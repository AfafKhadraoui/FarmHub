"use client";

import Link from "next/link";
import { Tractor } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function NotFound() {
  const { user, isAuthenticated } = useAuth();

  // Determine redirection path
  let destination = "/login";
  if (isAuthenticated && user) {
    if (user.role === "platform_admin") {
      destination = "/admin/dashboard";
    } else {
      destination = "/dashboard";
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa] p-4 text-center">
      <div className="bg-green-100 p-6 rounded-full mb-6">
        <Tractor className="w-16 h-16 text-[#5cb85c]" />
      </div>
      
      <h1 className="text-6xl font-bold text-[#333333] mb-2 font-manrope">404</h1>
      <h2 className="text-2xl font-semibold text-[#333333] mb-4 font-manrope">
        Page Not Found
      </h2>
      
      <p className="text-[#666666] max-w-md mb-8 font-inter">
        Oops! It looks like you've wandered into an unplanted field. 
        The page you are looking for doesn't exist or has been moved.
      </p>

      <Link 
        href={destination}
        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-[#5cb85c] hover:bg-[#4ca74c] transition-colors duration-200 shadow-sm"
      >
        {isAuthenticated ? "Return to Dashboard" : "Return to Login"}
      </Link>
    </div>
  );
}
