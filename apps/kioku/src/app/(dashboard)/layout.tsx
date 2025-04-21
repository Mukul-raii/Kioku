import { SidebarLayout } from "@/components/sidebar";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Main container with navbar space allowance (pt-16 for navbar height)
    <div
      className={cn(
        "min-h-screen w-full flex flex-col pt-16" // Added pt-16 to account for fixed navbar height
      )}
    >
      {/* Dashboard content container */}
      <div
        className={cn(
          "flex flex-1 flex-col md:flex-row w-full max-w-full mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden"
        )}
      >
        {/* Sidebar and content area with proper z-index */}
        <div className="relative z-10 w-full h-full flex flex-row">
          <SidebarLayout />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}