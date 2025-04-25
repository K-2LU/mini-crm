"use client";

import { useState, useEffect } from "react";
import { ClientList } from "@/components/clients/client-list";
import { ClientDialog } from "@/components/clients/client-dialog";
import { Button } from "@/components/ui/button";

export default function ClientsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");
      const res = await fetch("http://localhost:5000/api/clients", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || res.statusText);
      }
      const data = await res.json();
      setClients(data);
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
    fetchClients();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Clients</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Add Client
        </Button>
      </div>
      <ClientList clients={clients} loading={loading} error={error} fetchClients={fetchClients} />
      <ClientDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onClientSaved={() => fetchClients()}
      />
    </div>
  );
}
