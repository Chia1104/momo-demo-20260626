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
        <span className="h-5 w-1.5 rounded-full bg-[#e3197b]" />
        <h2 className="text-lg font-bold text-[var(--foreground)] md:text-xl">
          {title}
        </h2>
        {subtitle && (
          <span className="text-sm text-[var(--muted)]">{subtitle}</span>
        )}
      </div>
      {action}
    </div>
  );
}
