"use client";

import { useState, useEffect } from "react";
import { ProjectList } from "@/components/projects/project-list";
import { ProjectDialog } from "@/components/projects/project-dialog";
import { Button } from "@/components/ui/button";

export default function ProjectsPage() {
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");
      const res = await fetch("http://localhost:5000/api/projects", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || res.statusText);
      }
      const data = await res.json();
      setProjects(data);
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

  const fetchClients = async () => {
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
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchClients();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Add Project
        </Button>
      </div>
      <ProjectList projects={projects} clients={clients} loading={loading} error={error} fetchProjects={fetchProjects} />
      <ProjectDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onProjectSaved={() => fetchProjects()}
        project={null}
        clients={clients}
      />
    </div>
  );
}
