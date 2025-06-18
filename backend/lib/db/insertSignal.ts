import { sql } from "@vercel/postgres";

interface SignalData {
  text: string;
  color: string;
  description: string;
  ipHash: string;
  timestamp: number;
  user_id?: string | null;
}

export async function insertSignalAndRequest({
  text,
  color,
  description,
  ipHash,
  timestamp,
  user_id = null,
}: SignalData) {
  await sql.begin(async (tx) => {
    await tx`
      INSERT INTO signals (text, color, description, timestamp, user_id)
      VALUES (${text}, ${color}, ${description}, ${timestamp}, ${user_id});
    `;
    await tx`
      INSERT INTO signal_requests (ip, timestamp)
      VALUES (${ipHash}, ${timestamp});
    `;
  });
}
