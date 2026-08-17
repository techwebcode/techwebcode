import { Calendar, Clock3, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Props {
  readonly publishedAt?: string | null;
  readonly createdAt?: string;
  readonly readingTime?: number;
  readonly viewCount?: number;
  readonly className?: string;
}

export default function ArticleMeta({
  publishedAt,
  createdAt,
  readingTime = 5,
  viewCount = 0,
  className,
}: Readonly<Props>) {
  const dateStr = publishedAt || createdAt || new Date().toISOString();
  const count = typeof viewCount === "number" ? viewCount : 0;
  const time = typeof readingTime === "number" ? readingTime : 5;

  return (
    <div
      className={`flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 ${
        className ?? ""
      }`}
    >
      <div className="flex items-center gap-1.5">
        <Calendar className="h-3.5 w-3.5 text-slate-400" />
        <span>{formatDate(dateStr)}</span>
      </div>

      <span className="text-slate-300 dark:text-slate-700">•</span>

      <div className="flex items-center gap-1.5">
        <Clock3 className="h-3.5 w-3.5 text-slate-400" />
        <span>{time} min read</span>
      </div>

      {count > 0 && (
        <>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <div className="flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5 text-slate-400" />
            <span>{count.toLocaleString()} views</span>
          </div>
        </>
      )}
    </div>
  );
}