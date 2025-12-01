"use client";

import { useEffect, useState } from "react";
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/components/kibo-ui/kanban";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusIcon } from "lucide-react";
// import TaskModal from "./TaskModal";
// import { OrbitalLoader } from "../ui/orbital-loader";
// import TaskUpdateModal from "./TaskUpdateModal";

const columns = [
  { id: "Backlog", name: "Backlog", color: "#3B82F6", shadow: "rgba(59, 130, 246, 0.1)" },
  { id: "In Progress", name: "In Progress", color: "#F59E0B", shadow: "rgba(255,193,7,0.1)" },
  { id: "Testing", name: "Testing", color: "#A490F8", shadow: "rgba(16,185,129,0.1)" },
  { id: "Resolved", name: "Resolved", color: "#10B981", shadow: "rgba(16,185,129,0.1)" }
];


const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
const shortDateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

export default function Kanban() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
const [defaultStatus, setDefaultStatus] = useState("todo");
const [updateModalOpen, setUpdateModalOpen] = useState(false);
const [selectedTask, setSelectedTask] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;


  // ✅ Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_URL}/api/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          const formatted = data.tasks.map((t) => ({
            id: t.id,
            name: t.title,
            column: t.status, // should match column id
            startAt: new Date(t.startAt),
            endAt: new Date(t.endAt),
            owner: t.owner ? { name: t.owner.name, image: "/default.png" } : null,
          }));
          setFeatures(formatted);
        } else {
          console.error("Error fetching tasks:", data.error);
        }
      } catch (err) {
        console.error("Error fetching:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // ✅ Detect drag/drop column change
 // inside your Kanban page/component
 const handleDataChange = async (newData, meta) => {
  setFeatures(newData);
  const { movedItem, fromColumnId, toColumnId } = meta;

  if (fromColumnId === toColumnId) {
    return;
  }

  const refreshTasks = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/api/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (res.ok) {
    const formatted = data.tasks.map((t) => ({
      id: t.id,
      name: t.title,
      column: t.status,
      startAt: new Date(t.startAt),
      endAt: new Date(t.endAt),
    }));

    setFeatures(formatted);
  }
};



  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/tasks/${movedItem.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: toColumnId }),
    });

  } catch (err) {
    console.error("Error calling backend:", err);
  }
};
const refreshTasks = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/api/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (res.ok) {
    const formatted = data.tasks.map((t) => ({
      id: t.id,
      name: t.title,
      column: t.status,
      startAt: new Date(t.startAt),
      endAt: new Date(t.endAt),
    }));

    setFeatures(formatted);
  }
};


  // ✅ Add new task
  const handleAddTask = async (columnId) => {
    const token = localStorage.getItem("token");
    const newTask = {
      title: "New Task",
      status: columnId,
      startAt: new Date(),
      endAt: new Date(),
    };

    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });
      const data = await res.json();
      if (res.ok) {
        setFeatures((prev) => [
          ...prev,
          {
            id: data.id,
            name: data.title,
            column: data.status,
            startAt: new Date(data.startAt),
            endAt: new Date(data.endAt),
          },
        ]);
      }
    } catch (err) {
      console.error("Error adding:", err);
    }
  };

  if (loading) {
    return <div className="flex h-screen justify-center items-center">Loading...</div>;
  }

  return (<>
    <KanbanProvider columns={columns} data={features} onDataChange={handleDataChange}>
      {(column) => (
        <KanbanBoard id={column.id} key={column.id} shadowColor={column.shadow}>
          <KanbanHeader>
            <div className="flex items-center justify-between pr-1">
              <div className="flex items-center gap-2 py-2 px-1">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: column.color }} />
                <span>{column.name}</span>
              </div>
              
            </div>
          </KanbanHeader>

          <KanbanCards id={column.id}>
            {(feature) => (
              <KanbanCard
                column={column.id}
                id={feature.id}
                key={feature.id}
                name={feature.name}
                onClick={() => {
                  setSelectedTask(feature);
                  setUpdateModalOpen(true);
                  console.log(updateModalOpen)
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <p className="m-0 flex-1 font-medium text-sm">{feature.name}</p>
                  </div>
                  {feature.owner && (
                    <Avatar className="h-4 w-4 shrink-0">
                      <AvatarImage src={feature.owner.image} />
                      <AvatarFallback>{feature.owner.name?.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <p className="m-0 text-muted-foreground text-xs">
                  {shortDateFormatter.format(feature.startAt)} -{" "}
                  {dateFormatter.format(feature.endAt)}
                </p>
              </KanbanCard>
            )}
          </KanbanCards>
        </KanbanBoard>
      )}
    </KanbanProvider>
    
    </>
  );
}