"use client";

import { useEffect, useId, useState } from "react";
import axios from "@/lib/axios";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Square = ({ className, children }) => (
  <span
    aria-hidden="true"
    className={cn(
      "flex size-5 items-center justify-center rounded bg-muted font-medium text-muted-foreground text-xs",
      className
    )}
  >
    {children}
  </span>
);

export default function FilterUser({
  selectedDeveloperId,
  onDeveloperChange,
}) {
  const id = useId();
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch team members
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);

        const res = await axios.get("/api/team/members");
        // 👆 route that maps to getTeamMembers

        // 🔥 Filter ONLY developers
        const devs = res.data.members.filter(
          (member) => member.role === "DEVELOPER"
        );

        setDevelopers(devs);
      } catch (err) {
        console.error("Failed to fetch team members:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  return (
    <div>
      <Select
        value={selectedDeveloperId}
        onValueChange={onDeveloperChange}
        disabled={loading}
      >
        <SelectTrigger
          className="ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2"
          id={id}
        >
          <SelectValue placeholder="Select developer" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>Team Developers</SelectLabel>

            {/* Optional: All developers */}
            <SelectItem value="ALL">
              <Square className="bg-gray-400/20 text-gray-600">ALL</Square>
              <span className="truncate">All Developers</span>
            </SelectItem>

            {developers.map((dev) => (
              <SelectItem key={dev.id} value={dev.id}>
                <Square className="bg-indigo-400/20 text-indigo-500">
                  {dev.name.charAt(0).toUpperCase()}
                </Square>
                <span className="truncate">{dev.name}</span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
