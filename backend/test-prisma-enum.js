import { Prisma, BugStatus } from "@prisma/client";

console.log("Top-level BugStatus export:", BugStatus);
console.log("Prisma object keys (just to see):", Object.keys(Prisma));
