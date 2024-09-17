import { cn } from "@/utils/shadcn";
import Link from "next/link";
import { ComponentProps } from "react";
import ArrowUpRight from "./Icons/core/ArrowUpRight";

interface ExternalLinkProps extends ComponentProps<typeof Link> {
  hideArrow?: boolean;
  keepReferrer?: boolean; // Allow sending our site as referrer
  noFollow?: boolean; // Prevent SEO endorsement
}

export default function ExternalLink({
  children,
  className,
  hideArrow,
  keepReferrer,
  noFollow,
  ...props
}: ExternalLinkProps) {
  return (
    <Link
      className={cn("flex h-fit items-center gap-0.5 hover:brightness-75", className)}
      {...props}
      target="_blank"
      rel={`noopener ${keepReferrer ? "" : "noreferrer"} ${noFollow ? "nofollow" : ""}`}
    >
      {children}
      {!hideArrow && (
        <ArrowUpRight className="stroke-foreground-muted block h-[1em] w-[1em] self-start p-0 pt-[0.15em]" />
      )}
    </Link>
  );
}
