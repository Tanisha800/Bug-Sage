import express from "express";
import { getAllUsers } from "../controllers/userController.js";
import authenticateMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticateMiddleware, getAllUsers);

export default router;
