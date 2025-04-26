"use client";

import { useEffect } from "react";
import { apiUrl } from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

import type { Log } from "./log-list";

const logSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  date: z.string().min(1, "Date is required"),
  type: z.string().min(1, "Type is required"),
  notes: z.string().min(1, "Notes are required"),
});

type LogFormValues = z.infer<typeof logSchema>;

interface LogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: { id: string; name: string }[];
  onLogSaved: () => void;
  log?: Log | null;
}

export function LogDialog({ open, onOpenChange, clients, onLogSaved, log }: LogDialogProps) {
  const form = useForm<LogFormValues>({
    resolver: zodResolver(logSchema),
    defaultValues: {
      clientId: log?.clientId || clients[0]?.id || "",
      date: log ? log.date.split("T")[0] : "",
      type: log?.type || "",
      notes: log?.notes || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        clientId: log?.clientId || clients[0]?.id || "",
        date: log ? log.date.split("T")[0] : "",
        type: log?.type || "",
        notes: log?.notes || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, log, clients]);

  const onSubmit = async (data: LogFormValues) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");
      const method = log ? "PUT" : "POST";
      const url = log ? apiUrl(`/logs/${log.id}`) : apiUrl('/logs');
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || res.statusText);
      }
      onLogSaved();
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      form.setError("clientId", { message: error.message || "Failed to save log" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{log ? "Edit Interaction Log" : "Add Interaction Log"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <FormControl>
                    <select className="w-full border rounded px-2 py-1" {...field} required>
                      <option value="">Select client</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>{client.name}</option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interaction Type</FormLabel>
                  <FormControl>
                    <select className="w-full border rounded px-2 py-1" {...field} required>
                      <option value="">Select type</option>
                      <option value="Call">Call</option>
                      <option value="Meeting">Meeting</option>
                      <option value="Email">Email</option>
                      <option value="Other">Other</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Enter notes" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {log ? "Save Changes" : "Add Log"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
