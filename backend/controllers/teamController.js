import prisma from "../config/prisma.js";
import jwt from "jsonwebtoken";

export const getTeamMembers = async (req, res) => {
    try {
        const userId = req.user.id;

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

        const teamMembers = await prisma.user.findMany({
            where: { teamId: currentUser.teamId },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                createdAt: true,
                assignedBugs: { select: { id: true, status: true, priority: true } },
                reportedBugs: { select: { id: true, status: true, priority: true } },
                team: { select: { id: true, name: true } },
            },
            orderBy: { username: "asc" },
        });

        const formattedMembers = teamMembers.map((member) => {
            const isDeveloper = member.role === "DEVELOPER";
            const isTester = member.role === "TESTER";
            const bugs = isDeveloper ? member.assignedBugs : member.reportedBugs;

            return {
                id: member.id,
                name: member.username,
                username: `@${member.username.toLowerCase().replace(/\s+/g, "")}`,
                email: member.email,
                role: member.role,
                type: isDeveloper ? "Developer" : isTester ? "Tester" : "Admin",
                team: member.team?.name || "No Team",
                totalBugs: bugs.length,
                bugsByStatus: {
                    backlog: bugs.filter((b) => b.status === "BACKLOG").length,
                    pending: bugs.filter((b) => b.status === "PENDING").length,
                    inProgress: bugs.filter((b) => b.status === "IN_PROGRESS").length,
                    testing: bugs.filter((b) => b.status === "TESTING").length,
                    resolved: bugs.filter((b) => b.status === "RESOLVED").length,
                },
                bugsByPriority: {
                    low: bugs.filter((b) => b.priority === "LOW").length,
                    medium: bugs.filter((b) => b.priority === "MEDIUM").length,
                    high: bugs.filter((b) => b.priority === "HIGH").length,
                },
                joinedAt: member.createdAt,
                image: `https://ui-avatars.com/api/?name=${encodeURIComponent(member.username)}&background=random&size=128`,
            };
        });

        res.json({
            members: formattedMembers,
            count: formattedMembers.length,
            team: teamMembers[0]?.team?.name || "Unknown Team",
        });
    } catch (err) {
        console.error("getTeamMembers error:", err);
        res.status(500).json({ error: "Failed to fetch team members" });
    }
};

export const getTeamMemberById = async (req, res) => {
    try {
        const { id } = req.params;
        const member = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true, username: true, email: true, role: true, createdAt: true,
                assignedBugs: { include: { reporter: { select: { username: true, email: true } } } },
                reportedBugs: { include: { assignee: { select: { username: true, email: true } } } },
                team: { select: { id: true, name: true } },
            },
        });

        if (!member) return res.status(404).json({ error: "Team member not found" });

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
                    ...(isDeveloper ? { reporter: bug.reporter?.username } : { assignee: bug.assignee?.username }),
                })),
                joinedAt: member.createdAt,
            },
        });
    } catch (err) {
        console.error("getTeamMemberById error:", err);
        res.status(500).json({ error: "Failed to fetch team member" });
    }
};

export const getTeamStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { teamId: true },
        });

        if (!currentUser?.teamId) return res.status(404).json({ error: "No team assigned" });

        const [developers, testers, admins, totalBugs, bugsByStatus] = await Promise.all([
            prisma.user.count({ where: { teamId: currentUser.teamId, role: "DEVELOPER" } }),
            prisma.user.count({ where: { teamId: currentUser.teamId, role: "TESTER" } }),
            prisma.user.count({ where: { teamId: currentUser.teamId, role: "ADMIN" } }),
            prisma.bug.count({ where: { teamId: currentUser.teamId } }),
            prisma.bug.groupBy({
                by: ["status"],
                where: { teamId: currentUser.teamId },
                _count: { status: true },
            }),
        ]);

        const statusCounts = bugsByStatus.reduce((acc, item) => {
            acc[item.status.toLowerCase()] = item._count.status;
            return acc;
        }, {});

        res.json({
            stats: {
                teamMembers: { total: developers + testers + admins, developers, testers, admins },
                bugs: { total: totalBugs, byStatus: statusCounts },
            },
        });
    } catch (err) {
        console.error("getTeamStats error:", err);
        res.status(500).json({ error: "Failed to fetch team stats" });
    }
};

export const getAllTeams = async (req, res) => {
    try {
        const teams = await prisma.team.findMany({
            select: { id: true, name: true },
        });
        res.json(teams);
    } catch (err) {
        console.error("getAllTeams error:", err);
        res.status(500).json({ error: "Server error while fetching teams" });
    }
};

export const joinTeam = async (req, res) => {
    try {
        const userId = req.user.id;
        const { teamId } = req.body;

        if (!teamId) return res.status(400).json({ error: "teamId is required" });

        const team = await prisma.team.findUnique({ where: { id: teamId } });
        if (!team) return res.status(404).json({ error: "Team not found" });

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { teamId },
            include: { team: true },
        });

        const newToken = jwt.sign(
            { id: updatedUser.id, email: updatedUser.email, role: updatedUser.role, teamId: updatedUser.teamId },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Joined team successfully",
            token: newToken,
            user: {
                id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role,
                teamId: updatedUser.teamId,
            },
        });
    } catch (err) {
        console.error("joinTeam error:", err);
        res.status(500).json({ error: "Server error while joining team" });
    }
};
