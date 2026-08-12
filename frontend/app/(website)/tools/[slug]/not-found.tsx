import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container py-24 text-center">

      <h1 className="text-4xl font-bold">
        Tool not found
      </h1>

      <p className="mt-4 text-muted-foreground">
        The requested developer tool doesn't exist.
      </p>

      <Button className="mt-8">
        <Link href="/tools">
          Back to Tools
        </Link>
      </Button>

    </div>
  );
}