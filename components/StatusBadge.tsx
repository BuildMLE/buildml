import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { ModelStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: ModelStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const configs = {
    training: {
      icon: Clock,
      label: "Training",
      variant: "secondary" as const,
      className: "bg-blue-100 text-blue-800 border-blue-200",
    },
    completed: {
      icon: CheckCircle2,
      label: "Ready",
      variant: "default" as const,
      className: "bg-green-100 text-green-800 border-green-200",
    },
    failed: {
      icon: AlertCircle,
      label: "Failed",
      variant: "destructive" as const,
      className: "bg-red-100 text-red-800 border-red-200",
    },
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={config.className}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
}
