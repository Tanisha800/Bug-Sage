"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/components/kibo-ui/kanban";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import UpdateBug from "./UpdateBug";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { se } from "date-fns/locale";

// Updated columns to match BugStatus enum
const columns = [
  { id: "BACKLOG", name: "Backlog", color: "#3B82F6", shadow: "rgba(59, 130, 246, 0.1)" },
  { id: "TESTER", name: "Testing", color: "#F59E0B", shadow: "rgba(245, 158, 11, 0.1)" },
  { id: "IN_PROGRESS", name: "In Progress", color: "#A490F8", shadow: "rgba(164, 144, 248, 0.1)" },
  { id: "RESOLVED", name: "Resolved", color: "#10B981", shadow: "rgba(16, 185, 129, 0.1)" }
];

const dateFormatter = new Intl.DateTimeFormat("en-US", { 
  month: "short", 
  day: "numeric", 
  year: "numeric" 
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", { 
  month: "short", 
  day: "numeric" 
});

// Priority badge colors
const priorityColors = {
  LOW: "bg-blue-100 text-blue-800 border-blue-200",
  MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-200",
  HIGH: "bg-red-100 text-red-800 border-red-200",
};

export default function BugKanban() {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedBug, setSelectedBug] = useState(null);

  // ✅ Fetch bugs assigned to logged-in developer
  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const res = await axios.get("/api/kanban");
        const data = res.data;
        
        const formatted = data.bugs.map((bug) => ({
          id: bug.id,
          name: bug.title,
          description: bug.description,
          column: bug.status, // BACKLOG, PENDING, IN_PROGRESS, RESOLVED
          priority: bug.priority,
          startAt: new Date(bug.startAt),
          endAt: new Date(bug.endAt),
          owner: bug.owner ? { 
            name: bug.owner.name, 
            image: bug.owner.image || "/default.png" 
          } : null,
          reporter: bug.reporter,
          team: bug.team,
        }));
        
        setBugs(formatted);
      } catch (err) {
        console.error("Error fetching bugs:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBugs();
  }, []);

  // ✅ Handle drag/drop status change
  const handleDataChange = async (newData, meta) => {
    setBugs(newData);
    const { movedItem, fromColumnId, toColumnId } = meta;

    if (fromColumnId === toColumnId) {
      return;
    }

    try {
      await axios.put(`/api/kanban/${movedItem.id}`, { status: toColumnId });
    } catch (err) {
      console.error("Error updating bug status:", err);
      // Optionally: revert the change on error
      // fetchBugs();
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <div className="text-lg">Loading bugs...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-3 md:p-6">
      

      <KanbanProvider 
        columns={columns} 
        data={bugs} 
        onDataChange={handleDataChange}
      >
        {(column) => (
          <KanbanBoard 
            id={column.id} 
            key={column.id} 
            shadowColor={column.shadow}
          >
            <KanbanHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full" 
                    style={{ backgroundColor: column.color }} 
                  />
                  <span className="font-semibold text-sm md:text-base">{column.name}</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    ({bugs.filter(b => b.column === column.id).length})
                  </span>
                </div>
              </div>
            </KanbanHeader>
            
            <KanbanCards id={column.id}>
              {(bug) => (
                <KanbanCard
                  column={column.id}
                  id={bug.id}
                  key={bug.id}
                  name={bug.name}
                  onClick={() => {
                    setSelectedBug(bug);
                    setUpdateModalOpen(true);
                  }}
                >
                  <div className="flex flex-col gap-2 md:gap-2.5 w-full">
                    {/* Title and Avatar */}
                    <div className="flex items-start justify-between gap-2">
                      <p className="m-0 flex-1 font-semibold text-xs md:text-sm line-clamp-2">
                        {bug.name}
                      </p>
                      {bug.owner && (
                        <Avatar className="h-5 w-5 md:h-6 md:w-6 shrink-0">
                          <AvatarImage src={bug.owner.image} />
                          <AvatarFallback className="text-[10px] md:text-xs">
                            {bug.owner.name?.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>

                    {/* Description (if exists) - Hide on very small screens */}
                    {bug.description && (
                      <p className="m-0 text-[10px] md:text-xs text-muted-foreground line-clamp-2">
                        {bug.description}
                      </p>
                    )}

                    {/* Priority Badge */}
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 ${priorityColors[bug.priority]}`}
                      >
                        {bug.priority}
                      </Badge>
                    </div>

                    {/* Dates */}
                    <div className="flex items-center justify-between pt-1 border-t">
                      <p className="m-0 text-muted-foreground text-[10px] md:text-xs">
                        {shortDateFormatter.format(bug.startAt)}
                      </p>
                    </div>

                    {/* Reporter - Hide on mobile to save space */}
                    {bug.reporter && (
                      <p className="m-0 text-muted-foreground text-[10px] md:text-xs hidden sm:block">
                        <span className="font-medium">Reporter:</span> {bug.reporter}
                      </p>
                    )}
                  </div>
                </KanbanCard>
                
              )}
            </KanbanCards>
          </KanbanBoard>
        )}
      </KanbanProvider>

{selectedBug && (
  <Dialog
    open={updateModalOpen}
    onOpenChange={(open) => {
      setUpdateModalOpen(open);
      console.log(selectedBug);
      if (!open) {
        setSelectedBug(null);
      }
    }}
    
  >
    <DialogContent className="max-w-lg md:max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-start justify-between gap-2 w-140">
          <span className="text-base md:text-lg font-semibold">
            {selectedBug.name}
          </span>
          {selectedBug.priority && (
            <Badge
              variant="outline"
              className={`text-[10px] md:text-xs px-2 py-0.5 ${priorityColors[selectedBug.priority]}`}
            >
              {selectedBug.priority}
            </Badge>
          )}
        </DialogTitle>

        <DialogDescription className="text-xs md:text-sm text-muted-foreground">
          Detailed view of the bug and its meta information.
        </DialogDescription>
      </DialogHeader>

      <div className="mt-3 md:mt-4 flex flex-col gap-4">
        {/* Top meta section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Owner / Reporter */}
          <div className="flex flex-col gap-2">
            {selectedBug.owner && (
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedBug.owner.image} />
                  <AvatarFallback>
                    {selectedBug.owner.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Assignee</span>
                  <span className="text-sm font-medium">
                    {selectedBug.owner.name}
                  </span>
                </div>
              </div>
            )}

            {selectedBug.reporter && (
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">
                  Reporter
                </span>
                <span className="text-sm font-medium">
                  {selectedBug.reporter}
                </span>
              </div>
            )}

            {selectedBug.team && (
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">
                  Team
                </span>
                <span className="text-sm font-medium">
                  {selectedBug.team}
                </span>
              </div>
            )}
          </div>

          {/* Status & Dates */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">
                Status
              </span>
              <span className="text-sm font-medium">
                {
                  columns.find((col) => col.id === selectedBug.column)
                    ?.name || selectedBug.column
                }
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">
                Start date
              </span>
              <span className="text-sm font-medium">
                {selectedBug.startAt
                  ? dateFormatter.format(selectedBug.startAt)
                  : "-"}
              </span>
            </div>

            
          </div>
        </div>

        {/* Description */}
        {selectedBug.description && (
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">
              Description
            </span>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {selectedBug.description}
            </p>
          </div>
        )}

        {/* Update section (optional: use your UpdateBug component) */}
        {/*
          Yaha tum apna existing UpdateBug component use kar sakti ho.
          Main assume kar raha hoon ki ye props `bug` & `onClose` leta hoga.
          Agar signature different hai to bas yaha adjust kar lena.
        */}
        <div className="border-t pt-3 md:pt-4">
          
        </div>
      </div>
    </DialogContent>
  </Dialog>
)}
    </div>
  );
}