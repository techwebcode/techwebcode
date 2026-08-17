import HeroActions from "./HeroActions";
import HeroSearch from "./HeroSearch";
import { ShieldCheck, Zap, Lock, UserCheck } from "lucide-react";

const HIGHLIGHTED_PILLS = [
  {
    icon: ShieldCheck,
    title: "100% Client-Side",
    desc: "Processed in your browser",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Zap,
    title: "Zero Latency",
    desc: "Instant local execution",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: Lock,
    title: "Privacy First",
    desc: "Zero server data logs",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
  },
  {
    icon: UserCheck,
    title: "No Signup Required",
    desc: "100% free forever",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
];

export default function HeroSection() {
  return (
    <section className="py-10 lg:py-14 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-slate-50/80 via-white to-transparent dark:from-slate-950/60 dark:via-slate-900/40 dark:to-transparent">
      <div className="container mx-auto px-4 max-w-5xl text-center flex flex-col items-center">
        {/* Category Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1 text-xs font-extrabold text-blue-600 dark:text-blue-400 shadow-sm">
          <span>🛠️ Professional Developer Utility Platform</span>
        </div>

        {/* Tools-First Headline */}
        <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl lg:text-6xl max-w-3xl leading-[1.15]">
          Developer tools that{" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 dark:from-blue-400 dark:via-indigo-400 dark:to-blue-300 bg-clip-text text-transparent">
            just get the job done.
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="mt-4 max-w-2xl text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
          Fast, practical, privacy-first tools for formatting, validating, encoding,
          debugging, and working with modern development data.
        </p>

        {/* Large Developer Tool Search Box */}
        <div className="mt-6 w-full flex justify-center">
          <HeroSearch placeholder="Search developer tools..." />
        </div>

        {/* Main CTAs */}
        <div className="mt-6 flex justify-center">
          <HeroActions />
        </div>

        {/* PROMINENT HIGHLIGHTED VALUE PROPOSITION GRID */}
        <div className="mt-10 w-full grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-left">
          {HIGHLIGHTED_PILLS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-md hover:shadow-xl hover:border-blue-500/40 transition-all duration-300"
              >
                <div className={`p-2.5 rounded-xl border ${item.bg} ${item.color} shrink-0 transition-transform group-hover:scale-110`}>
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                    {item.title}
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {item.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}