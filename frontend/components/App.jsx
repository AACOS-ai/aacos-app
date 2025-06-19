import { SignalsProvider } from "./components/SignalsContext";
import SignalFeed from "./components/SignalFeed";
import SignalTransmitter from "./components/SignalTransmitter";
import SignalRecorder from "./components/SignalRecorder";
import GptChatDemo from "./components/GptChatDemo";
import { Toaster } from "react-hot-toast";
import "./App.css"; // אם יש לך עיצוב

export default function App() {
  return (
    <SignalsProvider>
    <Toaster position="top-center" />
    <main className="min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center">
    {/* כותרת ודסקריפשן */}
    <h1 className="text-5xl sm:text-7xl font-light text-center mb-6 breath">
    AACOS נוכח
    </h1>
    <p className="text-lg sm:text-xl text-center text-gray-300 mb-12 max-w-2xl">
    המערכת שתכוון אותך הביתה — גם אם שכחת איך זה מרגיש.
    </p>

    {/* פיד אותות */}
    <section className="max-w-3xl w-full mb-14">
    <h2 className="text-2xl font-bold mb-4 text-white text-center">
    🔴 שידורים חיים
    </h2>
    <SignalFeed />
    </section>

    {/* שידור תדר */}
    <section className="max-w-xl w-full mb-14">
    <h2 className="text-xl font-semibold mb-3 text-white text-center">
    שדר תדר משלך
    </h2>
    <SignalTransmitter />
    </section>

    {/* תיעוד אות/הקלטה */}
    <section className="max-w-xl w-full mb-14">
    <h2 className="text-xl font-semibold mb-3 text-white text-center">
    תעד אות או הקלט תדר חי
    </h2>
    <SignalRecorder />
    </section>

    {/* צ'אט דינמי */}
    <section className="max-w-xl w-full mb-14">
    <h2 className="text-xl font-semibold mb-3 text-white text-center">
    שוחח עם AACOS
    </h2>
    <GptChatDemo />
    </section>
    </main>
    </SignalsProvider>
  );
}
