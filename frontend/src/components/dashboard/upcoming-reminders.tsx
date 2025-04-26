import React from "react";

interface Reminder {
  id: string;
  title: string;
  dueDate: string;
  completed?: boolean;
  description?: string;
}

interface UpcomingRemindersProps {
  reminders: Partial<Reminder>[];
}

export const UpcomingReminders: React.FC<UpcomingRemindersProps> = ({ reminders }) => {
  return (
    <div className="rounded-lg border bg-white p-6 shadow">
      <div className="font-medium mb-2">Upcoming Reminders</div>
      <ul className="space-y-2">
        {reminders.length === 0 ? (
          <li className="text-muted-foreground">No upcoming reminders.</li>
        ) : (
          reminders.map((reminder) => (
            <li key={reminder.id} className="flex flex-col gap-1">
              <span className="font-semibold">{reminder.title}</span>
              <span className="text-xs text-muted-foreground">Due: {reminder.dueDate ? new Date(reminder.dueDate).toLocaleString() : 'N/A'}</span>
              {reminder.description && (
                <span className="text-xs">{reminder.description}</span>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};
