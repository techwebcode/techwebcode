import { ReactNode } from "react";

import ToolSidebar from "./ToolSidebar";

interface ToolLayoutProps {
  children: ReactNode;
}

export default function ToolLayout({
  children,
}: ToolLayoutProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-8">
        {children}
      </div>

      <aside className="hidden lg:block">
        <ToolSidebar />
      </aside>
    </div>
  );
}