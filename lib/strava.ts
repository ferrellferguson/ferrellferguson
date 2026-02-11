/**
 * Strava API client for fetching athlete stats, activities, and photos.
 *
 * Setup (one-time):
 * 1. Create app at https://www.strava.com/settings/api
 * 2. Authorize with scope=read,activity:read_all
 * 3. Add credentials to .env.local:
 *    STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_REFRESH_TOKEN, STRAVA_ATHLETE_ID
 */

// ----- Types -----

export type StravaTotals = {
  count: number;
  distance: number; // meters
  moving_time: number; // seconds
  elapsed_time: number; // seconds
  elevation_gain: number; // meters
};

export type StravaAthleteStats = {
  biggest_ride_distance: number;
  biggest_climb_elevation_gain: number;
  recent_ride_totals: StravaTotals;
  ytd_ride_totals: StravaTotals;
  all_ride_totals: StravaTotals;
  recent_run_totals: StravaTotals;
  ytd_run_totals: StravaTotals;
  all_run_totals: StravaTotals;
  recent_swim_totals: StravaTotals;
  ytd_swim_totals: StravaTotals;
  all_swim_totals: StravaTotals;
};

export type StravaActivity = {
  id: number;
  name: string;
  type: string;
  sport_type: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  start_date: string;
  start_date_local: string;
  average_speed: number;
  max_speed: number;
  average_heartrate?: number;
  max_heartrate?: number;
  total_photo_count: number;
  map?: {
    summary_polyline: string;
  };
};

export type StravaPhoto = {
  unique_id: string;
  urls: Record<string, string>;
  caption: string;
  activity_id: number;
  activity_name?: string;
};

// ----- Defaults for when Strava is down -----

const emptyTotals: StravaTotals = {
  count: 0,
  distance: 0,
  moving_time: 0,
  elapsed_time: 0,
  elevation_gain: 0,
};

const emptyStats: StravaAthleteStats = {
  biggest_ride_distance: 0,
  biggest_climb_elevation_gain: 0,
  recent_ride_totals: emptyTotals,
  ytd_ride_totals: emptyTotals,
  all_ride_totals: emptyTotals,
  recent_run_totals: emptyTotals,
  ytd_run_totals: emptyTotals,
  all_run_totals: emptyTotals,
  recent_swim_totals: emptyTotals,
  ytd_swim_totals: emptyTotals,
  all_swim_totals: emptyTotals,
};

// ----- Token Management -----

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getAccessToken(): Promise<string | null> {
  if (cachedToken && Date.now() / 1000 < tokenExpiresAt - 60) {
    return cachedToken;
  }

  try {
    const res = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: process.env.STRAVA_REFRESH_TOKEN,
      }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error(`Strava token refresh failed: ${res.status}`);
      return null;
    }

    const data = await res.json();
    cachedToken = data.access_token;
    tokenExpiresAt = data.expires_at;
    return data.access_token;
  } catch (err) {
    console.error("Strava token refresh error:", err);
    return null;
  }
}

// ----- API Helper -----

async function stravaFetch<T>(path: string, fallback: T): Promise<T> {
  const token = await getAccessToken();
  if (!token) return fallback;

  try {
    const res = await fetch(`https://www.strava.com/api/v3${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error(`Strava API error ${res.status}: ${path}`);
      return fallback;
    }

    return res.json();
  } catch (err) {
    console.error(`Strava fetch error for ${path}:`, err);
    return fallback;
  }
}

// ----- Public Functions -----

export async function getAthleteStats(): Promise<StravaAthleteStats> {
  const athleteId = process.env.STRAVA_ATHLETE_ID;
  return stravaFetch<StravaAthleteStats>(
    `/athletes/${athleteId}/stats`,
    emptyStats
  );
}

export async function getRecentActivities(
  count = 15
): Promise<StravaActivity[]> {
  return stravaFetch<StravaActivity[]>(
    `/athlete/activities?per_page=${count}`,
    []
  );
}

export async function getActivityPhotos(
  activityId: number
): Promise<StravaPhoto[]> {
  return stravaFetch<StravaPhoto[]>(
    `/activities/${activityId}/photos?photo_sources=true&size=2048`,
    []
  );
}

export async function getAllRecentPhotos(
  activityCount = 30
): Promise<StravaPhoto[]> {
  const activities = await getRecentActivities(activityCount);
  if (activities.length === 0) return [];

  const withPhotos = activities.filter((a) => a.total_photo_count > 0);

  const photoArrays = await Promise.all(
    withPhotos.map(async (activity) => {
      const photos = await getActivityPhotos(activity.id);
      return photos.map((p) => ({
        ...p,
        activity_id: activity.id,
        activity_name: activity.name,
      }));
    })
  );

  return photoArrays.flat();
}

// ----- Formatting Helpers -----

export function metersToMiles(meters: number): string {
  return (meters / 1609.344).toFixed(1);
}

export function metersToFeet(meters: number): string {
  return Math.round(meters * 3.28084).toLocaleString("en-US");
}

export function secondsToHoursMinutes(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
