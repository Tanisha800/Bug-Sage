import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
const JWT_SECRET = process.env.JWT_SECRET;

export const signup = async (req, res) => {
    const testerDummyBugs = [
        {
            title: "Login fails with valid credentials",
            description: "User cannot login despite correct email and password",
            priority: "HIGH",
            status: "BACKLOG"
        },
        {
            title: "Broken layout on Safari",
            description: "Header overlaps content on Safari browser",
            priority: "MEDIUM",
            status: "TESTING"
        }
    ]
    const developerDummyBugs = [
        {
            title: "Fix API timeout issue",
            description: "Orders API times out under heavy load",
            priority: "HIGH",
            status: "IN_PROGRESS"
        },
        {
            title: "Resolve notification crash",
            description: "App crashes when sending push notifications",
            priority: "MEDIUM",
            status: "BACKLOG"
        }
    ]
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: { username, email, password: hashedPassword, role },
        });



        const token = jwt.sign(
            {
                id: newUser.id,
                email: newUser.email,
                role: newUser.role,
                teamId: newUser.teamId,
            },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 2️⃣ Find required users
        const developer = await prisma.user.findFirst({
            where: { role: "DEVELOPER" }
        })
        console.log('devloper', developer)

        const tester = await prisma.user.findFirst({
            where: { role: "TESTER" }
        })
        console.log('tester', tester)

        const team = await prisma.team.findFirst()
        console.log('team', team)

        // 3️⃣ TESTER signup → create reported bugs
        if (newUser.role === "TESTER" && developer) {
            await prisma.bug.createMany({
                data: testerDummyBugs.map(bug => ({
                    ...bug,
                    reporterId: newUser.id,
                    assigneeId: developer.id,
                    teamId: team?.id || null
                }))
            })
        }
        console.log('reported bugs', testerDummyBugs)

        // 4️⃣ DEVELOPER signup → create assigned bugs
        if (newUser.role === "DEVELOPER" && tester) {
            await prisma.bug.createMany({
                data: developerDummyBugs.map(bug => ({
                    ...bug,
                    reporterId: tester.id,
                    assigneeId: newUser.id,
                    teamId: team?.id || null
                }))
            })
        }
        console.log('assigned bugs', developerDummyBugs)
        res.status(201).json({ token, user: newUser });
    }



    catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                teamId: user.teamId,
            },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ token, user });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMe = async (req, res) => {
    try {
        const tokenHeader = req.headers.authorization;
        if (!tokenHeader)
            return res.status(401).json({ error: "No token provided" });

        const token = tokenHeader.split(" ")[1];

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);
    } catch (err) {
        console.error("getMe error:", err);
        res.status(500).json({ error: "Server error" });
    }
};
