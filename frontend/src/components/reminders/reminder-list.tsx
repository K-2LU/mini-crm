"use client";

import { useState } from "react";
import { apiUrl } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ReminderDialog } from "./reminder-dialog";

export interface Reminder {
  id: string;
  title: string;
  dueDate: string;
  description: string;
  completed: boolean;
  clientId?: string;
  projectId?: string;
  createdAt?: string;
}

interface ReminderListProps {
  reminders: Reminder[];
  loading: boolean;
  error: string | null;
  fetchReminders: () => void;
}

export function ReminderList({ reminders, loading, error, fetchReminders }: ReminderListProps) {
  const [localError, setLocalError] = useState<string | null>(null);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEdit = (reminder: Reminder) => {
    setSelectedReminder(reminder);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");
      const res = await fetch(apiUrl(`/reminders/${id}`), {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || res.statusText);
      }
      fetchReminders();
    } catch (err: any) {
      setLocalError(err.message || "Failed to delete reminder");
    }
  };

  return (
    <>
      <div className="rounded-md border">
        {loading ? (
          <div className="p-4">Loading...</div>
        ) : (localError || error) ? (
          <div className="p-4 text-red-600">{localError || error}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reminders.map((reminder) => (
                <TableRow key={reminder.id}>
                  <TableCell>{reminder.title}</TableCell>
                  <TableCell>{reminder.dueDate.split("T")[0]}</TableCell>
                  <TableCell>{reminder.description}</TableCell>
                  <TableCell>{reminder.completed ? "Completed" : "Pending"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(reminder)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(reminder.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      <ReminderDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        reminder={selectedReminder}
        onReminderSaved={() => {
          fetchReminders();
          setIsDialogOpen(false);
          setSelectedReminder(null);
        }}
      />
    </>
  );
}
