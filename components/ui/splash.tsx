import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SplashProps {
  title?: string;
  showSpinner?: boolean;
  className?: string;
}

export function Splash({
  title,
  showSpinner = true,
  className,
}: SplashProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-primary",
        className
      )}
    >
      {showSpinner && (
        <Loader2 className="h-10 w-10 animate-spin text-primary-foreground" />
      )}
      {title && (
        <p className="mt-4 text-lg font-medium text-primary-foreground">
          {title}
        </p>
      )}
    </div>
  );
}
