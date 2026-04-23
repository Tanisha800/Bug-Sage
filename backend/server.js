import express from "express";
import dotenv from "dotenv";

// Routes
import bugRouter from "./routes/bug.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import teamRoutes from "./routes/team.js";

// Middleware
import authenticateMiddleware from "./middleware/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

const allowedOrigins = [
  "https://bug-sage-three.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "http://127.0.0.1:3002",
];

// Manual CORS — works with Express v5, no wildcard issues
app.use((req, res, next) => {
  const origin = req.headers.origin;

  const isAllowed =
    !origin ||
    allowedOrigins.includes(origin) ||
    /^https:\/\/bug-sage[a-zA-Z0-9._-]*\.vercel\.app$/.test(origin);

  if (origin && isAllowed) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,PATCH,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,Authorization,Cache-Control,Pragma,Accept,X-Requested-With"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight immediately — no 404
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
});

app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});