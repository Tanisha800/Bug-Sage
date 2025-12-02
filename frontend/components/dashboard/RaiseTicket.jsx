"use client";

import { useId, useState } from "react";
import axios from "@/lib/axios";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AsigneeUser from "./AsigneeUser";
import { DatePicker } from "./DatePicker";
import { Textarea } from "../ui/textarea";
import ImageUploadModal from "./ImageUploadModal";
import PrioritySelect from "./PrioritySelect";

export default function RaiseTicket({ children }) {
  const id = useId();

  // dialog open/close
  const [open, setOpen] = useState(false);

  // form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [attachmentUrl, setAttachmentUrl] = useState(null);
  const [priority, setPriority] = useState("MEDIUM");
  const [submitting, setSubmitting] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!assigneeId) {
      alert("Please select an assignee");
      return;
    }

    try {
      setSubmitting(true);

      await axios.post(
        `/bugs`, // <-- yahan tumhara bug.js router mounted hai
        {
          title,
          description,
          assigneeId,
          dueDate,        // DatePicker se ISO string / Date aayega
          attachmentUrl,  // ImageUploadModal se URL / path aayega
          priority,
        },
        {
          withCredentials: true, // agar cookies / auth use ho raha ho
        }
      );

      // success: clear + close
      setTitle("");
      setDescription("");
      setAssigneeId(null);
      setDueDate(null);
      setAttachmentUrl(null);
      setPriority("MEDIUM");
      setOpen(false);
    } catch (err) {
      console.error("Failed to raise bug:", err);
      alert("Failed to raise bug. Check console for details.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="w-[75%] max-w-none">
        <div className="flex flex-col items-center gap-2">
          <DialogHeader>
            <DialogTitle className="sm:text-center">Raise a Bug</DialogTitle>
          </DialogHeader>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Title */}
            <div className="*:not-first:mt-2">
              <Label htmlFor={`${id}-title`}>Title</Label>
              <Input
                id={`${id}-title`}
                placeholder="Register issue here"
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="*:not-first:mt-2">
              <Label htmlFor={`${id}-desc`}>Issue Description</Label>
              <Textarea
                id={`${id}-desc`}
                placeholder="Explain the issue"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Assignee - all developers of team */}
            <div className="*:not-first:mt-2 flex justify-between items-center">
              {/* Assignee component should call onChange with selected developer id */}
              <AsigneeUser
                value={assigneeId}
                onChange={setAssigneeId}
              />
              <PrioritySelect
                className="!m-0"
                value={priority}
                onChange={setPriority}
              />
            </div>

            {/* Due date */}
            <div className="*:not-first:mt-2">
              <DatePicker
                value={dueDate}
                onChange={setDueDate}
              />
            </div>

            {/* Attachment / screenshot */}
            <div className="*:not-first:mt-2">
              <Label>Attachments</Label>
              <ImageUploadModal
                onUpload={setAttachmentUrl} // expect this to give URL / file path
              />
            </div>
          </div>

          <Button className="w-full" type="submit" disabled={submitting}>
            {submitting ? "Raising..." : "Raise Bug"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
