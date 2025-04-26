"use client";

import { useState, useEffect } from "react";
import { ReminderList } from "@/components/reminders/reminder-list";
import { ReminderDialog } from "@/components/reminders/reminder-dialog";
import { Button } from "@/components/ui/button";
import { apiUrl } from "@/lib/api";

export default function RemindersPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReminders = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");
      const res = await fetch(apiUrl('/reminders'), {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || res.statusText);
      }
      const data = await res.json();
      setReminders(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch clients");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Reminders</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Add Reminder
        </Button>
      </div>
      <ReminderList reminders={reminders} loading={loading} error={error} fetchReminders={fetchReminders} />
      <ReminderDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onReminderSaved={() => fetchReminders()}
      />
    </div>
  );
}
