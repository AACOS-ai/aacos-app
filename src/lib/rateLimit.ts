import { sql } from "@vercel/postgres";

const RATE_LIMIT_SECONDS = 30;
const RATE_LIMIT_HOURLY = 25;
const WARNING_HOURLY = 15;

export async function getRateLimitStatus(ipHash: string, now: number) {
  const recent = await sql`
    SELECT COUNT(*) FROM signal_requests
    WHERE ip = ${ipHash} AND timestamp > ${now - RATE_LIMIT_SECONDS * 1000};
  `;
  if (Number(recent.rows[0].count) > 0) {
    return { block: true, message: "Rate limit: Wait 30 seconds" };
  }

  const hourly = await sql`
    SELECT COUNT(*) FROM signal_requests
    WHERE ip = ${ipHash} AND timestamp > ${now - 60 * 60 * 1000};
  `;
  const hourlyCount = Number(hourly.rows[0].count);

  if (hourlyCount >= 25) {
    return { block: true, message: "Rate limit: Max 25/hour" };
  } else if (hourlyCount >= WARNING_HOURLY) {
    return { warn: true, message: "You've sent many signals. Please wait." };
  }

  return { block: false };
}
