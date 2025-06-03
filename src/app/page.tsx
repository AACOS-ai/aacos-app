"use client";

import Image from "next/image";
import SignalFeed from "@/components/SignalFeed";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans flex flex-col items-center justify-center p-8 sm:p-20 gap-6">
      
      {/* HEADER */}
      <nav className="fixed top-0 left-0 w-full flex justify-between px-8 py-3 bg-background/80 backdrop-blur-md shadow-sm z-20">
        <div className="font-bold text-primary text-xl tracking-tight">AACOS</div>
        <div className="flex gap-6">
          <a href="/docs" className="hover:underline">Docs</a>
          <a href="/about" className="hover:underline">About</a>
          <a href="/join" className="hover:underline">Join</a>
        </div>
      </nav>

      {/* HERO */}
      <header className="flex flex-col items-center gap-4 mt-12">
        <Image
          src="/accos_logo.svg"
          alt="AACOS Logo"
          width={160}
          height={160}
          priority
        />
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-center">
          Welcome to <span className="text-primary">AACOS</span>
        </h1>
        <p className="text-lg text-primary font-semibold mb-2">
          Navigate. Transmit. Evolve.
        </p>
        <p className="max-w-xl text-center text-muted-foreground text-base leading-relaxed">
          מערכת חיה לניווט אותות תודעה — Signal-Driven Navigation for Humans & AI.
        </p>
        <a
          href="/playground"
          className="rounded-full bg-primary px-8 py-3 text-white text-base font-bold shadow-lg hover:bg-primary/80 transition mt-4"
        >
          🚀 Start Signal
        </a>
      </header>

      {/* SIGNAL FEED */}
      <SignalFeed />

      {/* TESTIMONIAL */}
      <blockquote className="italic text-muted-foreground mt-8 border-l-4 border-primary pl-4 max-w-lg text-sm text-center sm:text-left">
        "The most intuitive signal-navigation AI ever built. I actually feel the difference."
        <span className="block mt-2 text-xs text-right">— Early User</span>
      </blockquote>

      {/* FOOTER */}
      <footer className="flex justify-center items-center gap-3 mt-10 text-xs text-muted-foreground">
        <a href="https://github.com/aacos-ai" target="_blank" rel="noopener noreferrer">
          <svg className="inline w-4 h-4 mr-1" />GitHub
        </a>
        |
        <a href="mailto:contact@aacos.ai" className="hover:underline">Contact Us</a>
        <span className="ml-4">© {new Date().getFullYear()} AACOS-AI. All rights reserved.</span>
      </footer>
    </div>
  );
}
