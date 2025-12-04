// routes/bugs.js - Bug Routes
import express from "express";
import { PrismaClient } from "@prisma/client";
import authenticateMiddleware from "../middleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// Status mapping for Kanban columns
const statusMap = {
  Backlog: "BACKLOG",
  "In Progress": "IN_PROGRESS",
  Tester: "TESTER",
  Resolved: "RESOLVED",
};

// Reverse mapping for frontend
const columnMap = {
  BACKLOG: "Backlog",
TESTER: "Tester",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
};

// @route   GET /api/bugs
// @desc    Get all bugs assigned to logged-in developer
// @access  Private (Developers only)
router.get("/", authenticateMiddleware, async (req, res) => {
  try {
    const bugs = await prisma.bug.findMany({
      where: {
        assigneeId: req.user.id,
      },
      include: {
        assignee: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        reporter: {
          select: {
            id: true,
            username: true,
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
        createdAt: "desc",
      },
    });

    const formattedBugs = bugs.map((bug) => ({
      id: bug.id,
      title: bug.title,
      description: bug.description,
      status: bug.status,
      priority: bug.priority,
      startAt: bug.createdAt,
      endAt:
        bug.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      owner: {
        name: bug.assignee.username,
        image: "/default.png",
      },
      reporter: bug.reporter.username,
      team: bug.team?.name,
      createdAt: bug.createdAt,
      updatedAt: bug.updatedAt,
    }));

    res.json({
      bugs: formattedBugs,
      count: formattedBugs.length,
    });
  } catch (error) {
    console.error("Error fetching bugs:", error);
    res.status(500).json({ error: "Failed to fetch bugs" });
  }
});

// @route   GET /api/bugs/:id
// @desc    Get single bug by ID
// @access  Private
router.get("/:id", authenticateMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const bug = await prisma.bug.findUnique({
      where: { id },
      include: {
        assignee: {
          select: { id: true, username: true, email: true },
        },
        reporter: {
          select: { id: true, username: true, email: true },
        },
        team: {
          select: { id: true, name: true },
        },
      },
    });

    if (!bug) {
      return res.status(404).json({ error: "Bug not found" });
    }

    if (bug.assigneeId !== req.user.id && bug.reporterId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json({ bug });
  } catch (error) {
    console.error("Error fetching bug:", error);
    res.status(500).json({ error: "Failed to fetch bug" });
  }
});

// @route   PUT /api/bugs/:id
// @desc    Update bug
// @access  Private
router.put("/:id", authenticateMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, title, description, priority, dueDate } = req.body;
    console.log({"this is body":req.body});

    const bug = await prisma.bug.findUnique({
      where: { id },
      select: { assigneeId: true, reporterId: true },
    });

    if (!bug) return res.status(404).json({ error: "Bug not found" });
    console.log({"This is bug":bug})
    if (bug.assigneeId !== req.user.id && bug.reporterId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this bug" });
    }


    const updateData = {};

    if (status) {
      const dbStatus = statusMap[status] || status;

      const validStatuses = [
        "BACKLOG",
        "TESTER",
        "IN_PROGRESS",
        "RESOLVED",
      ];

      if (!validStatuses.includes(dbStatus)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      updateData.status = dbStatus;
    }

    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;

    if (priority) {
      const validPriorities = ["LOW", "MEDIUM", "HIGH"];

      if (!validPriorities.includes(priority)) {
        return res.status(400).json({ error: "Invalid priority" });
      }

      updateData.priority = priority;
    }

    if (dueDate) updateData.dueDate = new Date(dueDate);

    const updatedBug = await prisma.bug.update({
      where: { id },
      data: updateData,
      include: {
        assignee: { select: { username: true } },
        reporter: { select: { username: true } },
      },
    });

    res.json({
      message: "Bug updated successfully",
      bug: {
        id: updatedBug.id,
        title: updatedBug.title,
        status: updatedBug.status,
        priority: updatedBug.priority,
        dueDate: updatedBug.dueDate,
        updatedAt: updatedBug.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error updating bug:", error);
    res.status(500).json({ error: "Failed to update bug" });
  }
});

// @route   POST /api/bugs
// @desc    Create a new bug
// @access  Private
router.post("/", authenticateMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      assigneeId,
      dueDate,
      attachmentUrl,
    } = req.body;

    if (!title) return res.status(400).json({ error: "Title is required" });
    if (!assigneeId)
      return res.status(400).json({ error: "Assignee is required" });

    const assignee = await prisma.user.findUnique({
      where: { id: assigneeId },
      select: { role: true, teamId: true },
    });

    if (!assignee)
      return res.status(404).json({ error: "Assignee not found" });

    const validPriorities = ["LOW", "MEDIUM", "HIGH"];
    const bugPriority =
      priority && validPriorities.includes(priority)
        ? priority
        : "MEDIUM";

    const bug = await prisma.bug.create({
      data: {
        title,
        description: description || null,
        priority: bugPriority,
        status: "BACKLOG",
        reporterId: req.user.id,
        assigneeId,
        teamId: req.user.teamId || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        attachmentUrl: attachmentUrl || null,
      },
      include: {
        assignee: { select: { id: true, username: true } },
        reporter: { select: { id: true, username: true } },
      },
    });

    res.status(201).json({ message: "Bug created successfully", bug });
  } catch (error) {
    console.error("Error creating bug:", error);
    res.status(500).json({
      error: "Failed to create bug",
      details:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
});

// @route   DELETE /api/bugs/:id
// @desc    Delete a bug
// @access  Private
router.delete("/:id", authenticateMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const bug = await prisma.bug.findUnique({
      where: { id },
      select: { reporterId: true },
    });

    if (!bug) return res.status(404).json({ error: "Bug not found" });

    if (req.user.role !== "ADMIN" && bug.reporterId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this bug" });
    }

    await prisma.bug.delete({ where: { id } });

    res.json({ message: "Bug deleted successfully" });
  } catch (error) {
    console.error("Error deleting bug:", error);
    res.status(500).json({ error: "Failed to delete bug" });
  }
});

// @route   GET /api/bugs/stats/summary
// @desc    Get bug statistics
// @access  Private
router.get("/stats/summary", authenticateMiddleware, async (req, res) => {
  try {
    const bugs = await prisma.bug.findMany({
      where: {
        assigneeId: req.user.id,
      },
      select: {
        status: true,
        priority: true,
      },
    });

    const stats = {
      total: bugs.length,
      byStatus: {
        backlog: bugs.filter((b) => b.status === "BACKLOG").length,
        pending: bugs.filter((b) => b.status === "PENDING").length,
        inProgress: bugs.filter((b) => b.status === "IN_PROGRESS").length,
        resolved: bugs.filter((b) => b.status === "RESOLVED").length,
      },
      byPriority: {
        low: bugs.filter((b) => b.priority === "LOW").length,
        medium: bugs.filter((b) => b.priority === "MEDIUM").length,
        high: bugs.filter((b) => b.priority === "HIGH").length,
      },
    };

    res.json({ stats });
  } catch (error) {
    console.error("Error fetching bug stats:", error);
    res.status(500).json({ error: "Failed to fetch bug statistics" });
  }
});

export default router;
