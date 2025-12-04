import express from "express";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js"; // apne project ke path ke hisaab se

const router = express.Router();

// 🟢 Get all teams (for dropdown)
router.get("/", async (req, res) => {
  try {
    const teams = await prisma.team.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    res.json(teams);
  } catch (err) {
    console.error("Error fetching teams:", err);
    res.status(500).json({ error: "Server error while fetching teams" });
  }
});

// 🟢 Join a team (set user.teamId)
router.post("/join", async (req, res) => {
  try {
    const tokenHeader = req.headers.authorization;
    if (!tokenHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = tokenHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, "supersecretkey123");
    } catch (err) {

      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const userId = decoded.id; // tum /me route mein bhi yehi use kar rahi thi

    const { teamId } = req.body;

    if (!teamId) {
      return res.status(400).json({ error: "teamId is required" });
    }

    // Optional: check if team exists
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    // Update user's teamId
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { teamId },
      include: { team: true },
    });

    res.json({
      message: "Joined team successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error joining team:", err);
    res.status(500).json({ error: "Server error while joining team" });
  }
});

export default router;
