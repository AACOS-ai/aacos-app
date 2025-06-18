import { NextRequest, NextResponse } from "next/server";
import { ZodSchema } from "zod";

// פונקציית עטיפה גנרית לכל סכמת Zod (המתאימה לכל handler)
export function withValidation<T extends ZodSchema<any>>(
  schema: T,
  handler: (req: NextRequest, parsedBody: any) => Promise<Response>
) {
  return async function(req: NextRequest) {
    let body = {};
    try {
      // קולט JSON, אם POST/PUT
      if (["POST", "PUT", "PATCH"].includes(req.method)) {
        body = await req.json();
      }
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // וולידציה עם zod
    const result = schema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid format", details: result.error.errors }, { status: 400 });
    }

    // אם עבר – שלח ללוגיקת ה־API עם body תקני
    return handler(req, result.data);
  };
}
