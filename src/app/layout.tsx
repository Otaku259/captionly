import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Captionlift — AI captions for your videos",
  description:
    "Upload a video, let AI generate timestamped captions, then download the finished captioned video. One free video, then a one-time £5 for unlimited lifetime access.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
