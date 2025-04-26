import React from "react";

interface RecentActivityProps {
  activities: {
    id: string;
    title: string;
    type: string;
    time: string;
    client: {
      name: string;
      company?: string;
    };
  }[];
  className?: string;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities, className }) => {
  return (
    <div className={`rounded-lg border bg-white p-6 shadow ${className || ''}`}>
      <div className="font-medium mb-2">Recent Activity</div>
      <ul className="space-y-3">
        {activities.map((activity) => (
          <li key={activity.id} className="flex flex-col gap-1">
            <span className="font-semibold">{activity.title}</span>
            <span className="text-xs text-muted-foreground">{activity.time} 3 {activity.client.name}{activity.client.company ? ` (${activity.client.company})` : ''}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
