import "@/styles/globals.css";
import { ReactNode } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
