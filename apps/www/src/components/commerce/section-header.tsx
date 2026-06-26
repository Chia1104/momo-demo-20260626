import { Typography } from "@heroui/react";

import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-4 flex items-end justify-between gap-4", className)}>
      <div className="flex items-baseline gap-3">
        <span className="bg-accent h-5 w-1.5 rounded-full" />
        <Typography type="h2" className="text-lg font-bold md:text-xl">
          {title}
        </Typography>
        {subtitle && <span className="text-muted text-sm">{subtitle}</span>}
      </div>
      {action}
    </div>
  );
}
