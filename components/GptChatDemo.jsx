// components/GptChatDemo.jsx
"use client";
import { useState, useContext } from "react";
import { SignalsContext } from "./SignalsContext";
import { toast } from "react-hot-toast";

export default function GptChatDemo() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const { saveChatToServer } = useContext(SignalsContext);

  async function askGpt() {
    setLoading(true);
    setResponse("");
    try {
      const res = await fetch("http://localhost:8000/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_message: input }),
      });
      const data = await res.json();
      const answer = data.gpt_response || data.error;
      setResponse(answer);
      await saveChatToServer({ question: input, answer });
      toast.success("שיחה נשמרה!");
    } catch (err) {
      setResponse("Network error: " + err.message);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-xl mx-auto p-4 bg-gray-900 rounded-xl shadow mt-10">
      <h2 className="text-lg font-semibold mb-4 text-white">דבר עם AACOS</h2>
      <textarea
        className="w-full rounded p-2 mb-2 text-black"
        rows={3}
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="כתוב הודעה ל־AACOS..."
        dir="rtl"
        style={{ direction: "rtl" }}
      />
      <button
        className="w-full bg-primary text-white py-2 rounded font-bold mt-2"
        onClick={askGpt}
        disabled={loading || !input.trim()}
      >
        {loading ? "חושב..." : "שלח"}
      </button>
      <div className="min-h-[50px] mt-4 text-white">
        {response && (
          <div className="bg-gray-800 rounded p-3">{response}</div>
        )}
      </div>
    </div>
  );
}
