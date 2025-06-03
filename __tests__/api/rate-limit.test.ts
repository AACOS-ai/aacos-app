// __tests__/api/rate-limit.test.ts
import { POST } from "@/app/api/signal/route";
import { NextRequest } from "next/server";

// Mock sql
jest.mock("@vercel/postgres", () => ({
  sql: {
    default: jest.fn(),
    begin: jest.fn(),
  },
}));

describe("Rate limiting logic", () => {
  const headers = new Headers();
  headers.set("x-forwarded-for", "123.45.67.89");

  const mockRequest = (body: any = {}) =>
    new NextRequest("http://localhost/api/signal", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    } as any);

  it("blocks requests within 30 seconds window", async () => {
    const { sql } = require("@vercel/postgres");

    // Simulate 1 recent request (within 30s)
    sql.default.mockResolvedValueOnce({ rows: [{ count: "1" }] });

    const res = await POST(
      mockRequest({
        text: "Test signal",
        color: "text-blue-500",
        description: "Test description",
      })
    );
    const json = await res.json();
    expect(res.status).toBe(429);
    expect(json.error).toMatch(/30s/);
  });

  it("blocks after 25 requests per hour", async () => {
    const { sql } = require("@vercel/postgres");

    // Allow through 30s window
    sql.default
      .mockResolvedValueOnce({ rows: [{ count: "0" }] }) // 30s check
      .mockResolvedValueOnce({ rows: [{ count: "25" }] }); // hourly check

    const res = await POST(
      mockRequest({
        text: "Overload test",
        color: "text-red-400",
        description: "Signal spam",
      })
    );
    const json = await res.json();
    expect(res.status).toBe(429);
    expect(json.error).toMatch(/25\/hour/);
  });

  it("allows signal if under limit", async () => {
    const { sql } = require("@vercel/postgres");
    sql.default
      .mockResolvedValueOnce({ rows: [{ count: "0" }] }) // 30s check
      .mockResolvedValueOnce({ rows: [{ count: "5" }] }); // hourly check (מתחת ל-25)

    const res = await POST(
      mockRequest({
        text: "Allowed signal",
        color: "text-green-400",
        description: "Signal ok",
      })
    );
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
  });
});
