import { useEffect, useState, useId } from "react";
import axios from "@/lib/axios";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Square = ({
  className,
  children,
}) => (
  <span
    aria-hidden="true"
    className={cn(
      "flex size-5 items-center justify-center rounded bg-muted font-medium text-muted-foreground text-xs",
      className,
    )}
    data-square
  >
    {children}
  </span>
);

export default function AsigneeUser({ value, onChange }) {
  const id = useId();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignees = async () => {

      try {
        const res = await axios.get("/api/bugs/assignees/list");
        console.log(res.data)
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch assignees:", err);
      } finally {
        setLoading(false);
      }
    };


    fetchAssignees();
  }, []);

  return (
    <div className="">
      <Label>Assign TO</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className="ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_[data-square]]:shrink-0"
          id={id}
        >
          <SelectValue placeholder="Select assignee" />
        </SelectTrigger>
        <SelectContent className="[&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8">
          <SelectGroup>
            <SelectLabel className="ps-2">Team Members</SelectLabel>
            {loading ? (
              <SelectItem value="loading" disabled>Loading...</SelectItem>
            ) : users.length === 0 ? (
              <SelectItem value="none" disabled>No developers found</SelectItem>
            ) : (
              users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  <Square className="bg-indigo-400/20 text-indigo-500">
                    {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                  </Square>
                  <span className="truncate">{user.username || user.email}</span>
                </SelectItem>
              ))
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
