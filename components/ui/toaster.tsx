import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type AppToastVariant = "success" | "error" | "warning" | "info";

type AppToastOptions = {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  closeButton?: boolean;
  duration?: number;
};

const variants: Record<
  AppToastVariant,
  { icon: typeof CheckCircle2; iconClassName: string; surfaceClassName: string }
> = {
  success: {
    icon: CheckCircle2,
    iconClassName: "text-chart-3",
    surfaceClassName: "bg-chart-3/10",
  },
  error: {
    icon: AlertCircle,
    iconClassName: "text-destructive",
    surfaceClassName: "bg-destructive/10",
  },
  warning: {
    icon: AlertTriangle,
    iconClassName: "text-chart-4",
    surfaceClassName: "bg-chart-4/10 ",
  },
  info: {
    icon: Info,
    iconClassName: "text-primary",
    surfaceClassName: "bg-primary/10",
  },
};

function ToastContent({
  variant,
  options,
  toastId,
}: {
  variant: AppToastVariant;
  options: AppToastOptions;
  toastId: string | number;
}) {
  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div className="flex w-[min(380px,calc(100vw-2rem))] items-start gap-3 rounded-xl border border-border bg-linear-to-br from-white to-accent p-4 text-foreground shadow-sm backdrop-blur-xl">
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          config.surfaceClassName,
          config.iconClassName,
        )}
      >
        <Icon className="h-4.5 w-4.5" aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1 pt-0.5 my-auto">
        <p className="text-sm font-semibold leading-5 ">{options.title}</p>
        {options.description ? (
          <p className="mt-1 text-xs leading-5 text-secondary-foreground">{options.description}</p>
        ) : null}
        {options.action ? (
          <Button
            type="button"
            variant="link"
            size="sm"
            className="mt-2 h-auto p-0 text-xs font-semibold"
            onClick={() => {
              toast.dismiss(toastId);
              options.action?.onClick();
            }}
          >
            {options.action.label}
          </Button>
        ) : null}
      </div>

      {options.closeButton !== false ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Close notification"
          onClick={() => toast.dismiss(toastId)}
          className="-mr-1 -mt-1 h-8 w-8 shrink-0 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}

function showAppToast(variant: AppToastVariant, options: AppToastOptions) {
  return toast.custom(
    (toastId) => <ToastContent variant={variant} options={options} toastId={toastId} />,
    { duration: options.duration ?? 8000 },
  );
}

export const appToast = {
  success: (options: AppToastOptions) => showAppToast("success", options),
  error: (options: AppToastOptions) => showAppToast("error", options),
  warning: (options: AppToastOptions) => showAppToast("warning", options),
  info: (options: AppToastOptions) => showAppToast("info", options),
};

export type { AppToastOptions };