interface HeroStat {
  title: string;
  value: string;
}

interface HeroStatsProps {
  stats: HeroStat[];
}

export default function HeroStats({ stats }: HeroStatsProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="rounded-2xl border bg-card p-6 shadow-sm transition hover:shadow-md"
        >
          <p className="text-3xl font-bold">{stat.value}</p>

          <p className="mt-2 text-muted-foreground">
            {stat.title}
          </p>
        </div>
      ))}
    </div>
  );
}