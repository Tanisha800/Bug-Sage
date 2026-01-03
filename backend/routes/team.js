import express from "express";
import {
  getTeamMembers,
  getTeamMemberById,
  getTeamStats,
  getAllTeams,
  joinTeam,
} from "../controllers/teamController.js";
import authenticateMiddleware from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateMiddleware);

router.get("/members", getTeamMembers);
router.get("/members/:id", getTeamMemberById);
router.get("/stats", getTeamStats);

// Join Team Routes
router.get("/all", getAllTeams);
router.post("/join", joinTeam);

export default router;
