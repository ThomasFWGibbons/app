// FILE: src/app/(dashboard)/layout.tsx
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
