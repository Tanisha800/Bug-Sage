import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import bugRouter from "./routes/bug.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import teamRoutes from "./routes/team.js";
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

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      /^https:\/\/bug-sage[a-zA-Z0-9._-]*\.vercel\.app$/.test(origin)
    ) {
      return callback(null, true);
    }
    return callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "Pragma", "Accept", "X-Requested-With"],
  credentials: true,
};

// ✅ OPTIONS must come FIRST, before everything else
app.options((".*"), cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => res.send("Bug-Sage API is running..."));

app.use("/api/auth", authRouter);

app.use(authenticateMiddleware);
app.use("/api/users", userRouter);
app.use("/api/bugs", bugRouter);
app.use("/api/team", teamRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));