import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-none bg-neutral-500 dark:bg-neutral-800 w-full",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
