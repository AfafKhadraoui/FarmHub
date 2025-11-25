"use client";

import Sidebar from "@/components/admin/dashboard/Sidebar";
import TopBar from "@/components/admin/dashboard/TopBar";
import MyProfilePage from "@/components/admin/dashboard/MyProfilePage";
import { useRouter } from "next/navigation";

export default function ProfileRoute() {
  const router = useRouter();

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div className="min-h-screen bg-[var(--admin-bg)]">
        <Sidebar
          activePage="profile"
          onPageChange={(page) =>
            router.push(`/admin/dashboard/${page === "overview" ? "" : page}`)
          }
        />
        <div className="ml-[280px]">
          <TopBar
            pageTitle="My Profile"
            onNavigate={(page) =>
              router.push(`/admin/dashboard/${page === "overview" ? "" : page}`)
            }
          />
          <div className="pt-[112px] p-8">
            <MyProfilePage />
          </div>
        </div>
      </div>
    </>
  );
}
