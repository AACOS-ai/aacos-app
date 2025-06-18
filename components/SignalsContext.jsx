"use client";
import { createContext, useState, useContext } from "react";
export const SignalsContext = createContext();

export function SignalsProvider({ children }) {
  const [feed, setFeed] = useState([]);           // פיד עולמי
  const [lastSignal, setLastSignal] = useState(); // תדר אחרון
  const [lastRecording, setLastRecording] = useState();

  // קריאות אוטומטיות לשרת (שמירה ל־Postgres/Qdrant/Logs)
  async function saveSignalToServer(signal) {
    setFeed((prev) => [signal, ...prev]);
    setLastSignal(signal);
    // קריאה אוטומטית ללוג/DB (POST לשרת שלך)
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
    <SignalsContext.Provider value={{
      feed, lastSignal, lastRecording,
      saveSignalToServer, saveRecordingToServer, saveChatToServer
    }}>
      {children}
    </SignalsContext.Provider>
  );
}
