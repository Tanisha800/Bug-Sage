import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    // 1. Create a Team
    const team = await prisma.team.create({
        data: {
            name: "Bug Busters",
        },
    });

    console.log(`Created team: ${team.name} (${team.id})`);

    const password = await bcrypt.hash("password", 10);

    // 2. Create a Tester
    const tester = await prisma.user.upsert({
        where: { email: "tester@example.com" },
        update: {},
        create: {
            username: "Tester Tom",
            email: "tester@example.com",
            password,
            role: "TESTER",
            teamId: team.id,
        },
    });

    console.log(`Created user: ${tester.username} (${tester.role})`);

    // 3. Create a Developer
    const developer = await prisma.user.upsert({
        where: { email: "dev@example.com" },
        update: {},
        create: {
            username: "Developer Dave",
            email: "dev@example.com",
            password,
            role: "DEVELOPER",
            teamId: team.id,
        },
    });

    console.log(`Created user: ${developer.username} (${developer.role})`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
