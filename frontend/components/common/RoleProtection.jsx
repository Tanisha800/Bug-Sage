"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RoleProtection({ children, requiredRole }) {
    const router = useRouter();

    useEffect(() => {
        const user = localStorage.getItem("user");

        if (!user) {
            // No user, redirect to login
            router.push("/login");
            return;
        }

        try {
            const parsedUser = JSON.parse(user);

            // Check if user role matches required role
            if (parsedUser.role !== requiredRole) {
                // Redirect to correct dashboard based on their actual role
                if (parsedUser.role === "TESTER") {
                    router.push("/dashboard-tester");
                } else if (parsedUser.role === "DEVELOPER") {
                    router.push("/dashboard-developer");
                }
            }
        } catch (error) {
            console.error("Error parsing user data:", error);
            router.push("/login");
        }
    }, [requiredRole, router]);

    return <>{children}</>;
}
