import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function StatCard({ title, value, icon, trend, trendUp, className }: StatCardProps) {
  return (
    <div className={cn(
      "bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300",
      className
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl font-display font-bold text-foreground">{value}</h3>
        </div>
        <div className="p-3 rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1 text-sm">
          <span className={cn(
            "font-medium",
            trendUp ? "text-secondary" : "text-destructive"
          )}>
            {trendUp ? "+" : ""}{trend}
          </span>
          <span className="text-muted-foreground">vs. last month</span>
        </div>
      )}
    </div>
  );
}
