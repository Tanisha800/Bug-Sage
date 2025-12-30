import express from "express";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";

const router = express.Router();


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


router.post("/join", async (req, res) => {
  try {
    const tokenHeader = req.headers.authorization;
    if (!tokenHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = tokenHeader.split(" ")[1];
    const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123";

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const userId = decoded.id;

    const { teamId } = req.body;

    if (!teamId) {
      return res.status(400).json({ error: "teamId is required" });
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { teamId },
      include: { team: true },
    });

    // ✅ Generate new JWT token with updated teamId
    const newToken = jwt.sign(
      {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        teamId: updatedUser.teamId
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Joined team successfully",
      token: newToken, // ✅ Return new token
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        teamId: updatedUser.teamId,
      },
    });
  } catch (err) {
    console.error("Error joining team:", err);
    res.status(500).json({ error: "Server error while joining team" });
  }
});

export default router;
