// middleware.js
import jwt from "jsonwebtoken";

export default function authenticateMiddleware(req, res, next) {
    try {
        // Header se token nikaalo
        const authHeader =
            req.headers.authorization || req.headers.Authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];

        // Token verify karo - Use env variable with fallback
        const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123";
        const decoded = jwt.verify(token, JWT_SECRET);

        // Yaha pe req.user set karo
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            teamId: decoded.teamId,
        };

        next();
    } catch (err) {
        console.error("JWT error:", err.message);
        return res.status(401).json({ message: "Unauthorized" });
    }
}
