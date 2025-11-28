"use client";
import * as React from "react";
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
  Home,
  ListTodo,
  FileText,
  ClipboardCheck,
  Users,
  Search,
  BarChart2,
  Puzzle,
  Settings,
  HelpCircle,
  LogOut,
  PlusCircle,
  ChevronUp,
  LogOutIcon,
  CircleUserRound,
  ReceiptIndianRupee,
  ReceiptIndianRupeeIcon,
  ChevronsUpDown,
  Brain,
  Calendar1,
  Sun,
  Moon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreditCard, Bell, User, ArrowUpRight } from "lucide-react";
import { SearchCommand } from "../searchCommand";
import { useState } from "react";
import { Kbd } from "@heroui/kbd";
import { Calculator, Calendar, Smile } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@heroui/react";
import MeetingUploadModal from "./meetingUploadModal";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { OrbitalLoader } from "../ui/orbital-loader";

import { useContext } from "react";
import { UserContext } from "../../app/providers/UserProvider";
import Link from "next/link";
import UpdateProfileModal from "./UpdateProfileModal";

function getInitials(name) {
  if (!name || typeof name !== "string") return "?";

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0]?.[0]?.toUpperCase() || "?";
  }

  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
}

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { open } = useSidebar();
  const { theme, setTheme } = useTheme(); // Get theme and setTheme
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [searchOpen, setSearchOpen] = useState(false);

  const { user } = useContext(UserContext);
  React.useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/signup");
  };

  if (!user) return null;

  return (
    <Sidebar variant="floating" collapsible="icon">
      {/* Branding */}
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1 text-black rounded-md h-8 w-8 flex items-center justify-center font-bold">
            <Brain className="text-white" />
          </div>
          <span className="font-semibold text-lg truncate">Meet Wise</span>
        </div>

        <SidebarMenu className="mt-3 w-full">
          <SidebarMenuItem>
            <MeetingUploadModal>
              <SidebarMenuButton asChild>
                <button className="flex items-center gap-2 cursor-pointer bg-primary font-semibold text-white px-3 py-2 rounded-md hover:bg-purple-300 transition w-full ">
                  <IconCirclePlusFilled className="w-4 h-4" />
                  <span>New Meeting</span>
                </button>
              </SidebarMenuButton>
            </MeetingUploadModal>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="overflow-y-auto overflow-x-hidden">
        {/* Core Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Core</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
                  <Link href="/dashboard">
                    <Home />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/calendar"}
                >
                  <Link href="/dashboard/calendar">
                    <Calendar1 />
                    <span>Calendar</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/meetings">
                    <ListTodo />

                    <span>My Meetings</span>
                  </Link>

                </SidebarMenuButton>
              </SidebarMenuItem> */}

              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  isActive={pathname === "/dashboard/summaries"}
                  
                >
                  <Link href="/dashboard/summaries">
                    <FileText />
                    <span>Summaries</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/tasks"}
                >
                  <Link href="/dashboard/tasks">
                    <ClipboardCheck />
                    <span>Action Items</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="mx-2" />

        {/* Secondary Features */}
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <div
                    onClick={() => setSearchOpen(true)} // 👈 clicking anywhere opens search
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Search className="h-4 w-4" />
                    <button
                      onClick={() => setSearchOpen(true)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition"
                    >
                      <span>Search</span>

                      <Kbd
                        className="ml-auto rounded-md border px-1.5 py-0.5 text-xs font-medium
    text-muted-foreground bg-muted shadow-sm
    dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700
    outline-none focus:outline-none align-middle leading-none"
                        keys={["command"]}
                      >
                        K
                      </Kbd>
                    </button>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
                <CommandInput placeholder="Type Link command or search..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Suggestions">
                    <CommandItem>
                      <Calendar />
                      <span>Calendar</span>
                    </CommandItem>
                    <CommandItem>
                      <Smile />
                      <span>Search Emoji</span>
                    </CommandItem>
                    <CommandItem>
                      <Calculator />
                      <span>Calculator</span>
                    </CommandItem>
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup heading="Settings">
                    <CommandItem>
                      <User />
                      <span>Profile</span>
                      <CommandShortcut>⌘P</CommandShortcut>
                    </CommandItem>
                    <CommandItem>
                      <CreditCard />
                      <span>Billing</span>
                      <CommandShortcut>⌘B</CommandShortcut>
                    </CommandItem>
                    <CommandItem>
                      <Settings />
                      <span>Settings</span>
                      <CommandShortcut>⌘S</CommandShortcut>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </CommandDialog>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className="flex items-center gap-2 cursor-pointer w-full"
                  >
                    {theme === "dark" ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                    <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={`flex w-full items-center gap-3 rounded-md py-2 hover:bg-muted transition ${
                !open ? "" : "px-3"
              }`}
            >
              <Avatar className="h-10 w-10 ">
                <AvatarImage
                  src={user?.avatar ? user.avatar : undefined}
                  alt="@shadcn"
                />
                <AvatarFallback className="bg-gray-200 text-black font-medium dark:bg-muted dark:text-white ">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>

              {/* Show name and email only if sidebar is expanded */}
              {open && (
                <div className="flex flex-col items-start text-left overflow-hidden">
                  <span className="text-sm font-medium truncate">
                    {user.name}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </span>
                </div>
              )}
              <ChevronsUpDown className="ml-auto text-muted-foreground h-5 w-5" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className={`w-56 ${open ? "" : "m-4"}`}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => setProfileModalOpen(true)}>
              <User className="mr-2 h-4 w-4" />
              Account
            </DropdownMenuItem>

            
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-400" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4 text-red-400" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <UpdateProfileModal
          open={profileModalOpen}
          setOpen={setProfileModalOpen}
        />
      </SidebarFooter>
    </Sidebar>
  );
}