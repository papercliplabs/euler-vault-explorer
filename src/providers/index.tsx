import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return <TooltipProvider>{children}</TooltipProvider>;
}
