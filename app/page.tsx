"use client";
import { useContext } from "react";
import { SignalsProvider, SignalsContext } from "components/SignalsContext";
import SignalFeed from "components/SignalFeed";
import SignalTransmitter from "components/SignalTransmitter";
import SignalRecorder from "components/SignalRecorder";
import GptChatDemo from "components/GptChatDemo";
import { Toaster, toast } from "react-hot-toast";
import { motion } from "framer-motion";

export default function Page() {
  return (
    <SignalsProvider>
      <Toaster position="top-center" />
      <main className="min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center">
        {/* ... כותרת, פתיח, סקשנים כמו קודם ... */}
        <h1 className="text-5xl sm:text-7xl font-light text-center mb-6 breath">
          AACOS נוכח
        </h1>
        {/* ... עוד סקשנים ... */}

        {/* 1. פיד אותות */}
        <motion.section
          className="max-w-3xl w-full mb-14"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-white text-center">
            🔴 שידורים חיים
          </h2>
          <SignalFeed />
        </motion.section>

        {/* 2. שידור תדר ראשוני */}
        <motion.section
          className="max-w-xl w-full mb-14"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0, delay: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl font-semibold mb-3 text-white text-center">
            שדר תדר משלך
          </h2>
          <SignalTransmitter />
        </motion.section>

        {/* 3. הקלטה/תיעוד */}
        <motion.section
          className="max-w-xl w-full mb-14"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0, delay: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl font-semibold mb-3 text-white text-center">
            תעד אות או הקלט תדר חי
          </h2>
          <SignalRecorder />
        </motion.section>

        {/* 4. צ'אט דינמי */}
        <motion.section
          className="max-w-xl w-full mb-14"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0, delay: 0.6 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl font-semibold mb-3 text-white text-center">
            שוחח עם AACOS
          </h2>
          <GptChatDemo />
        </motion.section>
      </main>
    </SignalsProvider>
  );
}
