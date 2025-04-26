"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProjectDialog } from "./project-dialog";

export interface Project {
  id: string;
  clientId: string;
  title: string;
  budget: number;
  deadline: string;
  status: string;
}

interface ProjectListProps {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => void;
  clients: { id: string; name: string }[];
}

export function ProjectList({ projects, loading, error, fetchProjects, clients }: ProjectListProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");
      const res = await fetch(apiUrl(`/projects/${id}`) , {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || res.statusText);
      }
      fetchProjects();
    } catch (err: any) {
      setLocalError(err.message || "Failed to delete project");
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
                <TableHead>Client</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => {
                const client = clients.find(c => c.id === project.clientId);
                return (
                  <TableRow key={project.id}>
                    <TableCell>{project.title}</TableCell>
                    <TableCell>{client ? client.name : '-'}</TableCell>
                    <TableCell>{project.budget}</TableCell>
                    <TableCell>{new Date(project.deadline).toLocaleDateString()}</TableCell>
                    <TableCell>{project.status}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(project)}>
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(project.id)}>
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
      <ProjectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        project={selectedProject}
        clients={clients}
        onProjectSaved={() => {
          fetchProjects();
          setIsDialogOpen(false);
          setSelectedProject(null);
        }}
      />
      <div className="mt-4">
        <Button onClick={() => { setSelectedProject(null); setIsDialogOpen(true); }}>
          Add Project
        </Button>
      </div>
    </>
  );
}
