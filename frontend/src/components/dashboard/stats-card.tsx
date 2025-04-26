import React from "react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: { value: number; positive: boolean };
  description?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  description,
}) => {
  return (
    <div className="rounded-lg border bg-white p-6 shadow flex flex-col gap-2">
      <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
        {icon}
        {title}
      </div>
      <div className="text-3xl font-bold">{value}</div>
      {trend && (
        <div className={`text-xs ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>{
          trend.positive ? '+' : '-'}{trend.value} {description}</div>
      )}
    </div>
  );
};
