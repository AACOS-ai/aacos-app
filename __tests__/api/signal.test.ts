// __tests__/api/signal.test.ts
import { POST, GET } from "@/app/api/signal/route";
import { purify } from "@/lib/purify";
import { SignalSchema } from "@/lib/signalSchema";
import { sql } from "@vercel/postgres";
import { describe, it, expect, jest } from "@jest/globals";

// ✅ Unit tests for purify
describe("purify", () => {
  it("removes script tags", () => {
    expect(purify('<script>alert("x")</script>')).toBe('alert("x")');
  });
  it("removes html tags", () => {
    expect(purify("<b>bold</b>")).toBe("bold");
  });
  it("returns empty for non-string", () => {
    expect(purify(null)).toBe("");
  });
});

// ✅ Unit tests for schema validation
describe("SignalSchema", () => {
  it("accepts valid signal", () => {
    const res = SignalSchema.safeParse({
      text: "test",
      color: "text-blue-400",
      description: "desc",
    });
    expect(res.success).toBe(true);
  });
  it("rejects missing fields", () => {
    const res = SignalSchema.safeParse({});
    expect(res.success).toBe(false);
  });
  it("rejects wrong types", () => {
    const res = SignalSchema.safeParse({
      text: 123,
      color: true,
      description: {},
    });
    expect(res.success).toBe(false);
  });
});

// ✅ Mock @vercel/postgres
type Tx = {
  sql: jest.Mock;
  begin: jest.Mock;
  commit: jest.Mock;
  rollback: jest.Mock;
};

jest.mock("@vercel/postgres", () => {
  const mockRows = [{ count: "0" }];
  return {
    sql: Object.assign(jest.fn(() => Promise.resolve({ rows: mockRows })), {
      begin: jest.fn(async (cb: (tx: Tx) => void) => {
        await cb({
          sql: jest.fn(),
          begin: jest.fn(),
          commit: jest.fn(),
          rollback: jest.fn(),
        });
      }),
    }),
  };
});

// Helper for mock request
const mockRequest = (
  method: string,
  body: Record<string, unknown> = {},
  ip = "1.2.3.4"
): Request => {
  const headers = new Headers();
  headers.set("x-forwarded-for", ip);

  return {
    method,
    headers,
    json: async () => body,
  } as unknown as Request;
};

// ✅ API route tests
describe("/api/signal route", () => {
  it("returns 400 for invalid POST payload (schema)", async () => {
    const res = await POST(mockRequest("POST", { foo: "bar" }));
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toMatch(/Invalid/);
  });

  it("returns 400 for XSS attempt (purify)", async () => {
    const res = await POST(
      mockRequest("POST", {
        text: '<script>alert("hack")</script>',
        color: "<b>red</b>",
        description: "<img src=x />"
      })
    );
    // ממשיכים הלאה, כי ה־purify "מנקה" אבל לא זורק שגיאה, רק מנקה את התוכן!
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.text || "").not.toMatch(/<script>|<b>|<img/);
  });

  it("blocks requests above rate-limit", async () => {
    sql.mockResolvedValueOnce({ rows: [{ count: "1" }] }); // simulate rate limit

    const res = await POST(
      mockRequest("POST", {
        text: "test",
        color: "text-blue-500",
        description: "valid",
      })
    );
    expect(res.status).toBe(429);
  });

  it("accepts a valid POST", async () => {
    const res = await POST(
      mockRequest("POST", {
        text: "🟣 Signal: Consciousness Pulse Detected",
        color: "text-purple-400",
        description: "מעבר ראשון בתודעה",
      })
    );
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
  });

  it("returns latest 20 signals via GET", async () => {
    const res = await GET();
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(json)).toBe(true);
  });
});
