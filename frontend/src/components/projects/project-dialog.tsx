"use client";

import { useState, useEffect } from "react";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import type { Project } from "./project-list";

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  clients: { id: string; name: string }[];
  onProjectSaved: () => void;
}

export function ProjectDialog({ open, onOpenChange, project, clients, onProjectSaved }: ProjectDialogProps) {
  const [form, setForm] = useState({
    clientId: "",
    title: "",
    budget: "",
    deadline: "",
    status: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setForm({
        clientId: project.clientId,
        title: project.title,
        budget: project.budget.toString(),
        deadline: project.deadline.split("T")[0],
        status: project.status,
      });
    } else {
      setForm({ clientId: clients[0]?.id || "", title: "", budget: "", deadline: "", status: "" });
    }
    setError(null);
  }, [project, open, clients]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");
      const method = project ? "PUT" : "POST";
      const url = project ? apiUrl(`/projects/${project.id}`) : apiUrl('/projects');
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          clientId: form.clientId,
          title: form.title,
          budget: Number(form.budget),
          deadline: form.deadline,
          status: form.status,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || res.statusText);
      }
      onProjectSaved();
    } catch (err: any) {
      setError(err.message || "Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Add Project"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Client</label>
            <select
              name="clientId"
              value={form.clientId}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
              disabled={!!project}
            >
              {clients.map((client) => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Budget</label>
            <input
              name="budget"
              type="number"
              value={form.budget}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
              min={0}
            />
          </div>
          <div>
            <label className="block mb-1">Deadline</label>
            <input
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Status</label>
            <input
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          {error && <div className="text-red-600">{error}</div>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : project ? "Save Changes" : "Add Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
