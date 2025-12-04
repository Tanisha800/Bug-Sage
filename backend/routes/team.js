// routes/team.js - Team Members Routes
import express from "express";
import { PrismaClient } from "@prisma/client";
import authenticateMiddleware from "../middleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// @route   GET /api/team/members
// @desc    Get all team members with bug counts
// @access  Private
router.get("/members", authenticateMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get the logged-in user's team
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { teamId: true },
    });

    if (!currentUser?.teamId) {
      return res.status(404).json({
        error: "You are not assigned to a team",
        members: [],
      });
    }

    // Get all team members with their bug counts
    const teamMembers = await prisma.user.findMany({
      where: {
        teamId: currentUser.teamId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        // Count assigned bugs for developers
        assignedBugs: {
          select: {
            id: true,
            status: true,
            priority: true,
          },
        },
        // Count reported bugs for testers
        reportedBugs: {
          select: {
            id: true,
            status: true,
            priority: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        username: "asc",
      },
    });

    // Format the response
    const formattedMembers = teamMembers.map((member) => {
      const isDeveloper = member.role === "DEVELOPER";
      const isTester = member.role === "TESTER";

      // For developers: count assigned bugs
      // For testers: count reported bugs
      const bugs = isDeveloper ? member.assignedBugs : member.reportedBugs;
      const totalBugs = bugs.length;

      // Count bugs by status
      const bugsByStatus = {
        backlog: bugs.filter((b) => b.status === "BACKLOG").length,
        pending: bugs.filter((b) => b.status === "PENDING").length,
        inProgress: bugs.filter((b) => b.status === "IN_PROGRESS").length,
        testing: bugs.filter((b) => b.status === "TESTING").length,
        resolved: bugs.filter((b) => b.status === "RESOLVED").length,
      };

      // Count bugs by priority
      const bugsByPriority = {
        low: bugs.filter((b) => b.priority === "LOW").length,
        medium: bugs.filter((b) => b.priority === "MEDIUM").length,
        high: bugs.filter((b) => b.priority === "HIGH").length,
      };

      return {
        id: member.id,
        name: member.username,
        username: `@${member.username.toLowerCase().replace(/\s+/g, "")}`,
        email: member.email,
        role: member.role,
        type: isDeveloper ? "Developer" : isTester ? "Tester" : "Admin",
        team: member.team?.name || "No Team",
        totalBugs,
        bugsByStatus,
        bugsByPriority,
        joinedAt: member.createdAt,
        // Generate avatar based on name (placeholder)
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          member.username
        )}&background=random&size=128`,
      };
    });

    res.json({
      members: formattedMembers,
      count: formattedMembers.length,
      team: teamMembers[0]?.team?.name || "Unknown Team",
    });
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).json({ error: "Failed to fetch team members" });
  }
});

// @route   GET /api/team/members/:id
// @desc    Get single team member details
// @access  Private
router.get("/members/:id", authenticateMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const member = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        assignedBugs: {
          include: {
            reporter: {
              select: {
                username: true,
                email: true,
              },
            },
          },
        },
        reportedBugs: {
          include: {
            assignee: {
              select: {
                username: true,
                email: true,
              },
            },
          },
        },
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!member) {
      return res.status(404).json({ error: "Team member not found" });
    }

    const isDeveloper = member.role === "DEVELOPER";
    const bugs = isDeveloper ? member.assignedBugs : member.reportedBugs;

    res.json({
      member: {
        id: member.id,
        name: member.username,
        email: member.email,
        role: member.role,
        type: isDeveloper ? "Developer" : "Tester",
        team: member.team?.name,
        totalBugs: bugs.length,
        bugs: bugs.map((bug) => ({
          id: bug.id,
          title: bug.title,
          status: bug.status,
          priority: bug.priority,
          createdAt: bug.createdAt,
          ...(isDeveloper
            ? {
                reporter: bug.reporter?.username,
              }
            : {
                assignee: bug.assignee?.username,
              }),
        })),
        joinedAt: member.createdAt,
      },
    });
  } catch (error) {
    console.error("Error fetching team member:", error);
    res.status(500).json({ error: "Failed to fetch team member" });
  }
});

// @route   GET /api/team/stats
// @desc    Get team statistics
// @access  Private
router.get("/stats", authenticateMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { teamId: true },
    });

    if (!currentUser?.teamId) {
      return res
        .status(404)
        .json({ error: "You are not assigned to a team" });
    }

    // Count team members by role
    const developers = await prisma.user.count({
      where: {
        teamId: currentUser.teamId,
        role: "DEVELOPER",
      },
    });

    const testers = await prisma.user.count({
      where: {
        teamId: currentUser.teamId,
        role: "TESTER",
      },
    });

    const admins = await prisma.user.count({
      where: {
        teamId: currentUser.teamId,
        role: "ADMIN",
      },
    });

    // Count total bugs for the team
    const totalBugs = await prisma.bug.count({
      where: {
        teamId: currentUser.teamId,
      },
    });

    // Count bugs by status
    const bugsByStatus = await prisma.bug.groupBy({
      by: ["status"],
      where: {
        teamId: currentUser.teamId,
      },
      _count: {
        status: true,
      },
    });

    const statusCounts = bugsByStatus.reduce((acc, item) => {
      acc[item.status.toLowerCase()] = item._count.status;
      return acc;
    }, {});

    res.json({
      stats: {
        teamMembers: {
          total: developers + testers + admins,
          developers,
          testers,
          admins,
        },
        bugs: {
          total: totalBugs,
          byStatus: statusCounts,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching team stats:", error);
    res.status(500).json({ error: "Failed to fetch team statistics" });
  }
});

export default router;

