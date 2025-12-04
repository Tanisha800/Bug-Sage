"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Bug, TrendingUp } from "lucide-react";
import JoinTeam from "./JoinTeam";

export default function TeamMember() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teamName, setTeamName] = useState("");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchTeamMembers();
    fetchTeamStats();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get("api/team/members");
      setMembers(response.data.members);
      setTeamName(response.data.team);
    } catch (error) {
      console.error("Error fetching team members:", error);
      if (error.response?.status !== 404) {
        alert("Failed to load team members");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamStats = async () => {
    try {
      const response = await axios.get("api/team/stats");
      setStats(response.data.stats);
    } catch (error) {
      console.error("Error fetching team stats:", error);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "DEVELOPER":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "TESTER":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "ADMIN":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getBugCountColor = (count, role) => {
    if (count === 0) return "text-muted-foreground";
    if (role === "TESTER") return "text-purple-600 font-semibold";
    if (count > 10) return "text-red-600 font-semibold";
    if (count > 5) return "text-orange-600 font-semibold";
    return "text-green-600 font-semibold";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-muted-foreground">Loading team members...</div>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Users className="w-16 h-16 text-muted-foreground" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">No Team Members</h3>
          <p className="text-sm text-muted-foreground">
            You are not assigned to a team yet.

          </p>
          <JoinTeam/>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Team Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="p-2 text-2xl md:text-3xl font-bold">{teamName}</h2>
          <p className="px-2 text-sm text-muted-foreground">
            {members.length} team member{members.length !== 1 ? "s" : ""}
          </p>
        </div>

        {stats && (
          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <Users className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs text-muted-foreground">Developers</p>
                <p className="text-lg font-bold text-blue-600">
                  {stats.teamMembers.developers}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <Bug className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-xs text-muted-foreground">Testers</p>
                <p className="text-lg font-bold text-purple-600">
                  {stats.teamMembers.testers}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <TrendingUp className="w-4 h-4 text-orange-600" />
              <div>
                <p className="text-xs text-muted-foreground">Total Bugs</p>
                <p className="text-lg font-bold text-orange-600">
                  {stats.bugs.total}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Team Members Table */}
      <div className="rounded-2xl overflow-hidden border">
        <Table className="bg-gray-50 dark:bg-neutral-900">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="text-right font-semibold">
                Bugs {" "}
                <span className="text-xs font-normal text-muted-foreground">
                  (Assigned/Reported)
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow 
                key={member.id}
                className="hover:bg-muted/50 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.image} alt={member.name} />
                      <AvatarFallback>
                        {member.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <span className="text-xs text-muted-foreground">
                        {member.username}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{member.email}</div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={getRoleBadgeColor(member.role)}
                  >
                    {member.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end gap-1">
                    <span className={getBugCountColor(member.totalBugs, member.role)}>
                      {member.totalBugs}
                    </span>
                    {member.totalBugs > 0 && (
                      <div className="flex gap-1 text-xs">
                        {member.bugsByPriority.high > 0 && (
                          <span className="text-red-500">
                            🔴 {member.bugsByPriority.high}
                          </span>
                        )}
                        {member.bugsByPriority.medium > 0 && (
                          <span className="text-orange-500">
                            🟠 {member.bugsByPriority.medium}
                          </span>
                        )}
                        {member.bugsByPriority.low > 0 && (
                          <span className="text-blue-500">
                            🔵 {member.bugsByPriority.low}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="text-red-500">🔴</span>
          <span>High Priority</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-orange-500">🟠</span>
          <span>Medium Priority</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-blue-500">🔵</span>
          <span>Low Priority</span>
        </div>
        <div className="border-l pl-4 ml-2">
          <span className="font-medium">Note:</span> Developers see assigned bugs, Testers see reported bugs
        </div>
      </div>
    </div>
  );
}