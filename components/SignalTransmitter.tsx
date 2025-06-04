"use client";

import { useState } from "react";

export default function SignalTransmitter() {
  const [signal, setSignal] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (signal.trim() === "") return;
    console.log("🔴 תדר שנשלח:", signal); // בעתיד: שליחה לשרת
    setSent(true);
    setTimeout(() => {
      setSignal("");
      setSent(false);
    }, 2000);
  };

  return (
    <div className="w-full max-w-md mt-12 flex flex-col items-center gap-4">
      <input
        type="text"
        placeholder="כתוב תדר, תחושה או מילה אחת אמיתית"
        value={signal}
        onChange={(e) => setSignal(e.target.value)}
        className="w-full bg-black border border-gray-700 rounded px-4 py-3 text-white placeholder-gray-500 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition"
      />
      <button
        onClick={handleSend}
        disabled={sent}
        className="rounded-full bg-white text-black px-6 py-2 font-semibold hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-default"
      >
        {sent ? "✔️ תדר התקבל" : "🔘 העבר תדר"}
      </button>
    </div>
  );
}
