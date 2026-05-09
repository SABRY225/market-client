import * as React from "react";
import { cn } from "../../lib/utils";

export const Progress = React.forwardRef(({ className, value, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("relative w-full h-3 bg-gray-200 rounded-full overflow-hidden", className)}
      {...props}
    >
      <div
        className="h-full bg-blue-600 transition-all duration-500"
        style={{ width: `${value || 0}%` }}
      />
    </div>
  );
});

Progress.displayName = "Progress";
