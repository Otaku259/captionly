"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Upload, ChevronDown, Play, Check } from "lucide-react";
import {
  FREE_VIDEO_LIMIT,
  LIFETIME_PRICE_GBP,
  formatPrice,
} from "@/lib/config";
import { colors as c } from "@/lib/theme";

const freeVideoLabel = `${FREE_VIDEO_LIMIT} free video${FREE_VIDEO_LIMIT === 1 ? "" : "s"}`;

function Timecode({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block text-xs tracking-widest mb-4"
      style={{ fontFamily: "var(--font-mono)", color: c.coral }}
    >
      {children}
    </span>
  );
}

function Waveform({ color = c.yellow, bars = 22 }: { color?: string; bars?: number }) {
  const heights = Array.from({ length: bars }, (_, i) =>
    8 + Math.round(18 * Math.abs(Math.sin(i * 0.7 + 1)))
  );
  return (
    <div className="flex items-center gap-1 h-6">
      {heights.map((h, i) => (
        <span
          key={i}
          style={{
            width: 3,
            height: h,
            background: color,
            borderRadius: 2,
            display: "inline-block",
            animation: `bar ${1 + (i % 5) * 0.15}s ease-in-out infinite`,
            animationDelay: `${i * 0.04}s`,
          }}
        />
      ))}
    </div>
  );
}

function CaptionChip({
  children,
  tone = "yellow",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "yellow" | "coral" | "white";
  className?: string;
}) {
  const bg = tone === "yellow" ? c.yellow : tone === "coral" ? c.coral : c.white;
  return (
    <span
      className={`inline-block px-3 py-1 rounded-md font-extrabold uppercase tracking-tight ${className}`}
      style={{ background: bg, color: c.ink, fontFamily: "var(--font-body)", lineHeight: 1.15 }}
    >
      {children}
    </span>
  );
}

function PhoneFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative rounded-[2rem] overflow-hidden ${className}`}
      style={{
        border: `2px solid ${c.lineSoft}`,
        background: `linear-gradient(160deg, #2b1f45 0%, #17202b 45%, #12181f 100%)`,
        boxShadow: "0 30px 60px -20px rgba(0,0,0,0.6)",
      }}
    >
      {children}
    </div>
  );
}

function NavBar() {
  return (
    <header className="w-full">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-extrabold"
            style={{ background: c.yellow, color: c.ink, fontFamily: "var(--font-display)" }}
          >
            C
          </div>
          <span className="text-lg font-semibold" style={{ color: c.white, fontFamily: "var(--font-body)" }}>
            Captionlift
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm" style={{ color: c.whiteSoft, fontFamily: "var(--font-body)" }}>
          <a href="#how" style={{ opacity: 0.85 }}>How it works</a>
          <a href="#styles" style={{ opacity: 0.85 }}>Caption styles</a>
          <a href="#pricing" style={{ opacity: 0.85 }}>Pricing</a>
          <a href="#faq" style={{ opacity: 0.85 }}>FAQ</a>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm hidden sm:inline"
            style={{ color: c.whiteSoft, fontFamily: "var(--font-body)" }}
          >
            Log in
          </Link>
          <a
            href="#upload"
            className="text-sm font-semibold px-4 py-2 rounded-full"
            style={{ background: c.yellow, color: c.ink, fontFamily: "var(--font-body)" }}
          >
            Try it free
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-8 pb-24 grid md:grid-cols-2 gap-14 items-center">
      <div>
        <Timecode>00:00 — UPLOAD A VIDEO</Timecode>
        <h1
          className="text-5xl sm:text-6xl leading-[0.95] mb-6 rise-1"
          style={{ fontFamily: "var(--font-display)", color: c.white, letterSpacing: "0.3px" }}
        >
          Your videos,
          <br />
          <span style={{ color: c.yellow }}>captioned</span> instantly.
        </h1>
        <p className="text-lg mb-8 max-w-md rise-2" style={{ color: c.whiteSoft, fontFamily: "var(--font-body)" }}>
          Upload. Caption. Download. Captionlift transcribes the speech in your video with AI
          and burns clean, readable subtitles straight onto the footage — ready for TikTok,
          Reels or Shorts.
        </p>
        <div className="flex flex-wrap items-center gap-4 rise-3">
          <a
            href="#upload"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold"
            style={{ background: c.yellow, color: c.ink, fontFamily: "var(--font-body)" }}
          >
            <Upload size={18} /> Upload your video
          </a>
          <a
            href="#how"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold"
            style={{ border: `1px solid ${c.lineSoft}`, color: c.white, fontFamily: "var(--font-body)" }}
          >
            See how it works
          </a>
        </div>
        <p className="text-xs mt-6" style={{ color: c.inkSoft, fontFamily: "var(--font-mono)" }}>
          {freeVideoLabel} · no credit card · {formatPrice(LIFETIME_PRICE_GBP)} for unlimited, for life
        </p>
      </div>

      <div className="flex justify-center">
        <PhoneFrame className="w-64 sm:w-72 aspect-[9/16]">
          <div className="absolute inset-0 flex items-center justify-center">
            <Play size={40} color="rgba(255,255,255,0.35)" />
          </div>
          <div className="absolute top-4 left-4">
            <Waveform bars={12} color="rgba(255,255,255,0.4)" />
          </div>
          <div className="absolute bottom-6 left-0 right-0 px-5 flex flex-col items-center gap-2 text-center">
            <CaptionChip tone="yellow">this changes</CaptionChip>
            <CaptionChip tone="white">everything for</CaptionChip>
            <CaptionChip tone="yellow">small creators</CaptionChip>
          </div>
        </PhoneFrame>
      </div>
    </section>
  );
}

