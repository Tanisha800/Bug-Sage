import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export function AnimatedTestimonialsDemo() {
  const testimonials = [
    {
      quote:
        "BugPilot AI cut our bug triage time by half. The AI classification and auto-fix suggestions are shockingly accurate — it feels like having an extra engineer on the team.",
      name: "Aarav Mehta",
      designation: "Backend Lead at CodeNest",
      src: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
    {
      quote:
        "Our QA team now reports bugs in seconds, and the system automatically assigns them to the right developer. The AI insight dashboard is a total game-changer.",
      name: "Sofia Patel",
      designation: "QA Manager at DevBridge",
      src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
    {
      quote:
        "Before BugPilot, managing hundreds of issues across projects was chaos. Now we have a clear Kanban view and intelligent severity tracking — our sprint velocity improved by 40%.",
      name: "Rahul Sharma",
      designation: "Product Manager at AppVerse",
      src: "https://images.unsplash.com/photo-1614289371518-722f2615943d?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
    {
      quote:
        "The duplicate bug detection alone saves us hours every week. It’s like having an assistant that reads all past tickets and knows exactly what’s been fixed before.",
      name: "Isabella Rossi",
      designation: "Frontend Developer at PixelWorks",
      src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
    {
      quote:
        "We integrated BugPilot into our workflow in one afternoon. The AI-powered analytics now help us identify which modules cause most crashes — data we never had before.",
      name: "Liam Carter",
      designation: "CTO at NovaStack",
      src: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
  ];

  return (
    <section className="py-16 bg-background text-center">
      <h2 className="text-5xl font-bold mb-8 tracking-tight">
        What Our Customer Says
      </h2>
      <AnimatedTestimonials testimonials={testimonials} />
    </section>
  );
}
