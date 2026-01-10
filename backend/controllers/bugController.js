import prisma from "../config/prisma.js";
import pkg from "@prisma/client";
const { BugStatus, Priority } = pkg;

// Status mapping for Kanban columns (from kanban.js)
const statusMap = {
    Backlog: "BACKLOG",
    "In Progress": "IN_PROGRESS",
    Tester: "TESTER",
    Resolved: "RESOLVED",
};

export const createBug = async (req, res) => {
    try {
        const { id: userId, role, teamId } = req.user;
        const {
            title,
            description,
            assigneeId,
            dueDate,
            attachmentUrl,
            priority,
        } = req.body;

        if (role !== "TESTER") {
            return res.status(403).json({ message: "Only testers can raise bugs" });
        }

        if (!title || !description || !assigneeId) {
            return res.status(400).json({ message: "title, description and assigneeId are required" });
        }

        const bugPriority = priority && Object.values(Priority).includes(priority) ? priority : Priority.MEDIUM;

        const bug = await prisma.bug.create({
            data: {
                title,
                description,
                status: BugStatus.BACKLOG,
                priority: bugPriority,
                reporterId: userId,
                assigneeId,
                teamId: teamId || req.user.teamId,
                dueDate: dueDate ? new Date(dueDate) : null,
                attachmentUrl: attachmentUrl || null,
            },
        });

        res.status(201).json(bug);
    } catch (err) {
        console.error("Error creating bug:", err);
        res.status(500).json({ message: "Failed to create bug" });
    }
};

export const getBugs = async (req, res) => {
    try {
        const { id: userId, role, teamId } = req.user;
        const { status } = req.query;
        console.log(role, teamId)
        let where = {};
        if (role === "TESTER") {
            where.teamId = teamId;
            console.log("Tester")
        } else if (role === "DEVELOPER") {
            where.assigneeId = userId;
        }

        if (status) {
            where.status = status;
        }
        console.log({ "where": where })

        const bugs = await prisma.bug.findMany({
            where,
            include: {
                assignee: { select: { id: true, username: true, email: true } },
                reporter: { select: { id: true, username: true } },
                team: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        res.json({ bugs });
    } catch (err) {
        console.error("Error fetching bugs:", err);
        res.status(500).json({ message: "Failed to fetch bugs" });
    }
};

export const getBugById = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: userId, role } = req.user;

        const bug = await prisma.bug.findUnique({
            where: { id },
            include: {
                assignee: { select: { id: true, username: true, email: true } },
                reporter: { select: { id: true, username: true, email: true } },
                team: { select: { id: true, name: true } },
            },
        });

        if (!bug) return res.status(404).json({ message: "Bug not found" });

        const isReporter = bug.reporterId === userId;
        const isAssignee = bug.assigneeId === userId;

        if (!isReporter && !isAssignee && role !== "ADMIN") {
            return res.status(403).json({ message: "Access denied" });
        }

        res.json(bug);
    } catch (err) {
        console.error("Error fetching bug:", err);
        res.status(500).json({ message: "Failed to fetch bug" });
    }
};

export const updateBug = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, title, description, priority, dueDate } = req.body;
        const { id: userId } = req.user;

        const bug = await prisma.bug.findUnique({
            where: { id },
        });

        if (!bug) return res.status(404).json({ message: "Bug not found" });

        if (bug.assigneeId !== userId && bug.reporterId !== userId) {
            return res.status(403).json({ message: "Not authorized to update this bug" });
        }

        const updateData = {};
        if (status) {
            const dbStatus = statusMap[status] || status;
            if (Object.values(BugStatus).includes(dbStatus)) {
                updateData.status = dbStatus;
            }
        }
        if (title) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (priority) updateData.priority = priority;
        if (dueDate) updateData.dueDate = new Date(dueDate);

        const updatedBug = await prisma.bug.update({
            where: { id },
            data: updateData,
        });

        res.json(updatedBug);
    } catch (err) {
        console.error("Error updating bug:", err);
        res.status(500).json({ message: "Failed to update bug" });
    }
};

export const deleteBug = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.bug.delete({ where: { id } });
        res.json({ message: "Deleted Successfully" });
    } catch (err) {
        console.error("Error deleting bug:", err);
        res.status(500).json({ error: "Failed to delete bug" });
    }
};

export const getBugStats = async (req, res) => {
    try {
        const { id: userId, teamId, role } = req.user;

        let where = {};
        if (role === "DEVELOPER") {
            where.assigneeId = userId;
        } else {
            where.teamId = teamId;
        }

        const [backlog, inProgress, testing, resolved] = await Promise.all([
            prisma.bug.count({ where: { ...where, status: BugStatus.BACKLOG } }),
            prisma.bug.count({ where: { ...where, status: BugStatus.IN_PROGRESS } }),
            prisma.bug.count({ where: { ...where, status: BugStatus.TESTER || "TESTER" } }),
            prisma.bug.count({ where: { ...where, status: BugStatus.RESOLVED } }),
        ]);

        res.json({ backlog, inProgress, testing, resolved });
    } catch (err) {
        console.error("Error fetching stats:", err);
        res.status(500).json({ message: "Failed to get stats" });
    }
};

export const getAssignees = async (req, res) => {
    try {
        const { teamId } = req.user;
        const developers = await prisma.user.findMany({
            where: { teamId, role: "DEVELOPER" },
            select: { id: true, username: true, email: true },
        });
        res.json(developers);
    } catch (err) {
        console.error("Error fetching assignees:", err);
        res.status(500).json({ message: "Failed to fetch assignees" });
    }
};