function UploadDemo() {
  return (
    <section id="upload" className="max-w-4xl mx-auto px-6 pb-28">
      <div
        className="rounded-3xl p-10 text-center"
        style={{ border: `2px dashed ${c.lineSoft}`, background: c.blackSoft }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: c.yellow }}
        >
          <Upload size={24} color={c.ink} />
        </div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: c.white, fontFamily: "var(--font-body)" }}>
          Drop a video, or click to browse
        </h3>
        <p className="text-sm mb-6" style={{ color: c.inkSoft, fontFamily: "var(--font-body)" }}>
          MP4, MOV or WebM · your {freeVideoLabel} is free
        </p>
        <button
          className="px-6 py-3 rounded-full font-semibold"
          style={{ background: c.yellow, color: c.ink, fontFamily: "var(--font-body)" }}
        >
          Choose a video
        </button>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { tc: "00:00", title: "Upload", body: "Pick a video from your phone or computer. Common formats work out of the box." },
    { tc: "00:08", title: "AI transcribes", body: "Captionlift listens to the speech and generates timestamped captions automatically." },
    { tc: "00:15", title: "Edit & style", body: "Fix any words that came out wrong, then pick a caption look — size, position, colour." },
    { tc: "00:22", title: "Download", body: "Get the finished video with captions burned in, ready to post." },
  ];
  return (
    <section id="how" className="max-w-6xl mx-auto px-6 pb-28">
      <Timecode>HOW IT WORKS</Timecode>
      <h2 className="text-3xl sm:text-4xl mb-12 max-w-lg" style={{ fontFamily: "var(--font-display)", color: c.white }}>
        Four steps. No editing experience needed.
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((s) => (
          <div key={s.tc} className="p-6 rounded-2xl" style={{ background: c.blackSoft, border: `1px solid ${c.lineSoft}` }}>
            <span className="text-xs" style={{ fontFamily: "var(--font-mono)", color: c.coral }}>{s.tc}</span>
            <h3 className="text-lg font-semibold mt-3 mb-2" style={{ color: c.white, fontFamily: "var(--font-body)" }}>
              {s.title}
            </h3>
            <p className="text-sm" style={{ color: c.inkSoft, fontFamily: "var(--font-body)" }}>{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function BeforeAfter() {
  return (
    <section className="max-w-5xl mx-auto px-6 pb-28">
      <Timecode>SEE THE DIFFERENCE</Timecode>
      <h2 className="text-3xl sm:text-4xl mb-12 max-w-lg" style={{ fontFamily: "var(--font-display)", color: c.white }}>
        Same clip. One has captions.
      </h2>
      <div className="grid sm:grid-cols-2 gap-8 justify-items-center">
        <div className="text-center">
          <PhoneFrame className="w-56 aspect-[9/16] mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <Play size={32} color="rgba(255,255,255,0.3)" />
            </div>
          </PhoneFrame>
          <span className="text-xs" style={{ fontFamily: "var(--font-mono)", color: c.inkSoft }}>BEFORE — raw upload</span>
        </div>
        <div className="text-center">
          <PhoneFrame className="w-56 aspect-[9/16] mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <Play size={32} color="rgba(255,255,255,0.3)" />
            </div>
            <div className="absolute bottom-6 left-0 right-0 flex justify-center">
              <CaptionChip tone="yellow">captioned in seconds</CaptionChip>
            </div>
          </PhoneFrame>
          <span className="text-xs" style={{ fontFamily: "var(--font-mono)", color: c.coral }}>AFTER — captioned by AI</span>
        </div>
      </div>
    </section>
  );
}

function StyleBold() {
  return (
    <span
      className="inline-block px-3 py-1 rounded-md font-extrabold uppercase text-sm"
      style={{ background: c.yellow, color: c.ink, fontFamily: "var(--font-body)", transform: "rotate(-2deg)", boxShadow: "0 6px 14px rgba(0,0,0,0.35)" }}
    >
      LET&apos;S GO
    </span>
  );
}

function StyleMinimal() {
  return (
    <span
      className="inline-block text-base tracking-wide"
      style={{
        color: c.white,
        fontFamily: "var(--font-body)",
        textShadow: "0 1px 2px rgba(0,0,0,0.9), 0 -1px 2px rgba(0,0,0,0.9), 1px 0 2px rgba(0,0,0,0.9), -1px 0 2px rgba(0,0,0,0.9)",
      }}
    >
      let&apos;s go
    </span>
  );
}

function StyleKaraoke() {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-bold uppercase" style={{ fontFamily: "var(--font-body)" }}>
      <span style={{ color: "rgba(255,255,255,0.5)" }}>let&apos;s</span>
      <span className="px-2 py-0.5 rounded" style={{ background: c.coral, color: c.white }}>GO</span>
      <span style={{ color: "rgba(255,255,255,0.5)" }}>now</span>
    </span>
  );
}

function StyleSoft() {
  return (
    <span
      className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold"
      style={{ background: "rgba(255,255,255,0.94)", color: c.ink, fontFamily: "var(--font-body)", boxShadow: "0 6px 14px rgba(0,0,0,0.3)" }}
    >
      let&apos;s go
    </span>
  );
}

function CaptionStyles() {
  const styles = [
    { name: "Bold Yellow", bg: "#1B1C21", Render: StyleBold },
    { name: "Clean Minimal", bg: "#20242C", Render: StyleMinimal },
    { name: "Karaoke Pop", bg: "#231B2C", Render: StyleKaraoke },
    { name: "Soft Rounded", bg: "#1C2420", Render: StyleSoft },
  ];
  return (
    <section id="styles" className="max-w-6xl mx-auto px-6 pb-28">
      <Timecode>CAPTION STYLES</Timecode>
      <h2 className="text-3xl sm:text-4xl mb-12 max-w-lg" style={{ fontFamily: "var(--font-display)", color: c.white }}>
        A few looks to start with.
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {styles.map((s) => (
          <div key={s.name} className="text-center">
            <div
              className="rounded-2xl aspect-[9/16] flex items-end justify-center pb-6 px-3 relative overflow-hidden"
              style={{ background: s.bg, border: `1px solid ${c.lineSoft}` }}
            >
              <Play
                size={22}
                color="rgba(255,255,255,0.12)"
                style={{ position: "absolute", top: "42%", left: "50%", transform: "translate(-50%,-50%)" }}
              />
              <div style={{ position: "relative" }}>
                <s.Render />
              </div>
            </div>
            <span className="text-sm mt-3 inline-block" style={{ color: c.whiteSoft, fontFamily: "var(--font-body)" }}>{s.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="px-6 py-28" style={{ background: c.screen }}>
      <div className="max-w-5xl mx-auto">
        <Timecode>PRICING</Timecode>
        <h2 className="text-3xl sm:text-4xl mb-12 max-w-lg" style={{ fontFamily: "var(--font-display)", color: c.ink }}>
          One fair price. No subscription.
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-3xl p-8" style={{ background: c.screenSoft, border: `1px solid rgba(0,0,0,0.08)` }}>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-1" style={{ color: c.inkSoft, fontFamily: "var(--font-body)" }}>Free</h3>
            <div className="text-4xl font-bold mb-6" style={{ color: c.ink, fontFamily: "var(--font-display)" }}>£0</div>
            {[
              `${freeVideoLabel}`,
              "AI-generated captions",
              "Basic style customisation",
              "Small, unobtrusive ads",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 mb-3 text-sm" style={{ color: c.ink, fontFamily: "var(--font-body)" }}>
                <Check size={16} color={c.inkSoft} /> {f}
              </div>
            ))}
          </div>
          <div className="rounded-3xl p-8 relative" style={{ background: c.ink }}>
            <span
              className="absolute -top-3 right-8 text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: c.yellow, color: c.ink, fontFamily: "var(--font-body)" }}
            >
              One-time payment
            </span>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-1" style={{ color: c.yellow, fontFamily: "var(--font-body)" }}>Lifetime</h3>
            <div className="text-4xl font-bold mb-6" style={{ color: c.white, fontFamily: "var(--font-display)" }}>
              {formatPrice(LIFETIME_PRICE_GBP)} <span className="text-base font-normal" style={{ color: c.whiteSoft }}>once</span>
            </div>
            {[
              "Unlimited captioned videos",
              "AI-generated captions",
              "Full style customisation",
              "No ads, ever",
              "Lifetime access — no subscription",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 mb-3 text-sm" style={{ color: c.white, fontFamily: "var(--font-body)" }}>
                <Check size={16} color={c.yellow} /> {f}
              </div>
            ))}
            <a
              href="#upload"
              className="inline-block mt-4 px-6 py-3 rounded-full font-semibold text-sm"
              style={{ background: c.yellow, color: c.ink, fontFamily: "var(--font-body)" }}
            >
              Get lifetime access
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    { q: `Is the ${formatPrice(LIFETIME_PRICE_GBP)} really one-time?`, a: `Yes. You pay once through PayPal and your account is upgraded to lifetime access — no recurring charges, ever.` },
    { q: "What happens after my free video?", a: `You'll be offered the ${formatPrice(LIFETIME_PRICE_GBP)} lifetime upgrade for unlimited videos. Your free usage is tracked on your account, not in your browser, so it can't be reset by refreshing the page.` },
    { q: "How accurate are the captions?", a: "The AI transcription is generally strong for clear speech, but no automated transcription is perfect. You can quickly review and fix any words before downloading." },
    { q: "What video formats and lengths are supported?", a: "Common formats like MP4 and MOV are supported, up to a duration and file size limit shown at upload — this keeps processing fast and keeps the product affordable." },
    { q: "Do you keep my videos?", a: "Uploaded videos and rendered outputs are stored only long enough for you to download your result, then removed." },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="max-w-3xl mx-auto px-6 py-28">
      <Timecode>FAQ</Timecode>
      <h2 className="text-3xl sm:text-4xl mb-10" style={{ fontFamily: "var(--font-display)", color: c.white }}>
        Questions, answered.
      </h2>
      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <div key={item.q} className="rounded-2xl overflow-hidden" style={{ background: c.blackSoft, border: `1px solid ${c.lineSoft}` }}>
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="w-full flex items-center justify-between px-6 py-4 text-left"
            >
              <span className="font-medium" style={{ color: c.white, fontFamily: "var(--font-body)" }}>{item.q}</span>
              <ChevronDown
                size={18}
                color={c.whiteSoft}
                style={{ transform: open === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
              />
            </button>
            {open === i && (
              <p className="px-6 pb-5 text-sm" style={{ color: c.inkSoft, fontFamily: "var(--font-body)" }}>
                {item.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="px-6 py-24 text-center" style={{ background: c.yellow }}>
      <h2 className="text-4xl sm:text-5xl mb-6 max-w-2xl mx-auto" style={{ fontFamily: "var(--font-display)", color: c.ink }}>
        Your next video could already have captions.
      </h2>
      <a
        href="#upload"
        className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold"
        style={{ background: c.ink, color: c.white, fontFamily: "var(--font-body)" }}
      >
        <Upload size={18} /> Upload your first video, free
      </a>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-6 py-10" style={{ background: c.black }}>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm" style={{ color: c.inkSoft, fontFamily: "var(--font-body)" }}>
          © {new Date().getFullYear()} Captionlift
        </span>
        <div className="flex gap-6 text-sm" style={{ color: c.inkSoft, fontFamily: "var(--font-body)" }}>
          <span>Privacy</span>
          <span>Terms</span>
          <span>Contact</span>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div style={{ background: c.black }}>
      <NavBar />
      <Hero />
      <UploadDemo />
      <HowItWorks />
      <BeforeAfter />
      <CaptionStyles />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
