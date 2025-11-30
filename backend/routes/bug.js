import express from "express";
import prisma from "../prismaClient.js";
import pkg from "@prisma/client";

const { BugStatus } = pkg; // if you defined BugStatus enum in schema.prisma
// If you don't have BugStatus enum, just use string values like "BACKLOG" etc.

const router = express.Router();

/**
 * Middleware: user authenticated hona chahiye
 * Aur req.user me { id, role, teamId } present hona chahiye
 */
function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

/**
 * POST /bugs
 * Tester naya bug raise karega
 * - Only role TESTER allowed
 * - assigneeId must be a DEVELOPER in same team
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const { id: userId, role, teamId } = req.user;

    if (role !== "TESTER") {
      return res
        .status(403)
        .json({ message: "Only testers can raise bugs" });
    }

    const { title, description, assigneeId, dueDate, attachmentUrl } = req.body;

    if (!title || !description || !assigneeId) {
      return res.status(400).json({
        message: "title, description and assigneeId are required",
      });
    }

    // ✅ Check assignee is a DEVELOPER in the same team
    const assignee = await prisma.user.findFirst({
      where: {
        id: assigneeId,
        role: "DEVELOPER",
        teamId: teamId,
      },
    });

    if (!assignee) {
      return res.status(400).json({
        message:
          "Invalid assignee: must be a developer in your team",
      });
    }

    const bug = await prisma.bug.create({
      data: {
        title,
        description,
        status: BugStatus?.BACKLOG || "BACKLOG", // fallback if no enum
        reporterId: userId,          // tester who raised it
        assigneeId: assigneeId,      // developer
        teamId: teamId,              // same team
        dueDate: dueDate ? new Date(dueDate) : null,
        attachmentUrl: attachmentUrl || null,
      },
    });

    return res.status(201).json(bug);
  } catch (err) {
    console.error("Error creating bug:", err);
    return res
      .status(500)
      .json({ message: "Failed to create bug" });
  }
});

/**
 * GET /bugs/:id
 * Bug details:
 * - allowed: reporter (tester) OR assigned developer
 */
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    const bugId = req.params.id;

    const bug = await prisma.bug.findUnique({
      where: { id: bugId },
    });

    if (!bug) {
      return res.status(404).json({ message: "Bug not found" });
    }

    const isReporter = bug.reporterId === userId;
    const isAssignee = bug.assigneeId === userId;

    if (!isReporter && !isAssignee && role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "You are not allowed to view this bug" });
    }

    return res.json(bug);
  } catch (err) {
    console.error("Error fetching bug:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch bug" });
  }
});

/**
 * GET /bugs
 * (optional) list:
 * - tester: all bugs of their team
 * - developer: only bugs assigned to them
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const { id: userId, role, teamId } = req.user;

    let where = {};

    if (role === "TESTER") {
      where.teamId = teamId;
    } else if (role === "DEVELOPER") {
      where.assigneeId = userId;
    }

    const bugs = await prisma.bug.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return res.json(bugs);
  } catch (err) {
    console.error("Error listing bugs:", err);
    return res
      .status(500)
      .json({ message: "Failed to list bugs" });
  }
});

/**
 * GET /bugs/assignees
 * Assign tab: team ke saare developers
 */
router.get("/assignees/list", requireAuth, async (req, res) => {
  try {
    const { teamId } = req.user;

    const developers = await prisma.user.findMany({
      where: {
        teamId,
        role: "DEVELOPER",
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return res.json(developers);
  } catch (err) {
    console.error("Error fetching assignees:", err);
    return res.status(500).json({
      message: "Failed to fetch assignees",
    });
  }
});

export default router;
