// routes/auth.js
import express from "express";
import prisma from "../prismaClient.js";

import jwt from "jsonwebtoken";

const router = express.Router();


router.get("/me", async (req, res) => {
  try {
    const tokenHeader = req.headers.authorization;
    if (!tokenHeader)
      return res.status(401).json({ error: "No token provided" });

    const token = tokenHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, "supersecretkey123");
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
