"use client";

import { useState, useEffect } from "react";
import { LogList } from "@/components/logs/log-list";
import { LogDialog } from "@/components/logs/log-dialog";
import { Button } from "@/components/ui/button";
import { apiUrl } from "@/lib/api";

export default function LogsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
const [logs, setLogs] = useState([]);
const [clients, setClients] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

const fetchLogs = async () => {
  setLoading(true);
  setError(null);
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");
    const [logsRes, clientsRes] = await Promise.all([
      fetch(apiUrl('/logs'), {
        headers: { "Authorization": `Bearer ${token}` },
      }),
      fetch(apiUrl('/clients'), {
        headers: { "Authorization": `Bearer ${token}` },
      }),
    ]);
    if (!logsRes.ok) throw new Error("Failed to fetch logs");
    if (!clientsRes.ok) throw new Error("Failed to fetch clients");
    const logsData = await logsRes.json();
    const clientsData = await clientsRes.json();
    setLogs(logsData);
    setClients(clientsData.map((c: any) => ({ id: c.id, name: c.name })));
  } catch (err: any) {
    setError(err.message || "Failed to fetch data");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
  fetchLogs();
  
}, []);

return (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold">Interaction Logs</h1>
      <Button onClick={() => setIsCreateDialogOpen(true)}>
        Add Log
      </Button>
    </div>
    <LogList
      logs={logs}
      clients={clients}
      loading={loading}
      error={error}
      fetchLogs={fetchLogs}
    />
    <LogDialog
      open={isCreateDialogOpen}
      onOpenChange={setIsCreateDialogOpen}
      clients={clients}
      onLogSaved={() => fetchLogs()}
    />
  </div>
);
}
