import { cn } from "@/lib/utils/cn";

type OfficialCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function OfficialCard({ children, className }: OfficialCardProps) {
  return (
    <div className={cn("official-card", className)}>{children}</div>
  );
}
