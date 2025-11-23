"use client";

import Sidebar from "@/components/admin/dashboard/Sidebar";
import TopBar from "@/components/admin/dashboard/TopBar";
import HelpSupportPage from "@/components/admin/dashboard/HelpSupportPage";
import { useRouter } from "next/navigation";

export default function HelpRoute() {
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
          activePage="help"
          onPageChange={(page) =>
            router.push(`/admin/dashboard/${page === "overview" ? "" : page}`)
          }
        />
        <div className="ml-[280px]">
          <TopBar
            pageTitle="Help & Support"
            onNavigate={(page) =>
              router.push(`/admin/dashboard/${page === "overview" ? "" : page}`)
            }
          />
          <div className="pt-[112px] p-8">
            <HelpSupportPage />
          </div>
        </div>
      </div>
    </>
  );
}
