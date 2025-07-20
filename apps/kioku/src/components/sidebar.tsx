"use client";
import React from "react";
import {
  IconDashboard,
  IconFilePlus,
  IconNotebook,
  IconCalendarCheck,
  IconChartLine,
  IconChevronLeft
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/contexts/SidebarContext";

export function SidebarLayout() {
  const router = useRouter();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const links = [
    {
      label: "Dashboard",
      href: "/userdashboard",
      icon: <IconDashboard className="h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Add Notes",
      href: "/userdashboard/add-note",
      icon: <IconFilePlus className="h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "My Notes",
      href: "/userdashboard/my-note",
      icon: <IconNotebook className="h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Today's Review",
      href: "/userdashboard/quick-review",
      icon: <IconCalendarCheck className="h-5 w-5 flex-shrink-0" />,
    },
   /*  {
      label: "Progress",
      href: "/userdashboard/progress",
      icon: <IconChartBar className="h-5 w-5 flex-shrink-0" />,
    }, */
    {
      label: "Insights",
      href: "/userdashboard/insights",
      icon: <IconChartLine className="h-5 w-5 flex-shrink-0" />,
    },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-white shadow-lg border-r border-gray-200 transition-all duration-300 z-40 ${
      isCollapsed ? "w-16" : "w-64"
    }`}>
      <div className="relative flex items-center justify-between p-4 ">
        {!isCollapsed && (
          <h1
            onClick={() => router.push('/')}
            className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent cursor-pointer"
          >
            Kioku
          </h1>
        )}
        <button
          className={`text-gray-500 absolute top-4 -right-3 border-2 border-gray-400 p-1  hover:text-gray-700 rounded-2xl bg-white hover:bg-gray-100 transition-colors ${
            isCollapsed ? "mx-auto" : ""
          }`}
          onClick={toggleSidebar}
        >
          <IconChevronLeft 
            className={`h-5 w-5 transition-transform duration-200 ${isCollapsed ? "rotate-180" : ""}`} 
          />
        </button>
      </div>

      <nav className="flex flex-col p-4 space-y-2">
        {links.map((link, idx) => (
          <button
            key={idx}
            onClick={() => router.push(link.href)}
            className={`flex items-center gap-3 py-3 px-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 group ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <span className="text-gray-500 group-hover:text-indigo-600 transition-colors">
              {link.icon}
            </span>
            {!isCollapsed && (
              <span className="font-medium text-sm">{link.label}</span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
