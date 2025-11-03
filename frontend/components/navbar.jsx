"use client"

import React from "react"

import { Home, MessageSquare, User } from "lucide-react"
import { FloatingNav } from "./ui/floating-navbar"

export function FloatingNavbar() {
  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <Home className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Features",
      link: "/about",
      icon: <User className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Pricing",
      link: "/contact",
      icon: <MessageSquare className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
        name: "Reviews",
        link: "/contact",
        icon: <MessageSquare className="h-4 w-4 text-neutral-500 dark:text-white" />,
      }
  ]
  return (
    <div className="relative w-full">
      <FloatingNav navItems={navItems} />
    </div>
  )
}
