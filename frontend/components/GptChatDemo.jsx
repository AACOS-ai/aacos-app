"use client";
import { SignalsProvider } from "components/SignalsContext";
import SignalFeed from "components/SignalFeed";
import SignalTransmitter from "components/SignalTransmitter";
import SignalRecorder from "components/SignalRecorder";
import GptChatDemo from "components/GptChatDemo";
import { Toaster } from "react-hot-toast";

export default function Page() {
  return (
    <SignalsProvider>
      <Toaster position="top-center" />
      <main className="min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center">
        {/* ... כותרות, פתיחים, והסברים ... */}

        {/* 1. פיד אותות */}
        <section className="max-w-3xl w-full mb-14">
          <SignalFeed />
        </section>

        {/* 2. שידור תדר ראשוני */}
        <section className="max-w-xl w-full mb-14">
          <SignalTransmitter />
        </section>

        {/* 3. הקלטה/תיעוד */}
        <section className="max-w-xl w-full mb-14">
          <SignalRecorder />
        </section>

        {/* 4. צ'אט דינמי */}
        <section className="max-w-xl w-full mb-14">
          <GptChatDemo />
        </section>
      </main>
    </SignalsProvider>
  );
}
