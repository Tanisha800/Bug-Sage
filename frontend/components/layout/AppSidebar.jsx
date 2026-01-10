
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
import { NavSecondary } from "./sidebar/nav-secondary";
import { NavUser } from "./sidebar/nav-user";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import RaiseTicket from "../dashboard/RaiseTicket";
import { useUser } from "@/app/providers/UserProvider";

function getInitials(name) {
  if (!name) return "?";
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { open } = useSidebar();
  const { theme, setTheme } = useTheme();

  // Dummy user (replace with your context later)
  // const [user, setUser] = React.useState({
  //   name: "User",
  //   email: "user@example.com",
  //   avatar: null,
  // });

  const { user, loading } = useUser();



  if (loading) {

    return null;
  }

  if (!user) {
    return null;
  }

  // 3) Safe user object bana lo (backend se aane wale fields ke hisab se)
  const safeUser = {
    name: user.name || user.username || "User",
    email: user.email || "user@example.com",
    avatar: user.avatar || null,
    role: user.role || "tester",
    id: user.id || null,
    teamId: user.teamId || null,
  };

  // React.useEffect(() => {
  //   const storedUser = localStorage.getItem("user");
  //   if (storedUser) {
  //     const parsedUser = JSON.parse(storedUser);
  //     setUser({
  //       name: parsedUser.username || "User",
  //       email: parsedUser.email || "user@example.com",
  //       avatar: null, // Add avatar logic if available in backend later
  //     });
  //   }
  // }, []);

  if (!user) {
    return null;
  }
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
        <SidebarMenu className="mt-3 w-full">
          <SidebarMenuItem>
            <RaiseTicket>
              <SidebarMenuButton asChild>
                <button className="flex items-center gap-2 cursor-pointer bg-primary font-semibold text-white px-3 py-2 rounded-md transition w-full ">
                  <IconCirclePlusFilled className="w-4 h-4" />
                  <span>Raise a Ticket</span>
                </button>
              </SidebarMenuButton>
            </RaiseTicket>
          </SidebarMenuItem>
        </SidebarMenu>
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
                  isActive={pathname === "/dashboard-tester"}
                >
                  <Link href="/dashboard-tester">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Bugs */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard-tester/bugs"}
                >
                  <Link href="/dashboard-tester/bugs">
                    <FolderKanban />
                    <span>Bugs</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Team */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard-tester/team"}
                >
                  <Link href="/dashboard-tester/team">
                    <Users />
                    <span>Team</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
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
        <NavUser user={safeUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
