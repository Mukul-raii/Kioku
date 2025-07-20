'use client';
import { useSidebar } from "@/contexts/SidebarContext";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content area with dynamic sidebar spacing */}
      <main className={`pt-16 transition-all duration-300 ${isCollapsed ? 'pl-16' : 'pl-64'}`}>
          {children}
      </main>
    </div>
  );
}
