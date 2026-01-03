"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu } from "../ui/dropdown-menu";
import JoinTeamSelect from "./JoinTeamSelect";


import { useEffect, useState } from "react";

import { useUser } from "@/app/providers/UserProvider";

export default function JoinTeam() {
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, setUser, API_URL } = useUser();

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Fetch all teams
    fetch(`${API_URL}/api/team/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch teams");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setTeams(data);
        } else {
          console.error("Teams data is not an array:", data);
          setTeams([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching teams:", err);
        setTeams([]);
      });
  }, [API_URL]);
  console.log(teams)
  const handleJoinTeam = async () => {
    if (!selectedTeamId) return alert("Please select a team first");

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return alert("Not logged in");

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/team/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ teamId: selectedTeamId }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Join team error:", data);
        alert(data.error || "Failed to join team");
        return;
      }

      // ✅ Update localStorage with new token and user data
      if (data.token) {
        localStorage.setItem("token", data.token);
        console.log("✅ New token saved to localStorage");
      }

      // Update user context with new team info
      if (data.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      alert("Joined team successfully! Refreshing page...");

      // ✅ Reload page to ensure all components use the new token
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error("Error joining team:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Join Team</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join Team</DialogTitle>
          <DialogDescription>
            Join your team below to start building something great
          </DialogDescription>
        </DialogHeader>
        <JoinTeamSelect
          teams={teams}
          value={selectedTeamId}
          onChange={setSelectedTeamId} // yahan se value parent mein aa rahi hai
        />
        <Button
          className="mt-4"
          onClick={handleJoinTeam}
          disabled={loading || !selectedTeamId}
        >
          {loading ? "Joining..." : "Join Team"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
