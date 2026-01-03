import prisma from "../config/prisma.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, username: true, email: true },
        });
        res.json(users);
    } catch (err) {
        console.error("getAllUsers error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
