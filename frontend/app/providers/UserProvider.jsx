"use client";

import { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext(null);

export function useUser() {
  return useContext(UserContext);
}

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  useEffect(() => {
    console.log("🔄 UserProvider mounted");

    if (typeof window === "undefined") {
      console.log("❌ Window undefined — skipping fetch");
      return;
    }

    const token = localStorage.getItem("token");
    console.log("📌 Token from localStorage:", token);

    if (!token) {
      console.log("⚠️ No token found, setting loading false");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    console.log(`🌐 Fetching user from: ${API_URL}/api/auth/me`);

    fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        console.log("📥 Response status:", res.status);

        const text = await res.text();
        console.log("📦 Raw response text:", text);

        if (!res.ok) {
          console.log("❌ Response not OK");
          throw new Error("Failed to fetch user");
        }

        const data = JSON.parse(text);
        console.log("✅ Parsed user data:", data);

        setUser(data);
      })
      .catch((err) => {
        console.log("❌ Error fetching /me:", err);
        setUser(null);
        // localStorage.removeItem("token");
      })
      .finally(() => {
        console.log("⏳ Done fetching user. Loading false.");
        setLoading(false);
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, API_URL }}>
      {children}
    </UserContext.Provider>
  );
}
