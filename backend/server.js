// server.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";
import taskRouter from "./routes/tasks.js";
import bugRouter from "./routes/bug.js"
import authenticateMiddleware from "./middleware.js";
import authUserRouter from "./routes/auth.js";
import jointeamRoutes from "./routes/joinTeam.js";
import teamRoutes from "./routes/team.js";
import kanbanRouter from "./routes/kanban.js";


// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
app.use(express.json());
app.use(cors({
  origin: ["https://bug-sage-three.vercel.app", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use('/api/team', teamRoutes);
app.use("/api/jointeams", jointeamRoutes);
app.use("/api/kanban", kanbanRouter);

app.get("/", (req, res) => {
  res.send("🚀 Server is running with Prisma + MongoDB + JWT!");
});
app.use("/tasks", taskRouter);

// Initialize Prisma Client
const prisma = new PrismaClient();

// JWT Secret key (keep it safe in .env)
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123";

// ✅ Test route


app.use("/api/auth", authUserRouter);

// 🧾 SIGNUP (Register)
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { email }
    },
    );

    if (existingUser) {
      return res.status(400).json({ error: "email already exists." });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await prisma.user.create({
      data: { username, email, password: hashedPassword, role },
    });

    // Create JWT token with role and teamId
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, teamId: newUser.teamId },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User created successfully!",
      token,
      user: { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// 🔐 LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Compare passwords
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Create token with role and teamId
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, teamId: user.teamId },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login successful!", token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(403).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}



app.get("/users", verifyToken, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, username: true, email: true },
    });
    res.json(users);
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.use(authenticateMiddleware)

app.use("/bugs", bugRouter);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
