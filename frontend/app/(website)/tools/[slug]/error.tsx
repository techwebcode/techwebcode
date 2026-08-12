"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="container py-24 text-center">

      <h2 className="text-3xl font-bold">
        Something went wrong
      </h2>

      <p className="mt-4 text-muted-foreground">
        Please try again.
      </p>

      <Button
        className="mt-8"
        onClick={reset}
      >
        Retry
      </Button>

    </div>
  );
}