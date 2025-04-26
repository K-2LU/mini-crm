"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiUrl } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { log } from "console";

const reminderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  dueDate: z.string().min(1, "Due date is required"),
  description: z.string().min(1, "Description is required"),
  completed: z.boolean().optional(),
});

type ReminderFormValues = z.infer<typeof reminderSchema>;

interface ReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reminder?: {
    id: string;
    title: string;
    dueDate: string;
    description: string;
    completed: boolean;
    clientId?: string;
    projectId?: string;
    createdAt?: string;
  } | null;
  onReminderSaved?: (reminder: any, isEdit: boolean) => void;
}

export function ReminderDialog({ open, onOpenChange, reminder, onReminderSaved }: ReminderDialogProps) {
  const form = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      title: reminder?.title || "",
      dueDate: reminder ? reminder.dueDate.split("T")[0] : "",
      description: reminder?.description || "",
      completed: reminder?.completed ?? false,
    },
  });

  const onSubmit = async (data: ReminderFormValues) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");
      let response;
      let savedReminder;
      if (reminder) {
        // update existing reminder
        response = await fetch(apiUrl(`/reminders/${reminder.id}`), {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          console.log(errData);
          throw new Error(errData.error || response.statusText);
        }
        savedReminder = { ...reminder, ...data };
        if (onReminderSaved) onReminderSaved(savedReminder, true);
      } else {
        // create a new reminder
        response = await fetch(apiUrl('/reminders'), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || response.statusText);
        }
        savedReminder = await response.json();
        if (onReminderSaved) onReminderSaved(savedReminder, false);
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error saving reminder:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{reminder ? "Edit Reminder" : "Add Reminder"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Reminder title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Reminder description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="completed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <select
                      className="w-full border rounded px-2 py-1"
                      value={field.value ? "true" : "false"}
                      onChange={e => field.onChange(e.target.value === "true")}
                    >
                      <option value="false">Pending</option>
                      <option value="true">Completed</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {reminder ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

