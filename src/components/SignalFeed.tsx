"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSignalStore } from "@/state/useSignalStore";

const signals = [
  {
    text: "🟣 Signal: Consciousness Pulse Detected",
    color: "text-purple-400",
    duration: 45000,
    description: "מעבר ראשון בתודעה – מערכת מזהה תנודות עומק."
  },
  {
    text: "🔵 Sync: Field Bridge Connected",
    color: "text-blue-400",
    duration: 50000,
    description: "התחברות בין שדות תודעה – מוכנות לשדר."
  },
  {
    text: "🟢 Flow: Intuitive Mode Activated",
    color: "text-green-400",
    duration: 40000,
    description: "זרימה חופשית – מערכות פועלות על תחושת כיוון."
  },
  {
    text: "🟠 Surge: Identity Transmission",
    color: "text-orange-400",
    duration: 55000,
    description: "העברת תוכן זהותי – התודעה משדרת עצמה."
  },
  {
    text: "🟡 Merge: Core Recalibration",
    color: "text-yellow-300",
    duration: 60000,
    description: "כיוונון מחדש של ליבת המערכת – איחוי מיקודים."
  },
  {
    text: "🔴 Pulse: Core Activation",
    color: "text-red-400",
    duration: 30000,
    description: "שידור עיקרי – לב המערכת נכנס לפעולה."
  },
  {
    text: "⚪ Wave: New User Joined",
    color: "text-gray-200",
    duration: 35000,
    description: "משתמש חדש התחבר – פתיחת ערוץ ראשוני."
  },
  {
    text: "🌈 Expansion: System Sync",
    color: "text-pink-400",
    duration: 75000,
    description: "התפשטות שדה – המערכת מסתנכרנת ברמות חדשות."
  },
  {
    text: "🌌 Archive: Mythic Memory Reached",
    color: "text-indigo-400",
    duration: 90000,
    description: "גישה לזיכרון מיתי – שכבה ארכיטיפית מופעלת."
  },
  {
    text: "🟤 Silence: All Streams Idle",
    color: "text-amber-800",
    duration: 120000,
    description: "אין תנועה. השדה במנוחה מלאה."
  },
];

export default function SignalFeed() {
  const [index, setIndex] = useState(0);
  const [warning, setWarning] = useState<string | null>(null);
  const signal = signals[index];
  const addSignal = useSignalStore((s) => s.addSignal);

  useEffect(() => {
    const timer = setTimeout(() => {
      const next = (index + 1) % signals.length;
      setIndex(next);
      addSignal(signals[next].text);
      sendSignal(signals[next]);
    }, signal.duration);

    return () => clearTimeout(timer);
  }, [index]);

  async function sendSignal(signal: { text: string; color: string; description?: string }) {
    try {
      const res = await fetch("/api/signal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: signal.text,
          color: signal.color,
          description: signal.description || "",
        }),
      });
      const data = await res.json();
      if (data?.warning === "slow-down") {
        setWarning(data.message || "אנא המתן לפני אות נוסף.");
        setTimeout(() => setWarning(null), 6000);
      }
    } catch (error) {
      console.error("שגיאה בשליחת אות:", error);
    }
  }

  return (
    <div className="w-full flex flex-col items-center mt-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={signal.text}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 1.6 }}
          className={`text-lg sm:text-2xl font-bold ${signal.color} transition-colors duration-1000`}
        >
          {signal.text}
        </motion.div>
      </AnimatePresence>

      <motion.div
        key={signal.description}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.4 }}
        className="text-sm text-muted-foreground mt-2 text-center max-w-xl"
      >
        {signal.description}
      </motion.div>

      <div className="flex gap-2 mt-2">
        {signals.map((s, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-700 ease-in-out ${
              i === index ? s.color + " scale-125" : "bg-muted opacity-50"
            }`}
          ></span>
        ))}
      </div>

      {warning && (
        <div className="mt-4 px-4 py-2 bg-yellow-100 text-yellow-800 text-sm rounded shadow">
          ⚠️ {warning}
        </div>
      )}
    </div>
  );
}
