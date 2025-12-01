
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Settings,
  HelpCircle,
  Sun,
  Moon,
  ChevronsUpDown,
  LogOut,
  Bug,
  SettingsIcon,
  HelpCircleIcon,
  SearchIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import RaiseTicket from "./dashboard/RaiseTicket";

function getInitials(name) {
  if (!name) return "?";
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function AppSidebarDeveloper() {
  const pathname = usePathname();
  const router = useRouter();
  const { open } = useSidebar();
  const { theme, setTheme } = useTheme();

  // Dummy user (replace with your context later)
  const user = {
    name: "Tanisha",
    email: "tanisha@example.com",
    avatar: null,
  };
  // const data ={navSecondary: [
  //   {
  //     title: "Settings",
  //     url: "#",
  //     icon: SettingsIcon,
  //   },
  //   {
  //     title: "Get Help",
  //     url: "#",
  //     icon: HelpCircleIcon,
  //   },
  //   {
  //     title: "Search",
  //     url: "#",
  //     icon: SearchIcon,
  //   },
  // ],}

  return (
    <Sidebar variant="floating" collapsible="icon">
      {/* -------------------------------------- */}
      {/* BRANDING */}
      {/* -------------------------------------- */}
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1 rounded-md h-8 w-8 flex items-center justify-center">
            <Bug className="text-white" />
          </div>
          <span className="font-semibold text-lg truncate">BugSage</span>
        </div>
       
      </SidebarHeader>

      {/* -------------------------------------- */}
      {/* MAIN NAVIGATION */}
      {/* -------------------------------------- */}
      <SidebarContent className="overflow-y-auto overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Dashboard */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard-developer"}
                >
                  <Link href="/dashboard-developer">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Projects */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard-developer/bugs"}
                >
                  <Link href="/dashboard-developer/bugs">
                    <FolderKanban />
                    <span>Bugs</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Team */}
              
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="mx-2" />

        {/* -------------------------------------- */}
        {/* SECONDARY NAVIGATION */}
        {/* -------------------------------------- */}
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Theme Toggle */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className="flex items-center gap-2 cursor-pointer w-full"
                  >
                    {theme === "dark" ? <Sun /> : <Moon />}
                    <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>

              
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>

      {/* -------------------------------------- */}
      {/* FOOTER - USER PROFILE */}
      {/* -------------------------------------- */}
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
