// components/SignalFeed.jsx
"use client";
import { useContext } from "react";
import { SignalsContext } from "./SignalsContext";

export default function SignalFeed() {
  const { feed } = useContext(SignalsContext);

  return (
    <div className="w-full bg-gray-900 rounded-lg p-4 mb-6 min-h-[120px]">
    {feed.length === 0 ? (
      <div className="text-center text-gray-400">אין עדיין תדרים. תהיה הראשון!</div>
    ) : (
      <ul className="space-y-2">
      {feed.map((signal, idx) => (
        <li
        key={idx}
        className="bg-gray-800 rounded p-3 text-right"
        dir="rtl"
        >
        {typeof signal === "string"
          ? signal
          : JSON.stringify(signal, null, 2)}
          </li>
      ))}
      </ul>
    )}
    </div>
  );
}
