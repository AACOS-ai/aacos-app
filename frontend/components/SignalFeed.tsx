// components/SignalsContext.jsx
"use client";
import { createContext, useState } from "react";

export const SignalsContext = createContext();

export function SignalsProvider({ children }) {
  const [feed, setFeed] = useState([]);
  const [lastSignal, setLastSignal] = useState();
  const [lastRecording, setLastRecording] = useState();

  async function saveSignalToServer(signal) {
    setFeed(prev => [signal, ...prev]);
    setLastSignal(signal);
    // שלח לשרת/DB/Qdrant
    await fetch("http://localhost:8000/api/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "signal", signal }),
    });
  }

  async function saveRecordingToServer(recording) {
    setLastRecording(recording);
    await fetch("http://localhost:8000/api/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "recording", recording }),
    });
  }

  async function saveChatToServer(chat) {
    await fetch("http://localhost:8000/api/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "chat", chat }),
    });
  }

  return (
    <SignalsContext.Provider
      value={{
        feed,
        lastSignal,
        lastRecording,
        saveSignalToServer,
        saveRecordingToServer,
        saveChatToServer,
      }}
    >
      {children}
    </SignalsContext.Provider>
  );
}
