import type { Metadata } from "next";
import {
  getAthleteStats,
  getRecentActivities,
  getAllRecentPhotos,
  metersToMiles,
  metersToFeet,
  secondsToHoursMinutes,
  formatDate,
} from "@/lib/strava";
import type { StravaAthleteStats, StravaActivity, StravaPhoto } from "@/lib/strava";
import { PhotoGallery } from "@/app/components/photo-gallery";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Fitness",
  description:
    "Cycling stats, ride photos, and training progress from Ferrell Ferguson's Strava.",
};

function HeroSection() {
  return (
    <div className="relative overflow-hidden border-b border-border/50">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--hero-bg)" }}
      />
      <div className="relative mx-auto max-w-6xl px-6 pt-6 pb-12 md:pt-8 md:pb-14">
        <span className="tag-gradient mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-medium text-accent">
          Fitness
        </span>
        <h1 className="mb-3 text-4xl font-bold tracking-tight md:text-5xl">
          Ride Log
        </h1>
        <p className="max-w-xl text-lg text-muted">
          Cyclist, aspiring triathlete, and firm believer that the best debugging
          happens on two wheels. Stats powered by Strava.
        </p>
      </div>
    </div>
  );
}

function StatsGrid({ stats }: { stats: StravaAthleteStats }) {
  const ytd = stats.ytd_ride_totals;
  const all = stats.all_ride_totals;
  const year = new Date().getFullYear();

  const cards = [
    {
      label: `${year} Rides`,
      value: ytd.count.toString(),
      sub: "rides this year",
    },
    {
      label: `${year} Distance`,
      value: `${metersToMiles(ytd.distance)} mi`,
      sub: "miles this year",
    },
    {
      label: `${year} Elevation`,
      value: `${metersToFeet(ytd.elevation_gain)} ft`,
      sub: "climbed this year",
    },
    {
      label: `${year} Saddle Time`,
      value: secondsToHoursMinutes(ytd.moving_time),
      sub: "on the bike this year",
    },
    {
      label: "All-Time Distance",
      value: `${Number(metersToMiles(all.distance)).toLocaleString("en-US")} mi`,
      sub: `across ${all.count.toLocaleString("en-US")} rides`,
    },
    {
      label: "Longest Ride",
      value: `${metersToMiles(stats.biggest_ride_distance)} mi`,
      sub: "personal best",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10">
        <span className="tag-gradient mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-medium text-accent">
          Stats
        </span>
        <h2 className="text-3xl font-bold tracking-tight">By the Numbers</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="gradient-border overflow-hidden p-6 transition-all duration-300 hover:shadow-[var(--card-shadow-hover)]"
          >
            <p className="mb-1 text-xs font-medium tracking-widest text-accent uppercase">
              {card.label}
            </p>
            <p className="mb-1 text-3xl font-bold tracking-tight text-foreground">
              {card.value}
            </p>
            <p className="text-sm text-muted">{card.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PhotoSection({ photos }: { photos: StravaPhoto[] }) {
  return (
    <section className="border-y border-border/50 bg-muted-bg/50 py-16">
      <div className="mx-auto max-w-6xl px-6 mb-8">
        <span className="tag-gradient mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-medium text-accent">
          Gallery
        </span>
        <h2 className="mb-2 text-3xl font-bold tracking-tight">
          From the Road
        </h2>
        <p className="text-muted">Snapshots from recent rides.</p>
      </div>
      <PhotoGallery photos={photos} />
    </section>
  );
}

function ActivitiesSection({ activities }: { activities: StravaActivity[] }) {
  const typeIcons: Record<string, string> = {
    Ride: "🚴",
    Run: "🏃",
    Swim: "🏊",
    Walk: "🚶",
    Hike: "🥾",
    VirtualRide: "🚴",
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10">
        <span className="tag-gradient mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-medium text-accent">
          Recent
        </span>
        <h2 className="text-3xl font-bold tracking-tight">Latest Activities</h2>
      </div>
      <div className="space-y-3">
        {activities.map((activity) => (
          <a
            key={activity.id}
            href={`https://www.strava.com/activities/${activity.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="gradient-border group flex flex-col gap-3 overflow-hidden p-5 transition-all duration-300 hover:shadow-[var(--card-shadow-hover)] hover:-translate-y-0.5 sm:flex-row sm:items-center sm:gap-6"
          >
            <div className="flex items-center gap-3 sm:w-8">
              <span className="text-lg" title={activity.type}>
                {typeIcons[activity.type] || "🏋️"}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors truncate">
                {activity.name}
              </p>
              <p className="text-xs text-muted">
                {formatDate(activity.start_date_local)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm tabular-nums">
              <div className="text-center">
                <p className="font-semibold text-foreground">
                  {metersToMiles(activity.distance)} mi
                </p>
                <p className="text-xs text-muted">distance</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">
                  {metersToFeet(activity.total_elevation_gain)} ft
                </p>
                <p className="text-xs text-muted">elevation</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">
                  {secondsToHoursMinutes(activity.moving_time)}
                </p>
                <p className="text-xs text-muted">time</p>
              </div>
              {activity.average_speed > 0 && (
                <div className="text-center">
                  <p className="font-semibold text-foreground">
                    {(activity.average_speed * 2.237).toFixed(1)} mph
                  </p>
                  <p className="text-xs text-muted">avg speed</p>
                </div>
              )}
            </div>
            <svg
              className="hidden h-4 w-4 shrink-0 text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent sm:block"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        ))}
      </div>
    </section>
  );
}

function StravaAttribution() {
  return (
    <div className="border-t border-border/50 py-8">
      <div className="mx-auto max-w-6xl px-6 flex items-center justify-center gap-2">
        <span className="text-xs text-muted">Powered by</span>
        <a
          href="https://www.strava.com/athletes/28016965"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#FC4C02] hover:opacity-80 transition-opacity"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
          </svg>
          Strava
        </a>
      </div>
    </div>
  );
}

export default async function FitnessPage() {
  const [stats, activities, photos] = await Promise.all([
    getAthleteStats(),
    getRecentActivities(15),
    getAllRecentPhotos(30),
  ]);

  const hasData = activities.length > 0 || stats.all_ride_totals.count > 0;

  return (
    <main>
      <HeroSection />
      {hasData ? (
        <>
          <StatsGrid stats={stats} />
          {photos.length > 0 && <PhotoSection photos={photos} />}
          {activities.length > 0 && <ActivitiesSection activities={activities} />}
        </>
      ) : (
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <p className="text-lg text-muted">
            Stats are temporarily unavailable — Strava may be having issues. Check back soon!
          </p>
        </div>
      )}
      <StravaAttribution />
    </main>
  );
}
