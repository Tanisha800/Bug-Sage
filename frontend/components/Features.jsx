import { LayoutDashboard, Bug, Brain } from "lucide-react";
import { Feature108 } from "./blocks/shadcnblocks-com-feature108";

const demoData = {
  badge: "BugSage AI",
  heading: "AI-Powered Bug Tracking & Project Management",
  description:
    "Ship faster and smarter with automated bug triage, AI fix suggestions, and seamless team collaboration.",
  tabs: [
    {
      value: "tab-1",
      icon: <Bug className="h-auto w-4 shrink-0" />,
      label: "Smart Bug Detection",
      content: {
        badge: "AI-Powered Insights",
        title: "Report bugs that fix themselves",
        description:
          "Automatically classify bugs by category and severity. Get instant AI suggestions to identify the root cause and possible fix — no more hours of guesswork.",
        buttonText: "Try Bug Reporting",
        imageSrc:
          "https://www.shadcnblocks.com/images/block/placeholder-dark-1.svg",
        imageAlt: "AI Bug Detection",
      },
    },
    {
      value: "tab-2",
      icon: <Brain className="h-auto w-4 shrink-0" />,
      label: "AI Productivity",
      content: {
        badge: "Intelligent Workflow",
        title: "Let AI handle the boring stuff.",
        description:
          "From auto-assigning developers to detecting duplicate issues — BugPilot’s AI learns your workflow and optimizes bug management so your team can focus on what matters: coding.",
        buttonText: "See AI Features",
        imageSrc:
          "https://www.shadcnblocks.com/images/block/placeholder-dark-2.svg",
        imageAlt: "AI Workflow",
      },
    },
    {
      value: "tab-3",
      icon: <LayoutDashboard className="h-auto w-4 shrink-0" />,
      label: "Project Dashboards",
      content: {
        badge: "Analytics & Collaboration",
        title: "Stay on top of every project.",
        description:
          "Visualize bugs across projects with Kanban boards, real-time analytics, and role-based dashboards. Track progress, assign tasks, and make data-driven decisions instantly.",
        buttonText: "View Dashboard",
        imageSrc:
          "https://www.shadcnblocks.com/images/block/placeholder-dark-3.svg",
        imageAlt: "Project Dashboard",
      },
    },
  ],
};

function Features() {
  return <Feature108 {...demoData} />;
}

export { Features };
