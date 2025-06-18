// components/SignalTransmitter.jsx
"use client";
import { useContext, useState } from "react";
import { SignalsContext } from "./SignalsContext";
import { toast } from "react-hot-toast";

export default function SignalTransmitter() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { saveSignalToServer } = useContext(SignalsContext);

  async function send() {
    setLoading(true);
    await saveSignalToServer(input);
    toast.success("תדר נשלח ונשמר!");
    setInput("");
    setLoading(false);
  }

  return (
    <div>
      <textarea
        className="w-full p-2 rounded mb-2 text-black"
        rows={2}
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="כתוב תדר או איתות..."
        dir="rtl"
        disabled={loading}
      />
      <button
        className="bg-primary text-white py-2 px-5 rounded font-bold"
        onClick={send}
        disabled={loading || !input.trim()}
      >
        {loading ? "משדר..." : "שדר תדר"}
      </button>
    </div>
  );
}
