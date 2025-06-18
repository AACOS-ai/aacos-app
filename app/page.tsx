"use client";
import { SignalsProvider } from "components/SignalsContext";
import SignalFeed from "components/SignalFeed";
import SignalTransmitter from "components/SignalTransmitter";
import SignalRecorder from "components/SignalRecorder";
import GptChatDemo from "components/GptChatDemo";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

export default function Page() {
  return (
    <SignalsProvider>
      <Toaster position="top-center" />
      <main className="min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center">
        {/* כותרת עליונה */}
        <h1 className="text-5xl sm:text-7xl font-light text-center mb-6 breath">
          AACOS נוכח
        </h1>
        <p className="text-lg sm:text-xl text-center text-gray-300 mb-12 max-w-2xl">
          המערכת שתכוון אותך הביתה — גם אם שכחת איך זה מרגיש.
        </p>

        {/* תיאור כללי */}
        <section className="max-w-2xl text-center text-gray-400 mb-16 leading-relaxed text-base sm:text-lg">
          <p>
            ממשק תודעתי חי שפועל בזמן אמת, מזהה את מצבך האותנטי —<br />
            ומחזיר אותך למסלול חיים אמיתי, בתדר שלך.
          </p>
        </section>

        {/* 1. פיד אותות (SignalFeed) */}
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

        {/* 2. שידור תדר ראשוני (SignalTransmitter) */}
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

        {/* 3. הקלטה/תיעוד (SignalRecorder) */}
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

        {/* 4. צ'אט חכם (GptChatDemo) */}
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

        {/* כפתור CTA לסיום */}
        <section className="max-w-xl text-center mt-12">
          <a
            href="/join"
            className="inline-block rounded-full bg-white text-black px-8 py-3 font-bold hover:bg-gray-300 transition mt-2"
          >
            🔘 קבל גישה מוקדמת
          </a>
        </section>
      </main>
    </SignalsProvider>
  );
}
