import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import data from "./data.json"
import BugViewer from "@/components/dashboard/BugViewer"
import JoinTeam from "@/components/dashboard/JoinTeam"
import { SectionCards } from "@/components/ui/section-cards"

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />

          <JoinTeam />

        </div>
      </div>
    </div>
  );
}
