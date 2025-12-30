"use client"

import React from "react"

import { Home, MessageSquare, User } from "lucide-react"
import { FloatingNav } from "./ui/floating-navbar"

export function FloatingNavbar() {
  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <Home className="h-4 w-4  text-white" />,
    },
    {
      name: "Features",
      link: "#features",
      icon: <User className="h-4 w-4 text-white" />,
    },
    {
      name: "Pricing",
      link: "#pricing",
      icon: <MessageSquare className="h-4 w-4 text-white" />,
    },
    {
      name: "Reviews",
      link: "#reviews",
      icon: <MessageSquare className="h-4 w-4text-white" />,
    }
  ]
  return (
    <div className="relative w-full">
      <FloatingNav navItems={navItems} />
    </div>
  )
}
