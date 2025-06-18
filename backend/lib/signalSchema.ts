import { z } from "zod";

export const SignalSchema = z.object({
  text: z.string().min(2).max(200),
  color: z.string().min(2).max(50).regex(/^text-(purple|blue|green|orange|yellow|red|gray|pink|indigo|amber)-\d{3,4}$/),
  description: z.string().min(2).max(200),
});

// טיפוס TypeScript אוטומטי
export type Signal = z.infer<typeof SignalSchema>;
