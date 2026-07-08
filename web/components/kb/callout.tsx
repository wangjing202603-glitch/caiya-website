import { Info, AlertTriangle, AlertOctagon, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  type?: "info" | "warning" | "danger" | "success";
  title?: string;
  children: React.ReactNode;
}

const STYLES = {
  info: {
    wrap: "border-brand-200 bg-brand-50 dark:border-brand-800 dark:bg-brand-900/20",
    icon: "text-brand-600 dark:text-brand-300",
    Icon: Info,
  },
  warning: {
    wrap: "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20",
    icon: "text-amber-600 dark:text-amber-300",
    Icon: AlertTriangle,
  },
  danger: {
    wrap: "border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-900/20",
    icon: "text-rose-600 dark:text-rose-300",
    Icon: AlertOctagon,
  },
  success: {
    wrap: "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20",
    icon: "text-emerald-600 dark:text-emerald-300",
    Icon: CheckCircle2,
  },
} as const;

export function Callout({ type = "info", title, children }: Props) {
  const style = STYLES[type];
  return (
    <div
      className={cn(
        "my-6 flex gap-3 rounded-lg border p-4 text-sm",
        style.wrap,
      )}
    >
      <style.Icon className={cn("h-5 w-5 shrink-0 mt-0.5", style.icon)} />
      <div className="flex-1">
        {title && <div className="font-semibold mb-1 text-ink-800 dark:text-ink-100">{title}</div>}
        <div className="text-ink-700 dark:text-ink-200 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
