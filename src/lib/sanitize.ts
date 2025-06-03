export function sanitizeText(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/[<>"']/g, "")         // הסרת תווים מסוכנים
    .trim()
    .slice(0, 200);                 // הגבלת אורך סביר
}
