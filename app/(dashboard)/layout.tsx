import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
