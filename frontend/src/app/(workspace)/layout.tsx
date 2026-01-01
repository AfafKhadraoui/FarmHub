"use client";

import { Sidebar } from "@/components/workspace/Sidebar";
import { TopBar } from "@/components/workspace/TopBar";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ProfileProvider } from "@/context/ProfileContext";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const userRole = user?.role === "admin" ? "admin" : "worker";

  return (
    <ProtectedRoute>
      <ProfileProvider>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap");

        /* Apply custom fonts and scrollbar only to workspace */
        body {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif;
          font-size: 15px;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: "Poppins", sans-serif;
        }

        /* Custom Scrollbar Styling for workspace */
        *::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        *::-webkit-scrollbar-track {
          background: transparent;
        }

        *::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }

        *::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        *::-webkit-scrollbar-thumb {
          scrollbar-width: thin;
          scrollbar-color: #d1d5db transparent;
        }

        input::placeholder {
          color: #9ca3af;
        }

        button {
          user-select: none;
        }
      `}</style>
      <div className="flex h-screen bg-white">
        {/* Sidebar - 280px width */}
        <Sidebar userRole={userRole} farmName={user?.farmName || undefined} />

        {/* Right Section - Top Bar + Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar - 72px height */}
          <TopBar userRole={userRole} />

          {/* Main Content Area */}
          <div className="flex-1 bg-white overflow-y-auto p-8">{children}</div>
        </div>
      </div>
      </ProfileProvider>
    </ProtectedRoute>
  );
}
