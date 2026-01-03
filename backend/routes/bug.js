import express from "express";
import {
  createBug,
  getBugs,
  getBugById,
  updateBug,
  deleteBug,
  getBugStats,
  getAssignees,
} from "../controllers/bugController.js";
import authenticateMiddleware from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateMiddleware);

router.post("/", createBug);
router.get("/", getBugs);
router.get("/stats/summary", getBugStats);
router.get("/assignees/list", getAssignees);
router.get("/:id", getBugById);
router.put("/:id", updateBug);
router.patch("/:id/status", updateBug);
router.delete("/:id", deleteBug);

export default router;
