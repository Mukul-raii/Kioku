"use client";
import React, { useState } from "react";
import {
  LayoutDashboard,
  FilePlus,
  NotebookText,
  CalendarCheck,
  BarChart2,
  LineChart,
} from "lucide-react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";

export function SidebarLayout() {
  const links = [
    {
      label: "Dashboard",
      href: "/userdashboard",
      icon: <LayoutDashboard className="h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Add Notes",
      href: "/userdashboard/add-note",
      icon: <FilePlus className="h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "My Notes",
      href: "/userdashboard/my-note",
      icon: <NotebookText className="h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Today's Review",
      href: "/userdashboard/quick-review",
      icon: <CalendarCheck className="h-5 w-5 flex-shrink-0" />,
    },
   /*  {
      label: "Progress",
      href: "/userdashboard/progress",
      icon: <BarChart2 className="h-5 w-5 flex-shrink-0" />,
    }, */
    {
      label: "Insights",
      href: "/userdashboard/insights",
      icon: <LineChart className="h-5 w-5 flex-shrink-0" />,
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}
