"use client"; // Error components must be Client Components
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("APPLICATION ERROR", error);
  }, [error]);

  return (
    <div className="flex grow flex-col items-center justify-center gap-2 p-4 text-center">
      <h2>Ooops, something went wrong :(</h2>
      <div className="flex gap-2">
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
          className="w-[120px]"
        >
          Try again
        </Button>
        <Button asChild>
          <Link href="/" className="w-[120px]">
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
