"use client";
import { useState } from "react";

export default function SignalTransmitter() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendSignal() {
    setLoading(true);
    setError("");
    setResponse("");
    try {
      const res = await fetch("http://localhost:8000/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_message: input }),
      });
      const data = await res.json();
      if (data.gpt_response) {
        setResponse(data.gpt_response);
      } else {
        setError(data.error || "Unknown error");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto mt-2 text-right">
      <textarea
        className="w-full p-2 rounded border border-gray-600 text-black mb-2"
        rows={3}
        dir="rtl"
        placeholder="כתוב תדר או שאלה ל-AACOS…"
        value={input}
        onChange={e => setInput(e.target.value)}
        disabled={loading}
        style={{ direction: "rtl" }}
      />
      <button
        onClick={sendSignal}
        disabled={loading || !input.trim()}
        className="w-full py-2 rounded bg-primary text-white font-bold hover:bg-primary/80 transition"
      >
        {loading ? "משדר..." : "שדר תדר"}
      </button>
      <div className="min-h-[50px] mt-3">
        {response && (
          <div className="p-3 rounded bg-gray-800 text-white">{response}</div>
        )}
        {error && (
          <div className="p-3 rounded bg-red-700 text-white">{error}</div>
        )}
      </div>
    </div>
  );
}

