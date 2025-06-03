// app/api/signal/route.ts
import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { purify } from "@/lib/purify";
import { SignalSchema } from "@/lib/signalSchema"; // עם regex מחמיר

// --- Rate-limit params ---
const RATE_LIMIT_SECONDS = 30;
const RATE_LIMIT_HOURLY = 25;
const WARNING_HOURLY = 15;

// --- Helper: get Client IP (לוגיקה סטנדרטית) ---
function getClientKey(req: Request) {
  return req.headers.get("x-forwarded-for") || req.headers.get("host") || "unknown";
}

// --- POST: הקלט חייב לעבור אימות קשיח וסניטיזציה ---
export async function POST(req: Request) {
  try {
    const ip = getClientKey(req);
    const now = Date.now();

    // --- RATE LIMIT: 30 שניות אחרונות ---
    const { rows: recent } = await sql`
      SELECT COUNT(*) FROM signal_requests
      WHERE ip = ${ip} AND timestamp > ${now - RATE_LIMIT_SECONDS * 1000};
    `;
    if (Number(recent[0].count) > 0) {
      return NextResponse.json({ error: "Rate limit: Wait 30s" }, { status: 429 });
    }

    // --- RATE LIMIT: 25 בשעה ---
    const { rows: hourly } = await sql`
      SELECT COUNT(*) FROM signal_requests
      WHERE ip = ${ip} AND timestamp > ${now - 60 * 60 * 1000};
    `;
    const hourlyCount = Number(hourly[0].count);
    if (hourlyCount >= RATE_LIMIT_HOURLY) {
      return NextResponse.json({ error: "Rate limit: Max 25/hour" }, { status: 429 });
    }

    // --- אימות + סניטיזציה קשיחה ---
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const parse = SignalSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({
        error: "Invalid signal format",
        details: parse.error.errors, // מחזיר למפתחים/בדיקות איזה שדה שגוי
      }, { status: 400 });
    }
    // עכשיו כל השדות בטוחים – ועדיין, מוסיפים purify!
    const clean = {
      text: purify(parse.data.text),
      color: purify(parse.data.color),
      description: purify(parse.data.description ?? ""),
    };

    // --- הכנסת DB ---
    await sql.begin(async (tx) => {
      await tx`
        INSERT INTO signals (text, color, description, timestamp)
        VALUES (${clean.text}, ${clean.color}, ${clean.description}, ${now});
      `;
      await tx`
        INSERT INTO signal_requests (ip, timestamp)
        VALUES (${ip}, ${now});
      `;
    });

    // --- התראה אחרי 15 ---
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

// --- GET: החזרת 20 אחרונים ---
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
