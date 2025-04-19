import { SidebarLayout } from "@/components/sidebar";
import { cn } from "@/lib/utils";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={cn(
        "h-screen rounded-md flex flex-col md:flex-row  w-full flex-1 max-w-full mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
      )}
    >

      <SidebarLayout />
      {children}
    </div>
  );
}

