"use client";

import { useState, useEffect } from "react";
import { Users, Briefcase, Calendar, PieChart } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { StatusChart } from "@/components/dashboard/status-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { UpcomingReminders } from "@/components/dashboard/upcoming-reminders";
import { apiUrl } from "@/lib/api";

interface DashboardStats {
  totalClients: number;
  totalProjects: number;
  upcomingReminders: number;
  projectsByStatus: {
    planning: number;
    in_progress: number;
    on_hold: number;
    completed: number;
    cancelled: number;
  };
}

interface Reminder {
  id: string;
  title: string;
  dueDate: string;
  completed?: boolean;
  description?: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    totalProjects: 0,
    upcomingReminders: 0,
    projectsByStatus: {
      planning: 0,
      in_progress: 0,
      on_hold: 0,
      completed: 0,
      cancelled: 0,
    },
  });

  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      setActivitiesLoading(true);
      setActivitiesError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");
        const res = await fetch(apiUrl('/logs'), {
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || res.statusText);
        }
        const logs = await res.json();
        // Map logs to RecentActivity structure
        const mappedActivities = logs.map((log: any) => ({
          id: log.id,
          title: log.title || log.type || 'Activity',
          type: log.type || '',
          time: log.time || '', // Optionally format log.createdAt to relative time
          client: log.client ? { name: log.client.name, company: log.client.company } : { name: "Unknown" },
        }));
        console.log(mappedActivities);
        
        setRecentActivities(mappedActivities);
      } catch (err: any) {
        setActivitiesError(err.message || "Failed to fetch recent activities");
      } finally {
        setActivitiesLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const [upcomingReminders, setUpcomingReminders] = useState<Partial<Reminder>[]>([
    {
      id: "1",
      title: "Follow up with Sarah about project timeline",
      dueDate: new Date(Date.now() + 86400000).toISOString(), // tomorrow
      completed: false,
    },
    {
      id: "2",
      title: "Send invoice to Acme Inc.",
      dueDate: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
      completed: false,
      description: "Include all billable hours from last month",
    },
    {
      id: "3",
      title: "Prepare for client presentation",
      dueDate: new Date(Date.now() - 86400000).toISOString(), // yesterday
      completed: false,
    },
  ]);

  // Simulate loading data from API
  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalClients: 12,
        totalProjects: 24,
        upcomingReminders: 5,
        projectsByStatus: {
          planning: 4,
          in_progress: 8,
          on_hold: 3,
          completed: 7,
          cancelled: 2,
        },
      });
    }, 500);
  }, []);

  // Prepare chart data
  const chartData = [
    { name: "Planning", value: stats.projectsByStatus.planning },
    { name: "In Progress", value: stats.projectsByStatus.in_progress },
    { name: "On Hold", value: stats.projectsByStatus.on_hold },
    { name: "Completed", value: stats.projectsByStatus.completed },
    { name: "Cancelled", value: stats.projectsByStatus.cancelled },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary">Welcome to miniCRM</h1>
        <p className="text-lg text-muted-foreground max-w-xl">
          miniCRM is your lightweight solution for managing clients, projects, reminders, and activities. Effortlessly track your business relationships and stay organized—all in one beautiful, intuitive dashboard.
        </p>
        <div className="mt-8">
          <span className="inline-block rounded-full bg-primary/10 text-primary px-4 py-2 text-sm font-medium">
            Get started by adding your first client or project!
          </span>
        </div>
      </div>
    </div>
  );
}
