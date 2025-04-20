"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { LayoutDashboard, UserCog, Settings, LogOut } from "lucide-react";

export function SidebarLayout() {
  const links = [
    {
      label: "Dashboard",
      href: "/userdashboard",
      icon: (
        <LayoutDashboard className=" h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Today's Quick Review",
      href: "/userdashboard/quick-review",
      icon: (
        <UserCog className=" h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Notes",
      href: "/notes",
      icon: (
        <Settings className=" h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Spaced retention",
      href: "/spaced-retention",
      icon: (
        <LogOut className=" h-5 w-5 flex-shrink-0" />
      ),
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
