
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    const email = "testuser@example.com";
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.upsert({
            where: { email },
            update: { password: hashedPassword }, // update password if exists
            create: {
                email,
                username: "Test User",
                password: hashedPassword,
                role: "TESTER",
            },
        });
        console.log("User created/updated:", user);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
