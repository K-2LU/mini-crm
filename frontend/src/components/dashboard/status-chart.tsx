import React from "react";

interface StatusChartProps {
  title: string;
  data: { name: string; value: number }[];
  className?: string;
}

export const StatusChart: React.FC<StatusChartProps> = ({ title, data, className }) => {
  // Placeholder: Replace with real chart (e.g. recharts, chart.js)
  return (
    <div className={`rounded-lg border bg-white p-6 shadow ${className || ''}`}>
      <div className="font-medium mb-2">{title}</div>
      <ul className="space-y-1">
        {data.map((item) => (
          <li key={item.name} className="flex justify-between">
            <span>{item.name}</span>
            <span className="font-bold">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
