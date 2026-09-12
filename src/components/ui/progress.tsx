"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

type ProgressProps = React.ComponentPropsWithoutRef<
  typeof ProgressPrimitive.Root
> & {
  /**
   * Start empty and animate up to `value` after mount, so a bar that lands
   * on screen already-full still shows the fill (post-lesson, unit path).
   * Without it the bar renders at `value` immediately and only later changes
   * transition.
   */
  fillIn?: boolean;
};

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, fillIn = false, ...props }, ref) => {
  const target = value || 0;
  const [shown, setShown] = React.useState(fillIn ? 0 : target);

  React.useEffect(() => {
    if (!fillIn) {
      setShown(target);
      return;
    }
    // Let the 0% frame paint first so the transition has somewhere to go.
    const raf = window.requestAnimationFrame(() => setShown(target));
    return () => window.cancelAnimationFrame(raf);
  }, [fillIn, target]);

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-3 w-full overflow-hidden rounded-full bg-slate-100",
        className
      )}
      value={value}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-transform ease-out motion-reduce:transition-none",
          fillIn ? "duration-700" : "duration-300"
        )}
        style={{ transform: `translateX(-${100 - shown}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
