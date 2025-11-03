"use client"
import { FloatingNavbar } from "@/components/navbar";
import Orb from "@/components/Orb";
import { PricingBasic } from "@/components/Plan";
import { useTheme } from "next-themes";

export default function Home() {
  const { theme, setTheme,resolvedTheme } = useTheme();

  console.log("Theme:", theme, "Resolved:", resolvedTheme);

  if (!theme) return <p>Loading theme...</p>;
  console.log("Theme:", theme, "Resolved:", resolvedTheme);
  return (
    <div>
      <FloatingNavbar/>
      <Orb></Orb>
      <PricingBasic/>

      <div className="w-20 h-20 bg-amber-300 dark:bg-amber-700"></div>
      <div
      className="min-h-screen flex flex-col items-center justify-center 
                 bg-card 
                 text-black dark:text-white 
                 transition-colors duration-300"
    >
      <h1 className="text-3xl font-bold mb-4">Theme Test</h1>
      <p className="mb-4">Current Theme: {theme}</p>
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="bg-amber-400 text-black px-4 py-2 rounded"
      >
        Toggle Theme
      </button>
    </div>
    </div>
  );
}
