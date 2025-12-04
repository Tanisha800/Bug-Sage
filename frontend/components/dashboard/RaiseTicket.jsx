"use client";

import { useId, useState, useEffect } from "react";
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

export default function RaiseTicket({ children, onSuccess }) {
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

  // Debug: Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.log('🔍 Auth Check:', {
      hasToken: !!token,
      hasUser: !!user,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'none'
    });

    if (!token) {
      console.warn('⚠️ No authentication token found. User needs to login.');
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!assigneeId) {
      alert("Please select an assignee");
      return;
    }

    // Debug: Log form data
    console.log('📝 Form Data:', {
      title,
      description,
      assigneeId,
      dueDate,
      attachmentUrl,
      priority
    });

    // Check authentication before submitting
    const token = localStorage.getItem('token');
    if (!token) {
      alert("You must be logged in to create a bug");
      return;
    }

    try {
      setSubmitting(true);

      console.log('🚀 Submitting bug to /bugs endpoint...');

      const response = await axios.post('/api/kanban', {
        title,
        description,
        assigneeId,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        attachmentUrl: attachmentUrl || null,
        priority,
      });

      console.log('✅ Bug created successfully:', response.data);

      // Show success message
      alert('Bug raised successfully!');

      // Clear form
      setTitle("");
      setDescription("");
      setAssigneeId(null);
      setDueDate(null);
      setAttachmentUrl(null);
      setPriority("MEDIUM");
      
      // Close dialog
      setOpen(false);

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(response.data.bug);
      }

    } catch (err) {
      console.error("❌ Failed to raise bug:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });

      // Show user-friendly error message
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          'Failed to raise bug. Please try again.';
      
      alert(errorMessage);

      // If unauthorized, suggest login
      if (err.response?.status === 401) {
        alert('Please login again to continue');
        // Optionally redirect to login
        // window.location.href = '/login';
      }
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
                onUpload={setAttachmentUrl}
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