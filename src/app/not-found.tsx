import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 self-center justify-self-center p-4 text-center">
      <h1 className="md:heading-1 heading-2">Page not found</h1>
      <div className="text-foreground-subtle flex max-w-[456px] flex-col items-center justify-center gap-4 text-center">
        <span>“Nothing takes place in the universe whose meaning is not that of some maximum or minimum.”</span>
        <span>― Leonard Euler</span>
      </div>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
