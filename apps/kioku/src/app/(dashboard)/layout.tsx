import { SidebarLayout } from "@/components/sidebar";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={cn(
        "min-h-screen w-full flex flex-col pt-16" // Added pt-16 to account for fixed navbar height
      )}
    >
      <div
        className={cn(
          "flex flex-1 flex-col md:flex-row w-full max-w-full mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden"
        )}
      >
        <div className="relative z-10 w-full h-full flex flex-row">
          <SidebarLayout />z
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
