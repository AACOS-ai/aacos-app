import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

const RATE_LIMIT_SECONDS = 30;
const RATE_LIMIT_HOURLY = 25;
const WARNING_HOURLY = 15;

function getClientKey(req: Request) {
  return req.headers.get("x-forwarded-for") || req.headers.get("host") || "unknown";
}

function validateSignal(data: any) {
  return (
    typeof data?.text === "string" &&
    typeof data?.color === "string" &&
    typeof data?.description === "string"
  );
}

export async function POST(req: Request) {
  try {
    const ip = getClientKey(req);
    const now = Date.now();

    // Check recent submissions in last 30s
    const { rows: recent } = await sql`
      SELECT COUNT(*) FROM signal_requests
      WHERE ip = ${ip} AND timestamp > ${now - RATE_LIMIT_SECONDS * 1000};
    `;

    if (Number(recent[0].count) > 0) {
      return NextResponse.json({ error: "Rate limit: Wait 30s" }, { status: 429 });
    }

    // Check submissions in last hour
    const { rows: hourly } = await sql`
      SELECT COUNT(*) FROM signal_requests
      WHERE ip = ${ip} AND timestamp > ${now - 60 * 60 * 1000};
    `;

    const hourlyCount = Number(hourly[0].count);

    if (hourlyCount >= RATE_LIMIT_HOURLY) {
      return NextResponse.json({ error: "Rate limit: Max 25/hour" }, { status: 429 });
    }

    const body = await req.json();
    if (!validateSignal(body)) {
      return NextResponse.json({ error: "Invalid signal format" }, { status: 400 });
    }

    const { text, color, description } = body;

    await sql.begin(async (tx) => {
      await tx`
        INSERT INTO signals (text, color, description, timestamp)
        VALUES (${text}, ${color}, ${description}, ${now});
      `;
      await tx`
        INSERT INTO signal_requests (ip, timestamp)
        VALUES (${ip}, ${now});
      `;
    });

    if (hourlyCount >= WARNING_HOURLY) {
      return NextResponse.json({
        success: true,
        warning: "slow-down",
        message: "You've sent many signals. Please wait a moment."
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/signal error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await sql`
      SELECT * FROM signals
      ORDER BY timestamp DESC
      LIMIT 20;
    `;

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("GET /api/signal error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
