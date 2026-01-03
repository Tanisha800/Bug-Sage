import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Routes
import bugRouter from "./routes/bug.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import teamRoutes from "./routes/team.js";

// Middleware
import authenticateMiddleware from "./middleware/auth.js";

dotenv.config();

const app = express();

// Configuration
const PORT = process.env.PORT || 8080;

// Global Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["https://bug-sage-three.vercel.app", "http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Health Check
app.get("/", (req, res) => {
  res.send("Bug-Sage API is running...");
});

// Auth Routes (Public)
app.use("/api/auth", authRouter);

// Protected Routes
app.use(authenticateMiddleware);

app.use("/api/users", userRouter);
app.use("/api/bugs", bugRouter);
app.use("/api/team", teamRoutes);

// Legacy/Compatibility routes (Optional: you can remove these if you update frontend)
// app.post("/signup", ...); // already handled in /api/auth/signup
// app.post("/login", ...); // already handled in /api/auth/login

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
