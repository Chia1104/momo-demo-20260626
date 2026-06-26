import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

interface PriceProps {
  value: number;
  original?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-3xl",
} as const;

export function Price({ value, original, size = "md", className }: PriceProps) {
  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className={cn("text-accent font-bold", sizes[size])}>
        <span className="text-[0.7em]">$</span>
        {formatPrice(value)}
      </span>
      {original != null && original > value && (
        <span className="text-muted text-xs line-through">
          ${formatPrice(original)}
        </span>
      )}
    </div>
  );
}
