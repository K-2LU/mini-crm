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
import { LogDialog } from "./log-dialog";

export interface Log {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  type: string;
  notes: string;
}

interface LogListProps {
  logs: Log[];
  clients: { id: string; name: string }[];
  loading: boolean;
  error: string | null;
  fetchLogs: () => void;
}



export function LogList({ logs, clients, loading, error, fetchLogs }: LogListProps) {
  const [localError, setLocalError] = useState<string | null>(null);
const [selectedLog, setSelectedLog] = useState<Log | null>(null);
const [isDialogOpen, setIsDialogOpen] = useState(false);

const handleEdit = (log: Log) => {
  setSelectedLog(log);
  setIsDialogOpen(true);
};

const handleDelete = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");
    const res = await fetch(apiUrl(`/logs/${id}`), {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || res.statusText);
    }
    fetchLogs();
  } catch (err: any) {
    setLocalError(err.message || "Failed to delete log");
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
    <TableHead>Date</TableHead>
    <TableHead>Type</TableHead>
    <TableHead>Client</TableHead>
    <TableHead>Notes</TableHead>
    <TableHead className="w-[100px]">Actions</TableHead>
  </TableRow>
</TableHeader>
<TableBody>
  {logs.map((log) => (
    <TableRow key={log.id}>
      <TableCell>{log.date.split("T")[0]}</TableCell>
      <TableCell>{log.type}</TableCell>
      <TableCell>{log.clientName}</TableCell>
      <TableCell>{log.notes}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(log)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-700"
            onClick={() => handleDelete(log.id)}
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
      <LogDialog
  open={isDialogOpen}
  onOpenChange={(open) => {
    setIsDialogOpen(open);
    if (!open) setSelectedLog(null);
  }}
  clients={clients}
  log={selectedLog}
  onLogSaved={() => {
    fetchLogs();
    setIsDialogOpen(false);
    setSelectedLog(null);
  }}
/>
    </>
  );
}
